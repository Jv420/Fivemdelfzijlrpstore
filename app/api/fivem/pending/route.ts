import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql';
import { getRequiredEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

function authorized(request: Request) {
  const expected = getRequiredEnv('FIVEM_BRIDGE_SECRET');
  const provided = request.headers.get('x-fivem-secret');
  return Boolean(provided && expected === provided);
}

export async function GET(request: Request) {
  try {
    if (!authorized(request)) {
      logger.warn('Unauthorized FiveM pending request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pool = getPool();
    const [rows] = await pool.execute(
      `select id, product_id, product_name, player_license, player_name, delivery_command
       from pending_orders
       where status = 'pending'
       order by created_at asc
       limit 10`
    );

    return NextResponse.json({ orders: rows });
  } catch (error) {
    logger.error('FiveM pending API failed', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Kon pending orders niet ophalen' }, { status: 500 });
  }
}
