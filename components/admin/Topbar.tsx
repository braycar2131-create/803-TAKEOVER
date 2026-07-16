import Link from "next/link";

export default function Topbar() {
  return (
    <header className="admin-topbar">
      <div>
        <span>803 TAKEOVER</span>
        <strong>CONTROL CENTER</strong>
      </div>

      <nav>
        <Link href="/admin/orders">
          ORDERS
        </Link>

        <Link href="/admin/products">
          PRODUCTS
        </Link>

        <Link href="/" target="_blank">
          OPEN STORE ↗
        </Link>
      </nav>
    </header>
  );
}