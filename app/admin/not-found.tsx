import Link from "next/link";

export default function AdminNotFound() {
  return (
    <section className="admin-error">
      <span>404</span>
      <h1>RECORD NOT FOUND.</h1>
      <p>The requested admin page or order does not exist.</p>

      <Link href="/admin/orders">RETURN TO ORDERS</Link>
    </section>
  );
}
