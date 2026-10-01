type ProductEditorProduct = {
  slug: string;
  name: string;
  priceCents: number;
  category: string;
  tag: string;
  color: string;
  primaryImage: string;
  description: string;
  featured: boolean;
  active: boolean;
  images: { url: string }[];
  inventory: { size: string; quantity: number }[];
};

type ProductEditorProps = {
  title: string;
  submitLabel: string;
  action: (formData: FormData) => void | Promise<void>;
  product?: ProductEditorProduct;
};

export default function ProductEditor({
  title,
  submitLabel,
  action,
  product,
}: ProductEditorProps) {
  const imageValue =
    product?.images.map((image) => image.url).join("\n") ?? "";

  const inventoryValue =
    product?.inventory
      .map((item) => `${item.size}:${item.quantity}`)
      .join("\n") ?? "S:0\nM:0\nL:0\nXL:0\nXXL:0";

  return (
    <form className="admin-product-editor" action={action}>
      <div className="admin-product-editor__heading">
        <div>
          <span>CATALOG EDITOR</span>
          <h1>{title}</h1>
        </div>

        <button type="submit">{submitLabel}</button>
      </div>

      <div className="admin-product-editor__grid">
        <section className="admin-panel">
          <div className="admin-form-grid">
            <label>
              <span>PRODUCT NAME</span>
              <input
                name="name"
                defaultValue={product?.name}
                placeholder="BLACK FELIX TEE"
                required
              />
            </label>

            <label>
              <span>SLUG</span>
              <input
                name="slug"
                defaultValue={product?.slug}
                placeholder="black-felix-tee"
                required
              />
            </label>

            <label>
              <span>PRICE IN USD</span>
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={
                  product ? (product.priceCents / 100).toFixed(2) : ""
                }
                placeholder="60.00"
                required
              />
            </label>

            <label>
              <span>CATEGORY</span>
              <input
                name="category"
                defaultValue={product?.category}
                placeholder="SHIRTS"
                required
              />
            </label>

            <label>
              <span>COLLECTION TAG</span>
              <input
                name="tag"
                defaultValue={product?.tag}
                placeholder="LONG LIVE FELIX COLLECTIVE"
                required
              />
            </label>

            <label>
              <span>COLOR</span>
              <input
                name="color"
                defaultValue={product?.color}
                placeholder="BLACK"
                required
              />
            </label>
          </div>

          <label className="admin-form-field">
            <span>DESCRIPTION</span>
            <textarea
              name="description"
              defaultValue={product?.description}
              rows={7}
              required
            />
          </label>
        </section>

        <aside className="admin-product-editor__side">
          <section className="admin-panel">
            <label className="admin-form-field">
              <span>PRIMARY IMAGE PATH</span>
              <input
                name="primaryImage"
                defaultValue={product?.primaryImage}
                placeholder="/products/drop001/black/front.png"
                required
              />
            </label>

            <label className="admin-form-field">
              <span>IMAGE PATHS — ONE PER LINE</span>
              <textarea
                name="images"
                defaultValue={imageValue}
                rows={6}
                placeholder="/products/front.png&#10;/products/back.png"
              />
            </label>
          </section>

          <section className="admin-panel">
            <label className="admin-form-field">
              <span>INVENTORY — SIZE:QUANTITY</span>
              <textarea
                name="inventory"
                defaultValue={inventoryValue}
                rows={7}
              />
            </label>
          </section>

          <section className="admin-panel admin-product-switches">
            <label>
              <input
                name="featured"
                type="checkbox"
                defaultChecked={product?.featured ?? false}
              />
              <span>FEATURED PRODUCT</span>
            </label>

            <label>
              <input
                name="active"
                type="checkbox"
                defaultChecked={product?.active ?? true}
              />
              <span>VISIBLE IN STORE</span>
            </label>
          </section>
        </aside>
      </div>
    </form>
  );
}
