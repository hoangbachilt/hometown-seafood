# Design: Hệ Thống Bán Hàng Hải Sản Đặc Sản Qua Zalo In-App Browser

**Ngày:** 2026-05-20  
**Phiên bản:** 1.0  
**Tác giả:** Brainstorming session

---

## Tổng Quan

Xây dựng một Mobile-First Web App bán hải sản đặc sản địa phương, tối ưu cho Zalo In-App Browser. Khách hàng nhận link ghim trong nhóm Zalo, bấm vào mở app, chọn món, đặt hàng COD. Shop nhận thông báo real-time qua Telegram Bot. Toàn bộ hạ tầng chạy trên Free Tier — chi phí 0 đồng.

**Ràng buộc thiết kế:**
- Không có giấy phép kinh doanh → không dùng Zalo Mini App chính thức hoặc Zalo OA xác thực
- Không thuê server/VPS → dùng Vercel (Serverless) + Supabase (BaaS)
- Zalo In-App Browser không duy trì session lâu dài → dùng `localStorage` để persist state

---

## Danh Mục Sản Phẩm Ban Đầu

| # | Tên sản phẩm | Giá |
|---|---|---|
| 1 | Mực trứng | 300.000đ/kg |
| 2 | Mực ống | 300.000đ/kg |
| 3 | Mực hấp | 170.000đ/kg |
| 4 | Cá thu 1 nắng | 270.000đ/kg |
| 5 | Cá mối 1 nắng | 120.000đ/kg |
| 6 | Cá đù 1 nắng | 150.000đ/kg |
| 7 | Cá nanh đù 1 nắng giã nghệ | 230.000đ/kg |
| 8 | Cá thu tươi cắt khúc | 250.000đ/kg |
| 9 | Cá lục chạch | 90.000đ/kg |
| 10 | Cá thu nướng | 350.000đ/kg |
| 11 | Tôm nõn sắt | 150.000đ/kg |

---

## Kiến Trúc Hệ Thống

### Stack (Zero-Cost)

| Lớp | Công nghệ | Gói |
|-----|-----------|-----|
| Frontend + API | Next.js 14 (App Router) | — |
| Hosting | Vercel | Free |
| Database | Supabase (PostgreSQL) | Free (500MB) |
| Notification | Telegram Bot API | Free |
| Styling | Tailwind CSS | — |

### Sơ Đồ Kiến Trúc

```
┌─────────────────────────────────────────┐
│           Zalo In-App Browser           │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     Next.js Web App (Vercel)      │  │
│  │                                   │  │
│  │  /          → Trang sản phẩm      │  │
│  │  /cart      → Giỏ hàng            │  │
│  │  /checkout  → Thanh toán          │  │
│  │  /success   → Đặt hàng thành công │  │
│  │                                   │  │
│  │  /api/checkout  → Route Handler   │  │
│  └───────────┬───────────────────────┘  │
└──────────────┼──────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
  ┌─────────┐    ┌─────────────┐
  │Supabase │    │Telegram Bot │
  │PostgreSQL│   │  API        │
  │products │    │(thông báo   │
  │orders   │    │  đơn mới)   │
  └─────────┘    └─────────────┘
```

---

## Màn Hình & Điều Hướng

### Bottom Navigation Bar (cố định phía dưới)

```
[ 🏠 Sản phẩm ]  [ 🛒 Giỏ hàng (n) ]  [ 👤 Thông tin ]
```

Badge số lượng trên icon Giỏ hàng cập nhật real-time khi thêm/bớt món.

### 1. Trang Sản Phẩm — `/`

- Header: tên shop + banner hình ảnh gợi cảm giác biển quê
- Danh sách 11 sản phẩm dạng card: ảnh, tên, giá/kg, nút `+ Thêm`
- Nhấn `+ Thêm` → hiện popup/bottom-sheet chọn số lượng (kg) → thêm vào giỏ
- Nếu sản phẩm `is_available = false` thì ẩn khỏi danh sách

