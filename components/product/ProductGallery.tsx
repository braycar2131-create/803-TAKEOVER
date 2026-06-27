"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <Image src={activeImage} alt={name} width={1000} height={1000} />
      </div>

      <div className="product-gallery-thumbs">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            className={activeImage === image ? "thumb active" : "thumb"}
            onClick={() => setActiveImage(image)}
          >
            <Image
              src={image}
              alt={`${name} thumbnail ${index + 1}`}
              width={200}
              height={200}
            />
          </button>
        ))}
      </div>
    </div>
  );
}