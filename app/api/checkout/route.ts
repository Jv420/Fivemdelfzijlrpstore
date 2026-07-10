import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const productId = String(formData.get('productId') || '');
  const license = String(formData.get('license') || '').trim();
  const playerName = String(formData.get('playerName') || '').trim();
  const product = getProduct(productId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  if (!product || !license || !playerName) {
    return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 });
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
    return NextResponse.json({ error: 'Geen Stripe checkout URL ontvangen' }, { status: 500 });
  }

  return NextResponse.redirect(session.url, 303);
}
