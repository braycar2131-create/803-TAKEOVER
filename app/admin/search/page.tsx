import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AdminSearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const [products, orders] = query
    ? await Promise.all([
        prisma.product.findMany({
          where: {
            OR: [
              {
                name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                slug: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                category: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                tag: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 25,
        }),

        prisma.order.findMany({
          where: {
            OR: [
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
              {
                stripeSessionId: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 25,
        }),
      ])
    : [[], []];

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>GLOBAL ADMIN SEARCH</span>
          <h1>SEARCH</h1>

          <p>
            Search products, orders, customer names, emails,
            categories, collections, and Stripe sessions.
          </p>
        </div>
      </section>

      <section className="admin-panel">
        <form
          method="GET"
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          <input
            name="q"
            defaultValue={query}
            placeholder="SEARCH THE STORE"
            autoFocus
            style={{
              minHeight: "54px",
              flex: 1,
              padding: "0 16px",
              border: "1px solid var(--admin-border)",
              background: "#050505",
              color: "white",
            }}
          />

          <button
            type="submit"
            style={{
              minHeight: "54px",
              padding: "0 24px",
              border: "1px solid var(--admin-red)",
              background: "var(--admin-red)",
              color: "white",
              fontWeight: 900,
            }}
          >
            SEARCH
          </button>
        </form>
      </section>

      {query ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "22px",
            marginTop: "22px",
          }}
        >
          <section className="admin-panel">
            <h2>PRODUCTS ({products.length})</h2>

            {products.length === 0 ? (
              <p style={{ color: "var(--admin-muted)" }}>
                No products found.
              </p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <strong>{product.name}</strong>
                          <small>{product.slug}</small>
                        </td>

                        <td>
                          <Link
                            className="admin-table-link"
                            href={`/admin/products/${product.slug}`}
                          >
                            OPEN
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="admin-panel">
            <h2>ORDERS ({orders.length})</h2>

            {orders.length === 0 ? (
              <p style={{ color: "var(--admin-muted)" }}>
                No orders found.
              </p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <strong>
                            {order.customerName || "CUSTOMER"}
                          </strong>

                          <small>
                            {order.customerEmail || order.id}
                          </small>
                        </td>

                        <td>
                          <Link
                            className="admin-table-link"
                            href={`/admin/orders/${order.id}`}
                          >
                            OPEN
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : (
        <section
          className="admin-panel admin-empty-state"
          style={{ marginTop: "22px" }}
        >
          <span>READY</span>
          <h3>SEARCH YOUR STORE</h3>
          <p>Enter a product, customer, email, or order reference.</p>
        </section>
      )}
    </>
  );
}