import ProductCard from "../product/ProductCard";
import { getStoreProducts } from "../../lib/products";

export const dynamic = "force-dynamic";

export default async function FeaturedProducts() {
  const products = await getStoreProducts({ featuredOnly: true });

  if (products.length === 0) return null;

  return (
    <section className="featured-v2">
      <div className="featured-v2-header">
        <span>LONG LIVE FELIX COLLECTIVE</span>
        <h2>FEATURED PIECES</h2>
        <p>LIMITED RELEASE<br />DESIGNED TO BE FLY</p>
      </div>

      <div className="featured-v2-grid">
        {products.slice(0, 3).map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </section>
  );
}
