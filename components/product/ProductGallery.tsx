"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export default function ProductGallery({
  images,
  name,
}: ProductGalleryProps) {
  const safeImages = useMemo(
    () => images.filter(Boolean),
    [images]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const activeImage = safeImages[activeIndex] ?? safeImages[0];

  function showPreviousImage() {
    setActiveIndex((current) =>
      current === 0 ? safeImages.length - 1 : current - 1
    );
  }

  function showNextImage() {
    setActiveIndex((current) =>
      current === safeImages.length - 1 ? 0 : current + 1
    );
  }

  if (!activeImage) {
    return (
      <div className="product-gallery product-gallery-empty">
        NO PRODUCT IMAGES AVAILABLE
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <div className="product-gallery-glow" />

        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-arrow gallery-arrow-left"
              onClick={showPreviousImage}
              aria-label="Show previous product image"
            >
              ←
            </button>

            <button
              type="button"
              className="gallery-arrow gallery-arrow-right"
              onClick={showNextImage}
              aria-label="Show next product image"
            >
              →
            </button>
          </>
        )}

        <div className="product-gallery-image-frame" key={activeImage}>
          <Image
            src={activeImage}
            alt={`${name} image ${activeIndex + 1}`}
            width={1200}
            height={1200}
            priority={activeIndex === 0}
          />
        </div>

        <div className="product-gallery-counter">
          {String(activeIndex + 1).padStart(2, "0")} /{" "}
          {String(safeImages.length).padStart(2, "0")}
        </div>
      </div>

      <div className="product-gallery-thumbs">
        {safeImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            className={
              activeIndex === index
                ? "thumb active-thumb"
                : "thumb"
            }
            onClick={() => setActiveIndex(index)}
            aria-label={`Show ${name} image ${index + 1}`}
            aria-pressed={activeIndex === index}
          >
            <Image
              src={image}
              alt={`${name} thumbnail ${index + 1}`}
              width={220}
              height={220}
            />

            <span>{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}