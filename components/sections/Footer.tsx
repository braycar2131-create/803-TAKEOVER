import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bg" aria-hidden="true">
        803
      </div>

      <h2>803 TAKEOVER</h2>

      <p>DESIGNED 2 BE FLY • EST. 2026</p>

      <nav
        className="footer-links"
        aria-label="Footer navigation"
      >
        <Link href="/">HOME</Link>
        <Link href="/shop">SHOP</Link>
        <Link href="/about">ABOUT</Link>
        <Link href="/contact">CONTACT</Link>
        <Link href="/shipping">SHIPPING</Link>
        <Link href="/returns">RETURNS</Link>
        <Link href="/privacy">PRIVACY</Link>
        <Link href="/terms">TERMS</Link>
      </nav>

      <span>
        THE CITY WATCHING • THE MOVEMENT GROWING
      </span>
    </footer>
  );
}
