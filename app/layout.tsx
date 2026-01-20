import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tarkari - Pure Veg Family Dining in Dombivli East",
  description:
    "Experience authentic pure vegetarian cuisine at Tarkari, Dombivli East. Enjoy North Indian, South Indian, Chinese, and more homestyle comfort food. Family-friendly dining with fresh ingredients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased font-sans`}
      >
        <AuthProvider>
          <CartProvider>
            <LanguageProvider>
              <ToastProvider>{children}</ToastProvider>
            </LanguageProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