### 2. Giỏ Hàng — `/cart`

- Danh sách các món đã chọn: tên, số kg, thành tiền, nút `+/-` điều chỉnh
- Tổng tiền hiển thị phía dưới
- Nút **"Đặt hàng"** → chuyển sang `/checkout`
- Trạng thái trống: minh hoạ + nút quay lại chọn món

### 3. Thanh Toán — `/checkout`

- Tóm tắt đơn hàng phía trên (read-only)
- Form 3 trường: **Họ tên**, **Số điện thoại**, **Địa chỉ giao hàng**
- Auto-fill từ `localStorage` nếu khách đã mua lần trước
- Ghi chú cố định: *"Thanh toán khi nhận hàng (COD)"*
- Nút **"Chốt đơn"** → loading state → gọi `/api/checkout`
- Hiển thị lỗi inline nếu validation thất bại hoặc API lỗi

### 4. Thành Công — `/success`

- Icon ✅ + lời chúc mua hàng thành công
- Tóm tắt đơn: danh sách món, tổng tiền, địa chỉ giao
- Thông báo: *"Shop sẽ liên hệ xác nhận trong thời gian sớm nhất"*
- Nút **"Mua thêm"** → quay về `/`

---

## Cấu Trúc Dữ Liệu (Supabase)

### Bảng `products`

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | uuid | Primary key, auto-generated |
| `name` | text | Tên sản phẩm |
| `price_per_kg` | integer | Giá theo kg (đơn vị: VNĐ) |
| `image_url` | text | URL ảnh sản phẩm |
| `is_available` | boolean | Hiển thị/ẩn sản phẩm (default: true) |
| `sort_order` | integer | Thứ tự hiển thị |
| `created_at` | timestamptz | Tự động tạo |

> Muốn tạm ẩn sản phẩm hết hàng: vào Supabase dashboard, đổi `is_available = false`.

### Bảng `orders`

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | uuid | Primary key, auto-generated |
| `customer_name` | text | Họ tên khách |
| `customer_phone` | text | Số điện thoại |
| `customer_address` | text | Địa chỉ giao hàng |
| `items` | jsonb | Mảng sản phẩm đã đặt |
| `total_amount` | integer | Tổng tiền (VNĐ) |
| `status` | text | `pending` hoặc `delivered` (default: `pending`) |
| `created_at` | timestamptz | Thời điểm đặt hàng |

**Cấu trúc cột `items`:**
```json
[
  { "name": "Mực trứng", "quantity": 2, "price_per_kg": 300000, "subtotal": 600000 },
  { "name": "Cá thu 1 nắng", "quantity": 1, "price_per_kg": 270000, "subtotal": 270000 }
]
```

### Chính Sách Bảo Mật Supabase (Row Level Security)

| Bảng | Quyền client (anon key) | Quyền server (service role) |
|------|------------------------|------------------------------|
| `products` | SELECT (public read) | Toàn quyền |
| `orders` | Không có | INSERT, SELECT, UPDATE |

Mọi thao tác ghi vào `orders` đều đi qua server-side API route, không bao giờ expose trực tiếp từ client.

---

## API Backend

### `POST /api/checkout`

**Luồng xử lý:**

1. Nhận payload từ client
2. Validate: tên, SĐT, địa chỉ không rỗng; `items` có ít nhất 1 món; `totalAmount > 0`
3. `INSERT` vào bảng `orders` qua Supabase Service Role Key (server-side only)
4. Gọi Telegram Bot API gửi tin nhắn thông báo vào group quản lý
5. Trả về `{ success: true, orderId }` hoặc `{ success: false, error }` nếu thất bại

**Request payload:**
```json
{
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0901234567",
  "customerAddress": "123 Đường Biển, Quảng Nam",
  "items": [
    { "name": "Mực trứng", "quantity": 2, "price_per_kg": 300000, "subtotal": 600000 }
  ],
  "totalAmount": 600000
}
```

