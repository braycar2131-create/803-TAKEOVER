import InventoryTable from "../../../components/admin/InventoryTable";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    include: {
      inventory: {
        orderBy: {
          size: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const totalUnits = products.reduce(
    (total, product) =>
      total +
      product.inventory.reduce(
        (sum, item) => sum + item.quantity,
        0
      ),
    0
  );

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>STOCK CONTROL</span>
          <h1>INVENTORY</h1>
          <p>
            Update stock by product and size.
          </p>
        </div>

        <strong>{totalUnits} TOTAL UNITS</strong>
      </section>

      {products.length === 0 ? (
        <section className="admin-panel">
          <div className="admin-empty-state">
            <span>NO PRODUCTS</span>
            <h3>INVENTORY IS EMPTY</h3>
            <p>Create or seed products first.</p>
          </div>
        </section>
      ) : (
        <InventoryTable products={products} />
      )}
    </>
  );
}
