import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function AdminAnalyticsPage() {
  const [orders, products, inventory] = await Promise.all([
    prisma.order.findMany({
      where: {
        paymentStatus: "paid",
      },

      include: {
        items: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.product.count(),

    prisma.productInventory.findMany({
      select: {
        quantity: true,
      },
    }),
  ]);

  const revenue = orders.reduce(
    (total, order) => total + order.amountTotal,
    0
  );

  const averageOrder =
    orders.length > 0 ? Math.round(revenue / orders.length) : 0;

  const totalInventory = inventory.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const customerEmails = new Set(
    orders
      .map((order) => order.customerEmail?.toLowerCase())
      .filter(Boolean)
  );

  const productTotals = new Map<
    string,
    {
      name: string;
      units: number;
      revenue: number;
    }
  >();

  const sizeTotals = new Map<string, number>();

  for (const order of orders) {
    for (const item of order.items) {
      const product = productTotals.get(item.productSlug) ?? {
        name: item.productName,
        units: 0,
        revenue: 0,
      };

      product.units += item.quantity;
      product.revenue += item.lineTotal;

      productTotals.set(item.productSlug, product);

      sizeTotals.set(
        item.size,
        (sizeTotals.get(item.size) ?? 0) + item.quantity
      );
    }
  }

  const bestSellers = Array.from(productTotals.entries())
    .map(([slug, value]) => ({
      slug,
      ...value,
    }))
    .sort((a, b) => b.units - a.units)
    .slice(0, 10);

  const topSizes = Array.from(sizeTotals.entries())
    .map(([size, units]) => ({
      size,
      units,
    }))
    .sort((a, b) => b.units - a.units);

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>STORE PERFORMANCE</span>
          <h1>ANALYTICS</h1>

          <p>
            Revenue, sales, customer, inventory, product, and size
            performance from paid orders.
          </p>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(190px, 1fr))",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
        {[
          ["REVENUE", formatMoney(revenue)],
          ["PAID ORDERS", orders.length.toString()],
          ["AVERAGE ORDER", formatMoney(averageOrder)],
          ["CUSTOMERS", customerEmails.size.toString()],
          ["PRODUCTS", products.toString()],
          ["INVENTORY UNITS", totalInventory.toString()],
        ].map(([label, value]) => (
          <article className="admin-panel" key={label}>
            <span
              style={{
                color: "var(--admin-muted)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
              }}
            >
              {label}
            </span>

            <strong
              style={{
                display: "block",
                marginTop: "14px",
                fontSize: "2rem",
              }}
            >
              {value}
            </strong>
          </article>
        ))}
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "22px",
        }}
      >
        <div className="admin-panel">
          <h2>BEST SELLERS</h2>

          {bestSellers.length === 0 ? (
            <p style={{ color: "var(--admin-muted)" }}>
              No paid-order data yet.
            </p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>UNITS</th>
                    <th>REVENUE</th>
                  </tr>
                </thead>

                <tbody>
                  {bestSellers.map((product) => (
                    <tr key={product.slug}>
                      <td>{product.name}</td>
                      <td>{product.units}</td>
                      <td>{formatMoney(product.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="admin-panel">
          <h2>TOP SIZES</h2>

          {topSizes.length === 0 ? (
            <p style={{ color: "var(--admin-muted)" }}>
              No size data yet.
            </p>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>SIZE</th>
                    <th>UNITS SOLD</th>
                  </tr>
                </thead>

                <tbody>
                  {topSizes.map((size) => (
                    <tr key={size.size}>
                      <td>{size.size}</td>
                      <td>{size.units}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
}