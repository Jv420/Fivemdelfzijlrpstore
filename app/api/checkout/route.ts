import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';
import { getRequiredEnv, getSiteUrl } from '@/lib/env';
import { logger } from '@/lib/logger';

function getStripe() {
  return new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'));
}

function isValidPlayerName(value: string) {
  return value.length >= 2 && value.length <= 40 && !/[\r\n<>]/.test(value);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productId = String(formData.get('productId') || '');
    const playerName = String(formData.get('playerName') || '').trim();
    const product = getProduct(productId);
    const siteUrl = getSiteUrl();

    if (!product || !playerName) {
      return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 });
    }

    if (!isValidPlayerName(playerName)) {
      return NextResponse.json({ error: 'Ongeldige spelernaam' }, { status: 400 });
    }

    if (product.priceCents < 50) {
      return NextResponse.json({ error: 'Productprijs is lager dan het veilige Stripe minimum' }, { status: 400 });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['ideal', 'card'],
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cancel`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: product.priceCents,
            product_data: {
              name: product.name,
              description: product.description,
            },
          },
        },
      ],
      metadata: {
        productId: product.id,
        playerName,
      },
    });

    if (!session.url) {
      logger.error('Stripe session created without URL', { productId });
      return NextResponse.json({ error: 'Geen Stripe checkout URL ontvangen' }, { status: 500 });
    }

    logger.info('Checkout session created', { productId, sessionId: session.id, playerName });
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    logger.error('Checkout route failed', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Checkout kon niet worden gestart' }, { status: 500 });
  }
}
