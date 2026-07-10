import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';
import { getRequiredEnv, getSiteUrl } from '@/lib/env';
import { logger } from '@/lib/logger';

const stripe = new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'));

function isValidLicense(value: string) {
  return /^[a-zA-Z0-9:_-]{8,128}$/.test(value);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productId = String(formData.get('productId') || '');
    const license = String(formData.get('license') || '').trim();
    const playerName = String(formData.get('playerName') || '').trim();
    const product = getProduct(productId);
    const siteUrl = getSiteUrl();

    if (!product || !license || !playerName) {
      return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 });
    }

    if (!isValidLicense(license)) {
      return NextResponse.json({ error: 'Ongeldige FiveM license identifier' }, { status: 400 });
    }

    if (playerName.length < 2 || playerName.length > 40) {
      return NextResponse.json({ error: 'Ongeldige spelernaam' }, { status: 400 });
    }

    if (product.priceCents < 50) {
      return NextResponse.json({ error: 'Productprijs is lager dan het veilige Stripe minimum' }, { status: 400 });
    }

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
        license,
        playerName,
      },
    });

    if (!session.url) {
      logger.error('Stripe session created without URL', { productId });
      return NextResponse.json({ error: 'Geen Stripe checkout URL ontvangen' }, { status: 500 });
    }

    logger.info('Checkout session created', { productId, sessionId: session.id });
    return NextResponse.redirect(session.url, 303);
  } catch (error) {
    logger.error('Checkout route failed', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Checkout kon niet worden gestart' }, { status: 500 });
  }
}
