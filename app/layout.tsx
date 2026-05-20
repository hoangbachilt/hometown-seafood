import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

const nunito = Nunito({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hải Sản Đặc Sản Quê - Tươi Ngon Mỗi Ngày",
  description:
    "Đặt hải sản đặc sản quê tươi ngon: mực trứng, cá thu, tôm nõn và nhiều sản phẩm khác. Giao hàng tận nơi, thanh toán khi nhận hàng (COD).",
  keywords: "hải sản tươi, đặc sản quê, mực trứng, cá thu, tôm nõn, giao hàng COD",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#7c4f2a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={nunito.variable}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
