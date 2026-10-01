import Link from "next/link";
import { logoutAction } from "../../app/login/actions";

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

        <form action={logoutAction}>
          <button
            type="submit"
            style={{
              padding: "9px 13px",
              border:
                "1px solid rgba(255,255,255,0.18)",
              color: "#ffffff",
              background: "transparent",
              cursor: "pointer",
              fontSize: "0.6rem",
              fontWeight: 800,
              letterSpacing: "0.14em",
            }}
          >
            LOG OUT
          </button>
        </form>
      </nav>
    </header>
  );
}
