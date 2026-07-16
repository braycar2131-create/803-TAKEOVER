import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bg">803</div>

      <h2>803 TAKEOVER</h2>

      <p>DESIGNED 2 BE FLY • EST. 2026</p>

      <div className="footer-links">
        <Link href="/">HOME</Link>
        <Link href="/shop">SHOP</Link>
        <Link href="/about">ABOUT</Link>
        <Link href="/cart">CART</Link>
      </div>

      <span>THE CITY WATCHING • THE MOVEMENT GROWING</span>
    </footer>
  );
}