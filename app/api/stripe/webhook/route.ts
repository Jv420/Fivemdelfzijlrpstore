import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { getProduct } from '@/lib/products';
import { getPool } from '@/lib/mysql';
import { getRequiredEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';

function getStripe() {
  return new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'));
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = getRequiredEnv('STRIPE_WEBHOOK_SECRET');

  if (!signature) {
    logger.warn('Stripe webhook missing signature');
    return NextResponse.json({ error: 'Stripe signature ontbreekt' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    logger.warn('Invalid Stripe webhook signature', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Ongeldige Stripe signature' }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const productId = session.metadata?.productId || '';
      const playerName = session.metadata?.playerName?.trim() || '';
      const product = getProduct(productId);

      if (!product || !playerName) {
        logger.warn('Webhook missing valid product or player name', { sessionId: session.id, productId });
        return NextResponse.json({ error: 'Product of spelernaam ontbreekt' }, { status: 400 });
      }

      if (session.payment_status !== 'paid') {
        logger.warn('Checkout completed but payment is not paid', { sessionId: session.id, paymentStatus: session.payment_status });
        return NextResponse.json({ received: true, ignored: 'payment_not_paid' });
      }

      const pool = getPool();

      await pool.execute(
        `insert into pending_orders
          (stripe_session_id, product_id, product_name, player_license, player_name, delivery_command, status, amount_total, currency)
         values
          (:stripe_session_id, :product_id, :product_name, null, :player_name, :delivery_command, 'pending', :amount_total, :currency)
         on duplicate key update
          product_id = values(product_id),
          product_name = values(product_name),
          player_name = values(player_name),
          delivery_command = values(delivery_command),
          amount_total = values(amount_total),
          currency = values(currency)`,
        {
          stripe_session_id: session.id,
          product_id: product.id,
          product_name: product.name,
          player_name: playerName,
          delivery_command: product.command,
          amount_total: session.amount_total || product.priceCents,
          currency: session.currency || 'eur',
        }
      );

      logger.info('Order queued from Stripe webhook', { sessionId: session.id, productId: product.id, playerName });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Stripe webhook processing failed', { eventType: event.type, error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Webhook verwerking mislukt' }, { status: 500 });
  }
}
