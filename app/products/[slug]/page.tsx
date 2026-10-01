/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

type AdminProductsPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
  }>;
};

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getStockLabel(quantity: number) {
  if (quantity <= 0) {
    return "SOLD OUT";
  }

  if (quantity <= 5) {
    return "LOW STOCK";
  }

  return "IN STOCK";
}

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const params = await searchParams;

  const query = params.q?.trim() ?? "";
  const category = params.category?.trim().toUpperCase() ?? "";
  const status = params.status?.trim().toLowerCase() ?? "";

  const products = await prisma.product.findMany({
    where: {
      AND: [
        query
          ? {
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
                  color: {
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
            }
          : {},

        category
          ? {
              category,
            }
          : {},

        status === "active"
          ? {
              active: true,
            }
          : {},

        status === "inactive"
          ? {
              active: false,
            }
          : {},

        status === "featured"
          ? {
              featured: true,
            }
          : {},
      ],
    },

    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },

      inventory: {
        orderBy: {
          size: "asc",
        },
      },
    },

    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const totalUnits = products.reduce(
    (productTotal, product) =>
      productTotal +
      product.inventory.reduce(
        (inventoryTotal, item) =>
          inventoryTotal + item.quantity,
        0
      ),
    0
  );

  const activeProducts = products.filter(
    (product) => product.active
  ).length;

  const featuredProducts = products.filter(
    (product) => product.featured
  ).length;

  const soldOutProducts = products.filter((product) => {
    const quantity = product.inventory.reduce(
      (total, item) => total + item.quantity,
      0
    );

    return quantity <= 0;
  }).length;

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>CATALOG MANAGEMENT</span>

          <h1>PRODUCTS</h1>

          <p>
            Create, edit, organize, price, and manage every
            product in the 803 TAKEOVER store.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="admin-table-link"
          style={{
            display: "inline-flex",
            minHeight: "48px",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 22px",
            background: "var(--admin-red)",
            border: "1px solid var(--admin-red)",
            color: "white",
            textDecoration: "none",
            fontWeight: 900,
            letterSpacing: "0.12em",
          }}
        >
          + ADD PRODUCT
        </Link>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
        {[
          ["PRODUCTS", products.length.toString()],
          ["ACTIVE", activeProducts.toString()],
          ["FEATURED", featuredProducts.toString()],
          ["SOLD OUT", soldOutProducts.toString()],
          ["TOTAL UNITS", totalUnits.toString()],
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
                marginTop: "12px",
                fontSize: "2rem",
              }}
            >
              {value}
            </strong>
          </article>
        ))}
      </section>

      <section className="admin-panel">
        <form
          method="GET"
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(220px, 1fr) minmax(150px, 220px) minmax(150px, 220px) auto",
            gap: "12px",
            alignItems: "end",
            marginBottom: "24px",
          }}
        >
          <label
            style={{
              display: "grid",
              gap: "8px",
            }}
          >
            <span
              style={{
                color: "var(--admin-muted)",
                fontSize: "0.6rem",
                letterSpacing: "0.16em",
              }}
            >
              SEARCH
            </span>

            <input
              name="q"
              type="search"
              defaultValue={query}
              placeholder="NAME, SLUG, COLOR OR TAG"
              style={{
                minHeight: "48px",
                width: "100%",
                padding: "0 14px",
                border: "1px solid var(--admin-border)",
                background: "#050505",
                color: "white",
              }}
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: "8px",
            }}
          >
            <span
              style={{
                color: "var(--admin-muted)",
                fontSize: "0.6rem",
                letterSpacing: "0.16em",
              }}
            >
              CATEGORY
            </span>

            <select
              name="category"
              defaultValue={category}
              style={{
                minHeight: "48px",
                width: "100%",
                padding: "0 14px",
                border: "1px solid var(--admin-border)",
                background: "#050505",
                color: "white",
              }}
            >
              <option value="">ALL CATEGORIES</option>
              <option value="SHIRTS">SHIRTS</option>
              <option value="HOODIES">HOODIES</option>
              <option value="SHORTS">SHORTS</option>
            </select>
          </label>

          <label
            style={{
              display: "grid",
              gap: "8px",
            }}
          >
            <span
              style={{
                color: "var(--admin-muted)",
                fontSize: "0.6rem",
                letterSpacing: "0.16em",
              }}
            >
              STATUS
            </span>

            <select
              name="status"
              defaultValue={status}
              style={{
                minHeight: "48px",
                width: "100%",
                padding: "0 14px",
                border: "1px solid var(--admin-border)",
                background: "#050505",
                color: "white",
              }}
            >
              <option value="">ALL PRODUCTS</option>
              <option value="active">ACTIVE</option>
              <option value="inactive">HIDDEN</option>
              <option value="featured">FEATURED</option>
            </select>
          </label>

          <button
            type="submit"
            style={{
              minHeight: "48px",
              padding: "0 22px",
              border: "1px solid var(--admin-red)",
              background: "var(--admin-red)",
              color: "white",
              fontWeight: 900,
              letterSpacing: "0.12em",
              cursor: "pointer",
            }}
          >
            FILTER
          </button>
        </form>

        {products.length === 0 ? (
          <div className="admin-empty-state">
            <span>NO RESULTS</span>
            <h3>NO PRODUCTS FOUND</h3>

            <p>
              Create your first product or change the current
              filters.
            </p>

            <Link
              href="/admin/products/new"
              className="admin-table-link"
            >
              CREATE PRODUCT
            </Link>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>PRODUCT</th>
                  <th>CATEGORY</th>
                  <th>PRICE</th>
                  <th>STOCK</th>
                  <th>VISIBILITY</th>
                  <th>FEATURED</th>
                  <th>UPDATED</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {products.map((product) => {
                  const stockQuantity =
                    product.inventory.reduce(
                      (total, item) =>
                        total + item.quantity,
                      0
                    );

                  const productImage =
                    product.primaryImage ||
                    product.images[0]?.url;

                  return (
                    <tr key={product.id}>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            minWidth: "250px",
                          }}
                        >
                          <div
                            style={{
                              width: "64px",
                              height: "64px",
                              flexShrink: 0,
                              display: "grid",
                              placeItems: "center",
                              overflow: "hidden",
                              border:
                                "1px solid var(--admin-border)",
                              background: "#080808",
                            }}
                          >
                            {productImage ? (
                              <img
                                src={productImage}
                                alt={product.name}
                                width={64}
                                height={64}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  color: "var(--admin-muted)",
                                  fontSize: "0.55rem",
                                }}
                              >
                                NO IMAGE
                              </span>
                            )}
                          </div>

                          <div>
                            <strong>{product.name}</strong>

                            <small>{product.slug}</small>

                            <small>
                              {product.color} · {product.tag}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>{product.category}</td>

                      <td>
                        {formatMoney(product.priceCents)}
                      </td>

                      <td>
                        <strong>{stockQuantity}</strong>

                        <small>
                          {getStockLabel(stockQuantity)}
                        </small>

                        <small>
                          {product.inventory
                            .map(
                              (item) =>
                                `${item.size}:${item.quantity}`
                            )
                            .join(" · ") || "NO SIZES"}
                        </small>
                      </td>

                      <td>
                        {product.active
                          ? "VISIBLE"
                          : "HIDDEN"}
                      </td>

                      <td>
                        {product.featured ? "YES" : "NO"}
                      </td>

                      <td>
                        {formatDate(product.updatedAt)}
                      </td>

                      <td>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                          }}
                        >
                          <Link
                            className="admin-table-link"
                            href={`/admin/products/${product.slug}`}
                          >
                            EDIT
                          </Link>

                          {product.active && (
                            <Link
                              className="admin-table-link"
                              href={`/shop/${product.slug}`}
                              target="_blank"
                            >
                              VIEW ↗
                            </Link>
                          )}
                        </div>
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