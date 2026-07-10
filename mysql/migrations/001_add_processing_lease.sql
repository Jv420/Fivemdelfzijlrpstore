alter table pending_orders
  modify column status enum('pending','processing','delivered','failed') not null default 'pending',
  add column if not exists delivery_attempts int unsigned not null default 0 after delivery_error,
  add column if not exists processing_at timestamp null default null after delivery_attempts,
  add index if not exists idx_pending_orders_processing_at (processing_at);
