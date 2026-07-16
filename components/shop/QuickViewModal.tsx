"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../types/product";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function QuickViewModal({
  product,
  onClose,
}: Props) {
  if (!product) return null;

  const front = product.images[0];
  const back = product.images[1] ?? front;

  return (
    <>
      <div
        className="quick-view-overlay"
        onClick={onClose}
      />

      <div className="quick-view-modal">

        <button
          className="quick-view-close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="quick-view-image">

          <div className="quick-view-glow" />

          <Image
            src={front}
            alt={product.name}
            width={900}
            height={900}
            priority
          />

        </div>

        <div className="quick-view-info">

          <span>{product.tag}</span>

          <h2>{product.name}</h2>

          <div className="quick-price">
            {product.displayPrice}
          </div>

          <div className="quick-meta">

            <div>
              <strong>COLOR</strong>
              <p>{product.color}</p>
            </div>

            <div>
              <strong>CATEGORY</strong>
              <p>{product.category}</p>
            </div>

          </div>

          <div className="quick-description">

            Premium heavyweight luxury streetwear designed by
            803 TAKEOVER.

            Every piece is produced in limited quantities.

          </div>

          <div className="quick-images">

            <Image
              src={front}
              alt=""
              width={120}
              height={120}
            />

            <Image
              src={back}
              alt=""
              width={120}
              height={120}
            />

          </div>

          <Link
            href={`/shop/${product.slug}`}
            className="quick-view-button-full"
          >
            VIEW FULL PRODUCT
          </Link>

        </div>

      </div>
    </>
  );
}