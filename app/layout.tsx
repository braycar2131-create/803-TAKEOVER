import "./globals.css";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "../components/cart/CartDrawer";

export const metadata = {
  title: "803 TAKEOVER",
  description:
    "Luxury streetwear. The city watching. The movement growing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}