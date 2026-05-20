// Danh sách các danh mục hiển thị trên Sticky Tabs
export const CATEGORIES = [
  { id: "all", label: "Tất cả" },
  { id: "muc", label: "Mực" },
  { id: "ca", label: "Cá" },
  { id: "tom", label: "Tôm" },
  { id: "nuoc_mam", label: "Nước mắm" },
  { id: "nem_chua", label: "Nem chua" },
  { id: "khac", label: "Khác" },
];

// Hàm phụ trợ để tự động map sản phẩm vào category dựa trên tên (hoặc bạn có thể dùng mapping thủ công bên dưới)
export function getCategoryByProductName(name: string): string {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("mực")) return "muc";
  if (lowerName.includes("cá")) return "ca";
  if (lowerName.includes("tôm")) return "tom";
  if (lowerName.includes("nước mắm")) return "nuoc_mam";
  if (lowerName.includes("nem")) return "nem_chua";
  return "khac";
}

// Map chứa danh sách các ảnh phụ (hoặc video mp4/webm) cho mỗi sản phẩm (dựa trên ID của sản phẩm trong Supabase)
export const PRODUCT_IMAGES_MAP: Record<string, string[]> = {
  // Mực trứng
  "72ab09ea-6e15-443c-8973-64d39e0fb503": [
    "/images/muc_trung.jpg",
  ],
  
  // Mực ống
  "becd98cf-6002-4f11-bf8d-bcb0b1caa99a": [
    "/images/muc_ong.jpg",
  ],
  
  // Mực hấp
  "0039d916-e5cc-43df-8489-3a75d368488c": [
    "/images/muc_hap_1.jpg",
    "/images/muc_hap_2.jpg",
  ],
  
  // Cá thu 1 nắng
  "7c1814e7-bf80-47ac-a222-87199ecdb4f6": [
    "/images/ca_thu_1_nang.jpg",
    "/videos/ca_thu_1_nang.mp4",
  ],
  
  // Cá mối 1 nắng
  "cdb3223e-6292-4fa3-95d8-4bbb89cfd4dd": [
    "/videos/ca_moi_1_nang.mp4",
    "/images/ca_moi_1_nang_1.jpg",
    "/images/ca_moi_1_nang_2.jpg",
  ],
  
  // Cá đù 1 nắng
  "da1e2587-ffb8-4c62-b435-cecd65e35098": [
    "/images/ca_du_1_nang.jpg",
    "/videos/ca_du_1_nang.mp4",
  ],
  
  // Cá nanh đù 1 nắng giã nghệ
  "56954011-de3d-468d-9033-fa523d71ba75": [
    "/images/ca_du_1_nang_gia_nghe.jpg",
    "/images/ca_du_1_nang_gia_nghe_2.jpg",
  ],
  
  // Cá thu tươi cắt khúc
  "dddabd0c-07ab-4043-884e-9bf4393bd808": [
    "/images/ca_thu_tuoi_cat_khuc.jpg",
  ],
  
  // Cá lục chạch
  "bffc864e-45ef-4c9f-bb26-44d181d0fc7d": [
    "/images/ca_luc_chach_1.jpg",
    "/images/ca_luc_chach_2.jpg",
    "/videos/ca_luc_chach.mp4",
  ],
  
  // Cá thu nướng
  "9fa3670a-2987-4039-bdf0-0af4d8da782c": [
    "/images/ca_thu_nuong.jpg",
    "/videos/ca_thu_nuong.mp4",
  ],
  
  // Tôm nõn sắt
  "e18fb2a0-1f46-440b-859f-2e61d21a54dc": [
    "/images/tom_non_sat_1.jpg",
    "/images/tom_non_sat_2.jpg",
  ],
};
