import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function authorized(request: Request) {
  const expected = process.env.FIVEM_BRIDGE_SECRET;
  const provided = request.headers.get('x-fivem-secret');
  return Boolean(expected && provided && expected === provided);
}

export async function POST(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { id?: string; ok?: boolean; error?: string } | null;

  if (!body?.id) {
    return NextResponse.json({ error: 'Order id ontbreekt' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('pending_orders')
    .update({
      status: body.ok ? 'delivered' : 'failed',
      delivery_error: body.error || null,
      delivered_at: body.ok ? new Date().toISOString() : null,
    })
    .eq('id', body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
