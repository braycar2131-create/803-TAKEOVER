"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { cartCount, openCart } = useCart();

  return (
    <header className="navbar">
      <nav className="nav-left">
        <Link href="/shop">SHOP</Link>
        <Link href="/lookbook">LOOKBOOK</Link>
        <Link href="/about">ABOUT</Link>
        <Link href="/contact">CONTACT</Link>
      </nav>

      <Link href="/" className="nav-logo" aria-label="803 Takeover home">
        <Image src="/logo.png" alt="803 Takeover" width={180} height={60} priority />
      </Link>

      <div className="nav-right">
        <Link href="/search">SEARCH</Link>
        <Link href="/wishlist">♡</Link>
        <button className="nav-cart-button" type="button" onClick={openCart}>
          CART ({cartCount})
        </button>
      </div>

      <button className="menu-button" type="button" onClick={() => setOpen(!open)}>
        MENU
      </button>

      {open && (
        <div className="mobile-menu">
          <Link href="/shop" onClick={() => setOpen(false)}>SHOP</Link>
          <Link href="/lookbook" onClick={() => setOpen(false)}>LOOKBOOK</Link>
          <Link href="/about" onClick={() => setOpen(false)}>ABOUT</Link>
          <Link href="/contact" onClick={() => setOpen(false)}>CONTACT</Link>
          <button className="nav-cart-button" type="button" onClick={openCart}>
            CART ({cartCount})
          </button>
        </div>
      )}
    </header>
  );
}
