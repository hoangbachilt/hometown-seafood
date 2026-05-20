-- ============================================================
-- Hải Sản Đặc Sản Quê — Supabase Schema
-- Chạy file này trong Supabase SQL Editor
-- ============================================================

-- Bảng sản phẩm
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text    not null,
  price_per_kg integer not null check (price_per_kg > 0),
  image_url    text,
  is_available boolean not null default true,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now()
);

comment on table products is 'Danh mục sản phẩm hải sản';
comment on column products.price_per_kg is 'Giá theo kg, đơn vị: VNĐ';
comment on column products.is_available is 'false = ẩn sản phẩm (hết hàng)';
comment on column products.sort_order is 'Thứ tự hiển thị, số nhỏ hiển thị trước';

-- Bảng đơn hàng
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  customer_name    text    not null,
  customer_phone   text    not null,
  customer_address text    not null,
  items            jsonb   not null,
  total_amount     integer not null check (total_amount > 0),
  status           text    not null default 'pending'
                   check (status in ('pending', 'delivered')),
  created_at       timestamptz not null default now()
);

comment on table orders is 'Đơn hàng của khách';
comment on column orders.items is
  'JSON array: [{ name, quantity, price_per_kg, subtotal }]';
comment on column orders.status is
  'pending = chờ xử lý, delivered = đã giao';

-- Indexes
create index if not exists idx_products_sort on products (sort_order) where is_available = true;
create index if not exists idx_orders_created on orders (created_at desc);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- products: public read, no client write
alter table products enable row level security;

drop policy if exists "Public can read available products" on products;
create policy "Public can read available products"
  on products
  for select
  using (is_available = true);

-- orders: no client access (only server-side via service role key)
alter table orders enable row level security;
-- No policies = no client access
