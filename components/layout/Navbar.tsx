"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <nav className="navbar navbar-v2">
        <div className="nav-left">
          <Link href="/" onClick={closeMenu}>HOME</Link>
          <Link href="/shop" onClick={closeMenu}>SHOP</Link>
        </div>

        <Link href="/" className="nav-logo" onClick={closeMenu}>
          803 TAKEOVER
        </Link>

        <div className="nav-right">
          <Link href="/about" onClick={closeMenu}>ABOUT</Link>
          <Link href="/cart" onClick={closeMenu}>CART ({cartCount})</Link>
        </div>

        <button
          className="mobile-menu-button"
          type="button"
          onClick={() => setOpen(!open)}
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </nav>

      <div className={open ? "mobile-menu open" : "mobile-menu"}>
        <Link href="/" onClick={closeMenu}>HOME</Link>
        <Link href="/shop" onClick={closeMenu}>SHOP</Link>
        <Link href="/about" onClick={closeMenu}>ABOUT</Link>
        <Link href="/cart" onClick={closeMenu}>CART ({cartCount})</Link>
      </div>
    </>
  );
}