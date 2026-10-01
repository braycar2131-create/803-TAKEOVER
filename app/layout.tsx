import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/cart/CartDrawer";

export const metadata = {
  title: "803 Takeover",
  description: "Luxury Streetwear",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}