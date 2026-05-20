# TỔNG HỢP GIẢI PHÁP: HỆ THỐNG BÁN HÀNG QUA ZALO IN-APP BROWSER (CHI PHÍ 0 ĐỒNG)

Tài liệu này tổng hợp toàn bộ giải pháp kỹ thuật, kiến trúc hệ thống và luồng logic được thảo luận nhằm giải quyết bài toán bán hàng trên nhóm Zalo không bị trôi bài, tối ưu hóa trải nghiệm khách hàng và tối thiểu hóa chi phí vận hành.

---

## 1. Bối Cảnh và Định Hướng Giải Pháp

### Bài toán đặt ra
* Bán hàng trực tiếp qua tin nhắn hội nhóm Zalo dễ bị trôi bài, khách hàng khó tìm lại danh mục sản phẩm.
* Yêu cầu tích hợp công cụ vào Zalo để khách hàng dễ dàng tiếp cận, chọn món và đặt hàng.
* Đối tượng triển khai là Lập trình viên (Developer), muốn tự chủ công nghệ.
* **Ràng buộc đặc biệt:** 1. Không có giấy phép kinh doanh (loại bỏ hướng làm Zalo Mini App chính thức hoặc Zalo OA xác thực).
  2. Không muốn phát sinh chi phí thuê máy chủ (Server/VPS).

### Giải pháp tối ưu: Mobile Web App kết hợp Zalo In-App Browser
Thay vì xây dựng Mini App chính thức cần kiểm duyệt, hệ thống sẽ được triển khai dưới dạng một trang Web tối ưu cho thiết bị di động (Mobile-First Web App). 
* Khi gửi link và ghim tin nhắn trên Zalo, khách hàng bấm vào sẽ mở bằng trình duyệt nội bộ của Zalo (In-App Browser).
* Giao diện hiển thị lọt thỏm trong Zalo, tạo trải nghiệm liền mạch như một ứng dụng Native mà không cần cài đặt hoặc kiểm duyệt pháp lý.

---

## 2. Kiến Trúc Hệ Thống Chi Phí 0 Đồng (Zero-Cost Stack)

Hệ thống tận dụng tối đa các gói miễn phí (Free Tier) từ các nhà cung cấp dịch vụ Cloud hiện đại theo mô hình Serverless và Backend-as-a-Service (BaaS):

| Thành phần | Công nghệ lựa chọn | Vai trò & Đặc điểm kỹ thuật |
| :--- | :--- | :--- |
| **Frontend & API** | **Next.js (App Router)** | Framework React hiện đại, hỗ trợ SSR/CSR và Serverless Functions. |
| **Hosting** | **Vercel** | Nền tảng Cloud deploy tự động từ GitHub. Gói Free cấp SSL HTTPS miễn phí, băng thông dư sức phục vụ quy mô vừa và nhỏ. |
| **Database** | **Supabase** | BaaS mã nguồn mở dựa trên PostgreSQL. Cung cấp sẵn API tĩnh, cơ chế realtime và dung lượng miễn phí đủ lưu hàng chục ngàn đơn hàng. |
| **Notification** | **Telegram Bot API** | Hệ thống thông báo đẩy (Push Notification) thời gian thực về điện thoại của chủ shop ngay khi có đơn mới, hoàn toàn miễn phí và không trễ. |

---

## 3. Thiết Kế Luồng Logic Xử Lý (Ý Tưởng Vận Hành)

Do đặc thù trình duyệt nhúng của Zalo không duy trì session (phiên đăng nhập) lâu dài, toàn bộ luồng xử lý trạng thái sẽ ứng dụng cơ chế đồng bộ hóa dữ liệu cục bộ (`localStorage`) để tối ưu UX.

### Luồng 1: Khởi tạo ứng dụng (Initialization)
1. Khi khách hàng bấm vào link ghim trong Zalo, Web App được tải lên.
2. Hệ thống kiểm tra ngầm bộ nhớ cục bộ (`localStorage`) của thiết bị khách hàng.
3. Nếu tìm thấy dữ liệu giỏ hàng hoặc thông tin cá nhân cũ, hệ thống tự động nạp lên trạng thái toàn cục (Global State) để hiển thị giao diện cá nhân hóa.

### Luồng 2: Tương tác Giỏ hàng (Cart Synchronization)
1. Khách hàng thực hiện các thao tác: Thêm món, tăng/giảm số lượng, xóa món.
2. Hệ thống cập nhật giao diện ngay lập tức để đảm bảo độ mượt (Zero-lag UI).
3. Song song đó, toàn bộ cấu trúc giỏ hàng mới sẽ được ghi đè liên tục vào `localStorage`.
4. *Mục đích:* Phòng trường hợp khách đang chọn món thì bị ngắt quãng (nghe điện thoại, tắt ứng dụng), khi quay lại giỏ hàng vẫn bảo toàn.

### Luồng 3: Thanh toán và Ghi nhớ thông tin (Auto-fill Checkout)
1. Tại màn hình Thanh toán, nếu là lần đầu mua hàng, khách hàng điền các thông tin cơ bản (Tên, Số điện thoại, Địa chỉ nhận hàng).
2. Khi bấm "Chốt đơn", hệ thống thực hiện đồng thời:
   * Gọi API Serverless phía Next.js xử lý lưu trữ và bắn thông báo qua Telegram.
   * Tách riêng mảng thông tin cá nhân (Tên, SĐT, Địa chỉ) và lưu cố định vào một vùng riêng trong `localStorage`.
3. Từ lần mua hàng thứ hai, khi khách vào trang thanh toán, hệ thống tự động điền (Auto-fill) các trường này, khách chỉ cần 1 chạm để đặt hàng.

### Luồng 4: Dọn dẹp dữ liệu (Cleanup Session)
1. Sau khi API phản hồi đặt hàng thành công và hiển thị màn hình chúc mừng.
2. Hệ thống tiến hành làm rỗng (Clear) trạng thái giỏ hàng trên UI và xóa key giỏ hàng trong `localStorage`.
3. **Lưu ý:** Giữ nguyên key thông tin cá nhân (Tên, SĐT, Địa chỉ) để phục vụ tính năng Auto-fill cho các lần sau.

---

## 4. Lộ Trình Triển Khai Kỹ Thuật

1. **Khởi tạo mã nguồn:** Tạo dự án Next.js kết hợp Tailwind CSS. Thiết kế giao diện Mobile-First, sử dụng thanh điều hướng cố định phía dưới (Bottom Navigation).
2. **Cấu hình Cơ sở dữ liệu:** Tạo tài khoản Supabase, thiết lập 2 bảng cơ bản: `products` (danh mục sản phẩm) và `orders` (chi tiết đơn hàng).
3. **Xây dựng Bot thông báo:** Tạo Bot qua `@BotFather` trên Telegram để lấy Access Token, tạo group quản lý và lấy Chat ID.
4. **Viết Route Handler (Backend):** Triển khai API nhận dữ liệu đơn hàng tại thư mục `app/api/checkout/route.ts`. API này nhận payload từ frontend, chuyển đổi định dạng và gọi API Telegram bằng phương thức `POST` bảo mật phía máy chủ.
5. **Triển khai và Vận hành:** Push code lên GitHub, liên kết với Vercel, cấu hình các biến môi trường (Environment Variables) bảo mật và bấm Deploy lấy đường link sản phẩm cuối cùng.

---
*Tài liệu được tổng hợp tự động dựa trên tiến trình thảo luận kiến trúc giải pháp.*
