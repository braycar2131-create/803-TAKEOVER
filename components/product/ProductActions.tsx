"use client";

import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types/product";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({
  product,
}: ProductActionsProps) {
  const [selectedSize, setSelectedSize] = useState(
    product.sizes[0] ?? ""
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addItem } = useCart();

  const total = product.price * quantity;

  useEffect(() => {
    if (!added) return;

    const timer = window.setTimeout(() => {
      setAdded(false);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [added]);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    setQuantity((current) => current + 1);
  }

  function handleAddToCart() {
    if (!selectedSize) return;

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
  }

  return (
    <div className="product-actions-panel">
      <div className="product-option-heading">
        <div>
          <span>SELECT SIZE</span>
          <strong>{selectedSize}</strong>
        </div>

        <button type="button" className="size-guide-button">
          SIZE GUIDE
        </button>
      </div>

      <div
        className="product-detail-sizes"
        aria-label="Select product size"
      >
        {product.sizes.map((size) => (
          <button
            key={size}
            type="button"
            className={
              selectedSize === size
                ? "size-button active-size"
                : "size-button"
            }
            onClick={() => setSelectedSize(size)}
            aria-pressed={selectedSize === size}
          >
            {size}
          </button>
        ))}
      </div>

      <div className="product-quantity-section">
        <span className="product-control-label">QUANTITY</span>

        <div className="quantity-row">
          <button
            type="button"
            onClick={decreaseQuantity}
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={increaseQuantity}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="product-total-row">
        <span>ORDER TOTAL</span>
        <strong>${total.toFixed(2)}</strong>
      </div>

      <button
        className={
          added
            ? "product-detail-cart product-detail-cart-added"
            : "product-detail-cart"
        }
        type="button"
        onClick={handleAddToCart}
        disabled={!selectedSize}
      >
        {added
          ? "ADDED TO CART"
          : `ADD ${selectedSize} TO CART`}
      </button>

      <div className="product-purchase-benefits">
        <div>
          <strong>LIMITED RELEASE</strong>
          <span>Produced in limited quantities</span>
        </div>

        <div>
          <strong>SECURE CHECKOUT</strong>
          <span>Protected payment experience</span>
        </div>

        <div>
          <strong>PREMIUM QUALITY</strong>
          <span>Built to represent the 803</span>
        </div>
      </div>
    </div>
  );
}