import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

type OrdersPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

function formatMoney(cents: number, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function AdminOrdersPage({
  searchParams,
}: OrdersPageProps) {
  const params = await searchParams;

  const query = params.q?.trim() ?? "";
  const status = params.status?.trim() ?? "";

  const orders = await prisma.order.findMany({
    where: {
      AND: [
        status
          ? {
              orderStatus: status,
            }
          : {},
        query
          ? {
              OR: [
                {
                  stripeSessionId: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  customerEmail: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  customerName: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
      ],
    },

    include: {
      items: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 100,
  });

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>ORDER MANAGEMENT</span>
          <h1>ORDERS</h1>

          <p>
            Review payments, customer information, fulfillment,
            tracking, and purchased products.
          </p>
        </div>

        <strong>{orders.length} ORDERS</strong>
      </section>

      <section className="admin-panel">
        <form
          method="GET"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <input
            name="q"
            defaultValue={query}
            placeholder="SEARCH EMAIL, NAME OR SESSION"
            style={{
              minHeight: "46px",
              flex: "1 1 280px",
              padding: "0 14px",
              border: "1px solid var(--admin-border)",
              background: "#050505",
              color: "white",
            }}
          />

          <select
            name="status"
            defaultValue={status}
            style={{
              minHeight: "46px",
              padding: "0 14px",
              border: "1px solid var(--admin-border)",
              background: "#050505",
              color: "white",
            }}
          >
            <option value="">ALL STATUSES</option>
            <option value="PAID">PAID</option>
            <option value="PACKING">PACKING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <button
            type="submit"
            style={{
              minHeight: "46px",
              padding: "0 20px",
              border: "1px solid var(--admin-red)",
              background: "var(--admin-red)",
              color: "white",
              fontWeight: 900,
            }}
          >
            SEARCH
          </button>
        </form>

        {orders.length === 0 ? (
          <div className="admin-empty-state">
            <span>NO RESULTS</span>
            <h3>NO ORDERS FOUND</h3>
            <p>Try changing the search or status filter.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ORDER</th>
                  <th>CUSTOMER</th>
                  <th>ITEMS</th>
                  <th>TOTAL</th>
                  <th>PAYMENT</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => {
                  const itemCount = order.items.reduce(
                    (total, item) => total + item.quantity,
                    0
                  );

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong>
                          #{order.id.slice(-8).toUpperCase()}
                        </strong>

                        <small>
                          {order.stripeSessionId.slice(0, 22)}…
                        </small>
                      </td>

                      <td>
                        <strong>
                          {order.customerName || "NO NAME"}
                        </strong>

                        <small>
                          {order.customerEmail || "NO EMAIL"}
                        </small>
                      </td>

                      <td>{itemCount}</td>

                      <td>
                        {formatMoney(
                          order.amountTotal,
                          order.currency
                        )}
                      </td>

                      <td>
                        {order.paymentStatus.toUpperCase()}
                      </td>

                      <td>{order.orderStatus}</td>

                      <td>{formatDate(order.createdAt)}</td>

                      <td>
                        <Link
                          className="admin-table-link"
                          href={`/admin/orders/${order.id}`}
                        >
                          VIEW
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}