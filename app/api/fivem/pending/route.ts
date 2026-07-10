import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql';

function authorized(request: Request) {
  const expected = process.env.FIVEM_BRIDGE_SECRET;
  const provided = request.headers.get('x-fivem-secret');
  return Boolean(expected && provided && expected === provided);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
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
}
