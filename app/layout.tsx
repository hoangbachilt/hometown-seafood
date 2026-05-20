import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";

// Nunito is used for a soft, humanist look that fits "Earthen Tides"
const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["vietnamese"],
  weight: ["300", "400", "600", "700", "800"], // Added 300 for whisper-quiet text
});

export const metadata: Metadata = {
  title: "Hải Sản Đặc Sản Quê - Earthen Tides",
  description: "Trải nghiệm nghệ thuật mua sắm hải sản tươi ngon mỗi ngày.",
  openGraph: {
    title: "Hải Sản Đặc Sản Quê",
    description: "Trải nghiệm nghệ thuật mua sắm hải sản tươi ngon mỗi ngày.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${nunito.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
