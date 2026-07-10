import { NextResponse } from 'next/server';
import { getPool } from '@/lib/mysql';

function authorized(request: Request) {
  const expected = process.env.FIVEM_BRIDGE_SECRET;
  const provided = request.headers.get('x-fivem-secret');
  return Boolean(expected && provided && expected === provided);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { id?: number; ok?: boolean; error?: string } | null;

  if (!body?.id) {
    return NextResponse.json({ error: 'Order id ontbreekt' }, { status: 400 });
  }

  const pool = getPool();
  await pool.execute(
    `update pending_orders
     set status = :status,
         delivery_error = :delivery_error,
         delivered_at = :delivered_at
     where id = :id`,
    {
      id: body.id,
      status: body.ok ? 'delivered' : 'failed',
      delivery_error: body.error || null,
      delivered_at: body.ok ? new Date() : null,
    }
  );

  return NextResponse.json({ ok: true });
}
