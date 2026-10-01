import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "../../../../components/layout/Navbar";
import Footer from "../../../../components/sections/Footer";
import ProductCard from "../../../../components/product/ProductCard";
import { getStoreProducts } from "../../../../lib/products";
import { getCollectiveBySlug } from "../../../../data/collectives";

export const dynamic = "force-dynamic";

type CollectivePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CollectivePage({
  params,
}: CollectivePageProps) {
  const { slug } = await params;
  const collective = getCollectiveBySlug(slug);

  if (!collective) {
    notFound();
  }

  const allProducts = await getStoreProducts();

  const collectiveProducts = allProducts.filter(
    (product) =>
      product.active !== false &&
      product.tag.trim().toUpperCase() ===
        collective.productTag.trim().toUpperCase()
  );

  return (
    <main className="collective-page">
      <Navbar />

      <section className="collective-hero">
        <div
          className="collective-hero-number"
          aria-hidden="true"
        >
          803
        </div>

        <Link
          href="/shop"
          className="collective-back-link"
        >
          ← ALL COLLECTIVES
        </Link>

        <div className="collective-hero-content">
          <span className="collective-hero-eyebrow">
            {collective.eyebrow}
          </span>

          <h1>{collective.name}</h1>

          <p>{collective.description}</p>
        </div>
      </section>

      <section className="collective-products-section">
        <div className="collective-products-header">
          <div>
            <span>THE COLLECTIVE</span>
            <h2>AVAILABLE PIECES</h2>
          </div>

          <strong>
            {collectiveProducts.length}{" "}
            {collectiveProducts.length === 1
              ? "PIECE"
              : "PIECES"}
          </strong>
        </div>

        {collectiveProducts.length > 0 ? (
          <div className="shop-products">
            {collectiveProducts.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="collective-empty">
            <span>COMING SOON</span>
            <h3>NO PIECES ARE AVAILABLE YET</h3>
          </div>
        )}
      </section>

      <section className="collective-statement">
  <span>{collective.statementEyebrow}</span>

  <h2>{collective.statementTitle}</h2>

  <p>{collective.statement}</p>
</section>

      <Footer />
    </main>
  );
}