/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { notFound } from "next/navigation";
import ConfirmDelete from "../../../../components/admin/ConfirmDelete";
import { prisma } from "../../../../lib/prisma";
import { formatMoney } from "../../../../lib/admin";
import { deleteProductAction } from "../actions";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function AdminProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
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
  });

  if (!product) {
    notFound();
  }

  const stock = product.inventory.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const deleteAction = deleteProductAction.bind(null, product.slug);

  return (
    <>
      <div className="admin-breadcrumb">
        <Link href="/admin/products">PRODUCTS</Link>
        <span>/</span>
        <strong>{product.name}</strong>
      </div>

      <section className="admin-order-hero">
        <div>
          <span>{product.tag}</span>
          <h1>{product.name}</h1>
          <p>{product.slug}</p>
        </div>

        <div>
          <span
            className={
              product.active
                ? "admin-status admin-status--paid"
                : "admin-status admin-status--cancelled"
            }
          >
            {product.active ? "ACTIVE" : "HIDDEN"}
          </span>

          <strong>{formatMoney(product.priceCents)}</strong>
        </div>
      </section>

      <div className="admin-order-layout">
        <div className="admin-order-primary">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>PRODUCT INFORMATION</span>
                <h2>DETAILS</h2>
              </div>

              <Link href={`/admin/products/${product.slug}/edit`}>
                EDIT PRODUCT
              </Link>
            </div>

            <dl className="admin-detail-list">
              <div>
                <dt>CATEGORY</dt>
                <dd>{product.category}</dd>
              </div>

              <div>
                <dt>COLOR</dt>
                <dd>{product.color}</dd>
              </div>

              <div>
                <dt>DESCRIPTION</dt>
                <dd>{product.description}</dd>
              </div>

              <div>
                <dt>PRIMARY IMAGE</dt>
                <dd>{product.primaryImage}</dd>
              </div>
            </dl>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>{product.images.length} ASSETS</span>
                <h2>IMAGES</h2>
              </div>
            </div>

            <div className="admin-product-image-list">
              {product.images.map((image) => (
                <article key={image.id}>
                  <img src={image.url} alt={product.name} />
                  <span>{image.url}</span>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="admin-order-sidebar">
          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>{stock} TOTAL UNITS</span>
                <h2>INVENTORY</h2>
              </div>
            </div>

            <dl className="admin-detail-list">
              {product.inventory.map((item) => (
                <div key={item.id}>
                  <dt>{item.size}</dt>
                  <dd>{item.quantity} IN STOCK</dd>
                </div>
              ))}
            </dl>

            <Link className="admin-back-button" href="/admin/inventory">
              MANAGE INVENTORY
            </Link>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <span>DANGER ZONE</span>
                <h2>DELETE</h2>
              </div>
            </div>

            <ConfirmDelete action={deleteAction} />
          </section>
        </aside>
      </div>
    </>
  );
}