**Response thành công:**
```json
{ "success": true, "orderId": "uuid-here" }
```

---

## Thông Báo Telegram

**Format tin nhắn khi có đơn mới:**

```
🔔 ĐƠN HÀNG MỚI!

👤 Nguyễn Văn A
📞 0901234567
📍 123 Đường Biển, Quảng Nam

🛒 Đơn hàng:
  • Mực trứng — 2kg — 600.000đ
  • Cá thu 1 nắng — 1kg — 270.000đ

💰 Tổng: 870.000đ
💵 Thanh toán: COD (tiền mặt khi nhận)

🕐 20/05/2026 11:30
```

---

## Quản Lý State (localStorage)

### Key được dùng

| Key | Nội dung | Vòng đời |
|-----|----------|----------|
| `cart` | Mảng sản phẩm trong giỏ hàng | Xóa sau khi đặt hàng thành công |
| `customer_info` | `{ name, phone, address }` | Giữ mãi để auto-fill |

### Luồng localStorage

1. **Khởi động app:** Đọc `cart` và `customer_info` từ localStorage, nạp vào Global State (React Context)
2. **Thêm/sửa/xóa món:** Cập nhật UI ngay lập tức + ghi đè `cart` vào localStorage
3. **Chốt đơn thành công:** Xóa key `cart`, giữ key `customer_info`
4. **Lần mua sau:** Auto-fill form checkout từ `customer_info`

---

## Biến Môi Trường

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # Chỉ dùng server-side, không expose client

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

---

## Phong Cách Giao Diện

**Định hướng:** Ấm áp, mộc mạc — gợi cảm giác "đặc sản quê" chính hiệu.

| Yếu tố | Giá trị |
|--------|---------|
| Màu chủ đạo | Nâu ấm (`#8B5E3C`), kem (`#FDF6EC`) |
| Màu nhấn | Cam đất (`#D97706`) |
| Font | Google Fonts: **Nunito** (thân thiện, tròn) |
| Bo góc | `rounded-2xl` — mềm mại |
| Hiệu ứng | Micro-animation khi thêm vào giỏ, loading skeleton khi fetch sản phẩm |
| Ưu tiên | Mobile-First, tối ưu màn 375–430px (iPhone/Android phổ thông) |

---

## Lộ Trình Triển Khai

1. **Khởi tạo dự án:** `npx create-next-app` với TypeScript + Tailwind CSS
2. **Cấu hình Supabase:** Tạo 2 bảng, seed 11 sản phẩm, cấu hình RLS
3. **Xây dựng UI:** Trang sản phẩm → giỏ hàng → thanh toán → thành công
4. **Viết API Route:** `/api/checkout` với logic validate + Supabase + Telegram
5. **Tích hợp localStorage:** Global state với React Context
6. **Deploy:** Push lên GitHub → kết nối Vercel → cấu hình env vars

---

## Xác Minh

### Kiểm Tra Kỹ Thuật
- [ ] Fetch sản phẩm từ Supabase hiển thị đúng
- [ ] Thêm/sửa/xóa món cập nhật giỏ hàng và localStorage
- [ ] Form checkout auto-fill đúng từ lần mua trước
- [ ] API `/api/checkout` lưu đơn vào Supabase thành công
- [ ] Telegram nhận được tin nhắn đầy đủ thông tin
- [ ] Màn hình success hiển thị đúng, giỏ hàng được xóa
- [ ] Thông tin cá nhân vẫn còn sau khi đặt hàng

### Kiểm Tra Trải Nghiệm
- [ ] Mở link trên Zalo In-App Browser — giao diện hiển thị đúng
- [ ] Tắt app giữa chừng → mở lại → giỏ hàng vẫn còn
- [ ] Đặt hàng lần 2 → form tự điền thông tin

---
*Spec được tạo bởi Antigravity Brainstorming — 2026-05-20*
