import Link from "next/link";
import { products } from "../../../data/products";
import { prisma } from "../../../lib/prisma";
import { formatMoney } from "../../../lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const sales = await prisma.orderItem.groupBy({
    by: ["productSlug"],
    _sum: {
      quantity: true,
      lineTotal: true,
    },
  });

  const salesMap = new Map(
    sales.map((row) => [
      row.productSlug,
      {
        units: row._sum.quantity ?? 0,
        revenue: row._sum.lineTotal ?? 0,
      },
    ])
  );

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>PRODUCT CATALOG</span>
          <h1>PRODUCTS</h1>
          <p>
            Your storefront products and their live sales performance.
          </p>
        </div>

        <strong>{products.length} PRODUCTS</strong>
      </section>

      <section className="admin-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>SLUG</th>
                <th>CATEGORY</th>
                <th>COLOR</th>
                <th>PRICE</th>
                <th>SIZES</th>
                <th>UNITS SOLD</th>
                <th>REVENUE</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const productSales = salesMap.get(product.slug);

                return (
                  <tr key={product.slug}>
                    <td>
                      <strong>{product.name}</strong>
                      <small>{product.tag}</small>
                    </td>

                    <td>{product.slug}</td>
                    <td>{product.category}</td>
                    <td>{product.color}</td>
                    <td>{product.displayPrice}</td>
                    <td>{product.sizes.join(", ")}</td>
                    <td>{productSales?.units ?? 0}</td>
                    <td>
                      {formatMoney(productSales?.revenue ?? 0)}
                    </td>
                    <td>
                      <Link
                        className="admin-table-link"
                        href={`/shop/${product.slug}`}
                        target="_blank"
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
      </section>
    </>
  );
}
