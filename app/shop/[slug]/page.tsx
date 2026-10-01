import Link from "next/link";

import { notFound } from "next/navigation";
import Navbar from "../../../components/layout/Navbar";
import ProductGallery from "../../../components/product/ProductGallery";
import ProductActions from "../../../components/product/ProductActions";
import FeaturedProducts from "../../../components/sections/FeaturedProducts";
import Footer from "../../../components/sections/Footer";
import { getStoreProductBySlug } from "../../../lib/products";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const product = await getStoreProductBySlug(slug);

  if (!product || product.active === false) {
    notFound();
  }

  const oversizedSlugs = [
    "803-oversized-hoodie",
    "803-oversized-longsleeve",
    "803-oversized-tee",
  ];

  const isOversized = product.slug.includes("oversized");

  const displayLabel = isOversized
    ? "OVERSIZED"
    : product.tag;

  const displayFit = isOversized
    ? "OVERSIZED"
    : "RELAXED";

  const displayCategory =
  product.slug.includes("longsleeve")
    ? "LONG SLEEVE"
    : product.category;

  const descriptionBySlug: Record<string, string> = {
    "803-oversized-hoodie":
      "An oversized 803 TAKEOVER hoodie built around a bold streetwear silhouette and everyday wearability.",

    "803-oversized-longsleeve":
      "An oversized 803 TAKEOVER long sleeve designed with a loose streetwear silhouette and statement graphics.",

    "803-oversized-tee":
      "An oversized 803 TAKEOVER tee designed with a roomy streetwear silhouette and a strong graphic presence.",
  };

  const displayDescription =
    descriptionBySlug[product.slug] ??
    product.description;

  return (
    <main className="product-page">
      <Navbar />

      <section className="product-detail product-detail-v2">
        <div className="product-breadcrumb">
          <Link href="/">HOME</Link>
          <span>/</span>

          <Link href="/shop">
            SHOP
          </Link>

          <span>/</span>

          <strong>
            {product.name}
          </strong>
        </div>

        <ProductGallery
          images={product.images}
          name={product.name}
        />

        <div className="product-detail-info product-detail-info-v2">
          <span>{displayLabel}</span>

          <h1>
            {product.name}
          </h1>

          <p className="product-detail-price">
            {product.displayPrice}
          </p>

          <p className="product-detail-copy">
            {displayDescription}
          </p>

          <div className="product-meta product-meta-grid">
            <div>
              <span>COLOR</span>
              <strong>
                {product.color}
              </strong>
            </div>

            <div>
              <span>COLLECTION</span>
              <strong>
                {product.tag}
              </strong>
            </div>

            <div>
              <span>CATEGORY</span>
              <strong>
                {displayCategory}
              </strong>
            </div>

            <div>
              <span>FIT</span>
              <strong>
                {displayFit}
              </strong>
            </div>

            <div>
              <span>FABRIC</span>
              <strong>
                PREMIUM COTTON
              </strong>
            </div>

            <div>
              <span>BRAND</span>
              <strong>
                803 TAKEOVER
              </strong>
            </div>
          </div>

          <ProductActions product={product} />

          <Link
            className="back-shop"
            href="/shop"
          >
            ← BACK TO SHOP
          </Link>
        </div>
      </section>

      <section className="product-story">
        <span>
          803 TAKEOVER — LONG LIVE FELIX COLLECTIVE
        </span>

        <h2>
          BUILT TO
          <br />
          TAKEOVER
        </h2>

        <p>
          Premium streetwear created for the movement.
          Every piece is released in limited quantities
          and built around the 803 TAKEOVER identity.
        </p>
      </section>

      <FeaturedProducts />

      <Footer />
    </main>
  );
}