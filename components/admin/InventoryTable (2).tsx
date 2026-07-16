import { updateInventoryAction } from "../../app/admin/products/actions";

type InventoryProduct = {
  id: number;
  slug: string;
  name: string;
  color: string;
  inventory: {
    id: string;
    size: string;
    quantity: number;
  }[];
};

export default function InventoryTable({
  products,
}: {
  products: InventoryProduct[];
}) {
  return (
    <div className="admin-inventory-list">
      {products.map((product) => {
        const total = product.inventory.reduce(
          (sum, item) => sum + item.quantity,
          0
        );

        return (
          <section className="admin-panel" key={product.id}>
            <div className="admin-panel-heading">
              <div>
                <span>{product.color}</span>
                <h2>{product.name}</h2>
              </div>

              <strong>{total} TOTAL</strong>
            </div>

            <div className="admin-inventory-grid">
              {product.inventory.map((item) => (
                <form action={updateInventoryAction} key={item.id}>
                  <input type="hidden" name="productId" value={product.id} />
                  <input type="hidden" name="size" value={item.size} />

                  <label>
                    <span>{item.size}</span>
                    <input
                      name="quantity"
                      type="number"
                      min="0"
                      defaultValue={item.quantity}
                    />
                  </label>

                  <button type="submit">SAVE</button>
                </form>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
