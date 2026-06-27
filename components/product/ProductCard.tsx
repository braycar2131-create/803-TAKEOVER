"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "../../types/product";

type ProductCardProps = {
  product: Product;
  onQuickView?: () => void;
};

export default function ProductCard({
  product,
  onQuickView,
}: ProductCardProps) {
  const frontImage = product.images[0];
  const backImage = product.images[1] || product.images[0];

  return (
    <article className="product-card">
      <Link href={`/shop/${product.slug}`} className="product-card-link">
        <div className="product-image">
          <Image
            className="product-front"
            src={frontImage}
            alt={`${product.name} front`}
            width={900}
            height={900}
          />

          <Image
            className="product-back"
            src={backImage}
            alt={`${product.name} back`}
            width={900}
            height={900}
          />
        </div>

        <div className="product-info">
          <span>{product.tag}</span>
          <h3>{product.name}</h3>
          <p>{product.displayPrice}</p>
          <small>{product.color}</small>
        </div>
      </Link>

      {onQuickView && (
        <button
          className="quick-view-button"
          type="button"
          onClick={onQuickView}
        >
          QUICK VIEW
        </button>
      )}
    </article>
  );
}