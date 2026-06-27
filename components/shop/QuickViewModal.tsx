"use client";

import Image from "next/image";
import type { Product } from "../../types/product";

export default function QuickViewModal({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  if (!product) return null;

  return (
    <>
      <div className="quick-view-overlay" onClick={onClose} />

      <div className="quick-view-modal">
        <button className="quick-view-close" type="button" onClick={onClose}>
          ✕
        </button>

        <div className="quick-view-image">
          <Image
            src={product.image}
            alt={product.name}
            width={700}
            height={700}
          />
        </div>

        <div className="quick-view-info">
          <span>{product.tag}</span>
          <h2>{product.name}</h2>
          <p>{product.displayPrice}</p>
          <small>{product.color}</small>

          <a href={`/shop/${product.slug}`}>VIEW FULL PRODUCT</a>
        </div>
      </div>
    </>
  );
}