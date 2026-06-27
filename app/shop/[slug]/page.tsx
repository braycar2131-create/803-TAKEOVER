import { products } from "../../../data/products";
import ProductActions from "../../../components/product/ProductActions";
import ProductGallery from "../../../components/product/ProductGallery";
import ProductCard from "../../../components/product/ProductCard";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return (
      <main className="product-page">
        <section className="product-detail">
          <div className="product-detail-info">
            <span>803 TAKEOVER</span>
            <h1>PRODUCT NOT FOUND</h1>

            <a className="back-shop" href="/shop">
              BACK TO SHOP
            </a>
          </div>
        </section>
      </main>
    );
  }

  const relatedProducts = products.filter((item) => item.slug !== product.slug);

  return (
    <main className="product-page">
      <section className="product-detail">
        <ProductGallery images={product.images} name={product.name} />

        <div className="product-detail-info">
          <span>{product.tag}</span>

          <h1>{product.name}</h1>

          <p className="product-detail-price">{product.displayPrice}</p>

          <p className="product-detail-copy">{product.description}</p>

          <div className="product-meta">
            <p>COLOR: {product.color}</p>
            <p>CATEGORY: {product.category}</p>
            <p>DROP: LONG LIVE FELIX</p>
          </div>

          <ProductActions product={product} />

          <a className="back-shop" href="/shop">
            BACK TO SHOP
          </a>
        </div>
      </section>

      <section className="related-products">
        <div className="section-header">
          <span>COMPLETE THE DROP</span>
          <h2>RELATED PIECES</h2>
        </div>

        <div className="featured-grid">
          {relatedProducts.map((item) => (
            <ProductCard product={item} key={item.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}