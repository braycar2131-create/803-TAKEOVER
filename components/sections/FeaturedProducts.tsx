import { products } from "../../data/products";
import ProductCard from "../product/ProductCard";

export default function FeaturedProducts() {
  const featuredProducts = products.filter((product) => product.featured);

  return (
    <section className="featured" id="featured">
      <div className="section-header">
        <span>DROP 001</span>
        <h2>LONG LIVE FELIX</h2>
      </div>

      <div className="featured-grid">
        {featuredProducts.map((product) => (
          <ProductCard product={product} key={product.slug} />
        ))}
      </div>
    </section>
  );
}