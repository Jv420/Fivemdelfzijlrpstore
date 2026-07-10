alter table pending_orders
  modify column player_license varchar(128) null,
  modify column player_name varchar(100) not null;

create index idx_pending_orders_player_name on pending_orders (player_name);
