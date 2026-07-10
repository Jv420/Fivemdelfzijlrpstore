import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function authorized(request: Request) {
  const expected = process.env.FIVEM_BRIDGE_SECRET;
  const provided = request.headers.get('x-fivem-secret');
  return Boolean(expected && provided && expected === provided);
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('pending_orders')
    .select('id, product_id, product_name, player_license, player_name, delivery_command')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders: data || [] });
}
