"use client";

import { useState } from "react";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types/product";

export default function ProductActions({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem({
      slug: product.slug,
      name: product.name,
      price: product.price,
      displayPrice: product.displayPrice,
      image: product.image,
      size: selectedSize,
      quantity,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1600);
  }

  return (
    <div className="product-actions-panel">
      <div className="product-detail-sizes">
        {product.sizes.map((size) => (
          <button
            key={size}
            type="button"
            className={selectedSize === size ? "active-size" : ""}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="quantity-row">
        <button
          type="button"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
        >
          -
        </button>

        <span>{quantity}</span>

        <button
          type="button"
          onClick={() => setQuantity((current) => current + 1)}
        >
          +
        </button>
      </div>

      <p className="product-live-total">TOTAL: ${product.price * quantity}</p>

      <button
        className="product-detail-cart"
        type="button"
        onClick={handleAddToCart}
      >
        {added ? "ADDED TO CART" : `ADD TO CART — ${selectedSize} × ${quantity}`}
      </button>
    </div>
  );
}