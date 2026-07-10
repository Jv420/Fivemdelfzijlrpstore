create extension if not exists pgcrypto;

create table if not exists pending_orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  product_id text not null,
  product_name text not null,
  player_license text not null,
  player_name text,
  delivery_command text not null,
  status text not null default 'pending' check (status in ('pending', 'delivered', 'failed')),
  amount_total integer not null,
  currency text not null default 'eur',
  delivery_error text,
  created_at timestamptz not null default now(),
  delivered_at timestamptz
);

create index if not exists pending_orders_status_created_idx on pending_orders (status, created_at);

alter table pending_orders enable row level security;

-- Service role key bypasses RLS. Do not expose SUPABASE_SERVICE_ROLE_KEY in browser/client code.
