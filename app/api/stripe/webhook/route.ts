import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';
import { supabaseAdmin } from '@/lib/supabase';

export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Webhook niet geconfigureerd' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: 'Ongeldige Stripe signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.productId || '';
    const license = session.metadata?.license || '';
    const playerName = session.metadata?.playerName || '';
    const product = getProduct(productId);

    if (!product || !license) {
      return NextResponse.json({ error: 'Product of license ontbreekt' }, { status: 400 });
    }

    const deliveryCommand = product.command.replaceAll('{license}', license);

    const { error } = await supabaseAdmin.from('pending_orders').upsert(
      {
        stripe_session_id: session.id,
        product_id: product.id,
        product_name: product.name,
        player_license: license,
        player_name: playerName,
        delivery_command: deliveryCommand,
        status: 'pending',
        amount_total: session.amount_total || product.priceCents,
        currency: session.currency || 'eur',
      },
      { onConflict: 'stripe_session_id' }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
