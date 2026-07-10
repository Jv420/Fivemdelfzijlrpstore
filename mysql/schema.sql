create table if not exists pending_orders (
  id bigint unsigned not null auto_increment,
  stripe_session_id varchar(255) not null,
  product_id varchar(100) not null,
  product_name varchar(255) not null,
  player_license varchar(128) not null,
  player_name varchar(100) null,
  delivery_command text not null,
  status enum('pending','delivered','failed') not null default 'pending',
  amount_total int unsigned not null,
  currency varchar(10) not null default 'eur',
  delivery_error text null,
  created_at timestamp not null default current_timestamp,
  delivered_at timestamp null default null,
  primary key (id),
  unique key uq_pending_orders_stripe_session_id (stripe_session_id),
  key idx_pending_orders_status_created (status, created_at),
  key idx_pending_orders_player_license (player_license)
) engine=InnoDB default charset=utf8mb4 collate=utf8mb4_unicode_ci;
