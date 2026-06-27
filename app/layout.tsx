import "./globals.css";

import Navbar from "../components/layout/Navbar";
import CartDrawer from "../components/cart/CartDrawer";
import CustomCursor from "../components/ui/CustomCursor";
import MouseGlow from "../components/effects/MouseGlow";
import SmoothScroll from "../components/effects/SmoothScroll";
import ScrollProgress from "../components/ui/ScrollProgress";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "803 Takeover",
  description: "Drop 001 — Long Live Felix",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <ScrollProgress />
          <SmoothScroll />
          <MouseGlow />
          <CustomCursor />
          <Navbar />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
