-- ============================================================
-- Seed data: 11 sản phẩm hải sản đặc sản
-- Chạy SAU schema.sql
-- ============================================================

insert into products (name, price_per_kg, image_url, is_available, sort_order)
values
  ('Mực trứng',                    300000, null, true,  1),
  ('Mực ống',                      300000, null, true,  2),
  ('Mực hấp',                      170000, null, true,  3),
  ('Cá thu 1 nắng',                270000, null, true,  4),
  ('Cá mối 1 nắng',                120000, null, true,  5),
  ('Cá đù 1 nắng',                 150000, null, true,  6),
  ('Cá nanh đù 1 nắng giã nghệ',   230000, null, true,  7),
  ('Cá thu tươi cắt khúc',         250000, null, true,  8),
  ('Cá lục chạch',                  90000, null, true,  9),
  ('Cá thu nướng',                 350000, null, true, 10),
  ('Tôm nõn sắt',                  150000, null, true, 11)
on conflict do nothing;

-- ============================================================
-- Ghi chú:
-- Để thêm ảnh sản phẩm:
--   1. Upload ảnh lên Supabase Storage (bucket: products)
--   2. Lấy Public URL và UPDATE vào cột image_url
--
-- Ví dụ:
--   update products set image_url = 'https://xxx.supabase.co/storage/v1/object/public/products/muc-trung.jpg'
--   where name = 'Mực trứng';
--
-- Để ẩn sản phẩm hết hàng:
--   update products set is_available = false where name = 'Mực trứng';
-- ============================================================
