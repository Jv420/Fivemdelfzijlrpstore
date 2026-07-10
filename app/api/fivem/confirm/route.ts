import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql';
import { getRequiredEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

function authorized(request: Request) {
  const expected = getRequiredEnv('FIVEM_BRIDGE_SECRET');
  const provided = request.headers.get('x-fivem-secret');
  return Boolean(provided && expected === provided);
}

export async function POST(request: Request) {
  try {
    if (!authorized(request)) {
      logger.warn('Unauthorized FiveM confirm request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null) as { id?: number; ok?: boolean; error?: string } | null;

    if (!body?.id || !Number.isInteger(Number(body.id))) {
      return NextResponse.json({ error: 'Order id ontbreekt of is ongeldig' }, { status: 400 });
    }

    const pool = getPool();
    const [result] = await pool.execute(
      `update pending_orders
       set status = :status,
           delivery_error = :delivery_error,
           delivered_at = :delivered_at,
           processing_at = null
       where id = :id`,
      {
        id: body.id,
        status: body.ok ? 'delivered' : 'failed',
        delivery_error: body.error || null,
        delivered_at: body.ok ? new Date() : null,
      }
    );

    logger.info('FiveM delivery confirmed', { id: body.id, ok: Boolean(body.ok) });
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    logger.error('FiveM confirm API failed', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Kon delivery status niet opslaan' }, { status: 500 });
  }
}
