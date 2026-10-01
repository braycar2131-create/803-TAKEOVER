import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import { formatMoney, shortOrderId } from "../../../lib/admin";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function AdminSearchPage({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

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
            ],
          },
          take: 20,
        }),

        prisma.order.findMany({
          where: {
            OR: [
              {
                id: {
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
          },
          take: 20,
          orderBy: {
            createdAt: "desc",
          },
        }),
      ])
    : [[], []];

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>GLOBAL DATABASE SEARCH</span>
          <h1>SEARCH</h1>
          <p>Search products, customers, and orders.</p>
        </div>
      </section>

      <section className="admin-panel">
        <form className="admin-search-form" action="/admin/search">
          <label htmlFor="admin-global-search">SEARCH DATABASE</label>

          <div>
            <input
              id="admin-global-search"
              name="q"
              type="search"
              defaultValue={query}
              placeholder="PRODUCT, ORDER ID, CUSTOMER OR EMAIL"
              required
            />

            <button type="submit">SEARCH</button>
          </div>
        </form>
      </section>

      {query ? (
        <div className="admin-dashboard-grid">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>{products.length} RESULTS</span>
                <h2>PRODUCTS</h2>
              </div>
            </div>

            <div className="admin-search-results">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/admin/products/${product.slug}`}
                >
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.slug}</span>
                  </div>

                  <b>{formatMoney(product.priceCents)}</b>
                </Link>
              ))}
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>{orders.length} RESULTS</span>
                <h2>ORDERS</h2>
              </div>
            </div>

            <div className="admin-search-results">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                >
                  <div>
                    <strong>{shortOrderId(order.id)}</strong>
                    <span>
                      {order.customerEmail || "NO EMAIL"}
                    </span>
                  </div>

                  <b>{formatMoney(order.amountTotal)}</b>
                </Link>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
