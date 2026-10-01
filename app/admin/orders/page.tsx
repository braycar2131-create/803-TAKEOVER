import Link from "next/link";

import OrdersTable from "../../../components/admin/OrdersTable";
import { getOrders } from "../../../lib/admin";

export const dynamic = "force-dynamic";

type OrdersPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const { q } = await searchParams;
  const orders = await getOrders(q);

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>ORDER MANAGEMENT</span>
          <h1>ORDERS</h1>
          <p>View every paid order saved by your Stripe webhook.</p>
        </div>

        <strong>{orders.length} RECORDS</strong>
      </section>

      <section className="admin-panel">
        <form className="admin-search-form" action="/admin/orders">
          <label htmlFor="admin-order-search">SEARCH ORDERS</label>

          <div>
            <input
              id="admin-order-search"
              name="q"
              type="search"
              defaultValue={q}
              placeholder="ORDER ID, EMAIL, CUSTOMER OR STRIPE SESSION"
            />

            <button type="submit">SEARCH</button>

            {q ? <Link href="/admin/orders">CLEAR</Link> : null}
          </div>
        </form>

        <OrdersTable orders={orders} />
      </section>
    </>
  );
}
