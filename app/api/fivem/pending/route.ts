import { NextResponse } from 'next/server';
import type { RowDataPacket } from 'mysql2';
import { getPool } from '@/lib/mysql';
import { getRequiredEnv } from '@/lib/env';
import { logger } from '@/lib/logger';

function authorized(request: Request) {
  const expected = getRequiredEnv('FIVEM_BRIDGE_SECRET');
  const provided = request.headers.get('x-fivem-secret');
  return Boolean(provided && expected === provided);
}

type PendingOrder = RowDataPacket & {
  id: number;
  product_id: string;
  product_name: string;
  player_license: string;
  player_name: string | null;
  delivery_command: string;
};

export async function GET(request: Request) {
  if (!authorized(request)) {
    logger.warn('Unauthorized FiveM pending request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const connection = await getPool().getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `update pending_orders
       set status = 'pending', processing_at = null,
           delivery_error = 'Delivery lease expired; automatically queued again'
       where status = 'processing'
         and processing_at < (utc_timestamp() - interval 5 minute)`
    );

    const [orders] = await connection.execute<PendingOrder[]>(
      `select id, product_id, product_name, player_license, player_name, delivery_command
       from pending_orders
       where status = 'pending'
       order by created_at asc
       limit 10
       for update`
    );

    if (orders.length > 0) {
      const ids = orders.map((order) => order.id);
      const placeholders = ids.map(() => '?').join(',');

      await connection.query(
        `update pending_orders
         set status = 'processing', processing_at = utc_timestamp(),
             delivery_attempts = delivery_attempts + 1, delivery_error = null
         where id in (${placeholders}) and status = 'pending'`,
        ids
      );
    }

    await connection.commit();
    logger.info('FiveM orders claimed', { count: orders.length });
    return NextResponse.json({ orders });
  } catch (error) {
    await connection.rollback();
    logger.error('FiveM pending API failed', { error: error instanceof Error ? error.message : String(error) });
    return NextResponse.json({ error: 'Kon pending orders niet ophalen' }, { status: 500 });
  } finally {
    connection.release();
  }
}
