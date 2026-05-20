import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase";

// ============================================================
// Types
// ============================================================

type OrderItem = {
  name: string;
  quantity: number;
  price_per_kg: number;
  subtotal: number;
};

type CheckoutPayload = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number;
};

// ============================================================
// Telegram helper
// ============================================================

function formatTelegramMessage(payload: CheckoutPayload, orderId: string): string {
  const now = new Date();
  const datetime = now.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemLines = payload.items
    .map(
      (item) =>
        `  • ${item.name} — ${item.quantity}kg — ${new Intl.NumberFormat("vi-VN").format(item.subtotal)}đ`
    )
    .join("\n");

  const total = new Intl.NumberFormat("vi-VN").format(payload.totalAmount);
  const shortId = orderId.slice(0, 8).toUpperCase();

  return [
    `🔔 *ĐƠN HÀNG MỚI!* #${shortId}`,
    ``,
    `👤 ${payload.customerName}`,
    `📞 ${payload.customerPhone}`,
    `📍 ${payload.customerAddress}`,
    ``,
    `🛒 *Đơn hàng:*`,
    itemLines,
    ``,
    `💰 *Tổng: ${total}đ*`,
    `💵 Thanh toán: COD (tiền mặt khi nhận)`,
    ``,
    `🕐 ${datetime}`,
  ].join("\n");
}

async function sendTelegramNotification(
  message: string
): Promise<{ ok: boolean; error?: string }> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn("[Telegram] Bot token or chat ID not configured");
    return { ok: false, error: "Telegram not configured" };
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error("[Telegram] API error:", err);
      return { ok: false, error: err };
    }

    return { ok: true };
  } catch (err) {
    console.error("[Telegram] Fetch error:", err);
    return { ok: false, error: String(err) };
  }
}

// ============================================================
// Validation
// ============================================================

function validate(payload: Partial<CheckoutPayload>): string | null {
  if (!payload.customerName?.trim()) return "Thiếu họ tên khách hàng";
  if (!payload.customerPhone?.trim()) return "Thiếu số điện thoại";
  if (!payload.customerAddress?.trim()) return "Thiếu địa chỉ giao hàng";
  if (!Array.isArray(payload.items) || payload.items.length === 0)
    return "Đơn hàng không có sản phẩm";
  if (typeof payload.totalAmount !== "number" || payload.totalAmount <= 0)
    return "Tổng tiền không hợp lệ";

  for (const item of payload.items) {
    if (!item.name || typeof item.quantity !== "number" || item.quantity <= 0) {
      return "Dữ liệu sản phẩm không hợp lệ";
    }
  }

  return null;
}

// ============================================================
// POST handler
// ============================================================

export async function POST(request: NextRequest) {
  let payload: Partial<CheckoutPayload>;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Request body không hợp lệ" },
      { status: 400 }
    );
  }

  // Validate
  const validationError = validate(payload);
  if (validationError) {
    return NextResponse.json(
      { success: false, error: validationError },
      { status: 400 }
    );
  }

  const typedPayload = payload as CheckoutPayload;

  // Insert order into Supabase (server-side only)
  const supabaseAdmin = createAdminClient();
  const { data: order, error: dbError } = await supabaseAdmin
    .from("orders")
    .insert({
      customer_name: typedPayload.customerName.trim(),
      customer_phone: typedPayload.customerPhone.trim(),
      customer_address: typedPayload.customerAddress.trim(),
      items: typedPayload.items,
      total_amount: typedPayload.totalAmount,
      status: "pending",
    })
    .select("id")
    .single();

  if (dbError || !order) {
    console.error("[Checkout] Supabase insert error:", dbError);
    return NextResponse.json(
      { success: false, error: "Lưu đơn hàng thất bại. Vui lòng thử lại." },
      { status: 500 }
    );
  }

  // Send Telegram notification (non-blocking — don't fail the order if this fails)
  const message = formatTelegramMessage(typedPayload, order.id);
  const telegramResult = await sendTelegramNotification(message);

  if (!telegramResult.ok) {
    console.warn("[Checkout] Telegram notification failed:", telegramResult.error);
    // Order is still successful even if Telegram fails
  }

  return NextResponse.json({
    success: true,
    orderId: order.id,
  });
}
