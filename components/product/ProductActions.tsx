"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import type { Product } from "../../types/product";

type ProductActionsProps = {
  product: Product;
};

export default function ProductActions({
  product,
}: ProductActionsProps) {
  const firstAvailableSize =
    product.inventory.find((item) => item.quantity > 0)?.size ?? "";

  const [selectedSize, setSelectedSize] = useState(firstAvailableSize);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addItem } = useCart();

  const selectedInventory = useMemo(
    () =>
      product.inventory.find(
        (item) => item.size === selectedSize
      ),
    [product.inventory, selectedSize]
  );

  const availableQuantity = selectedInventory?.quantity ?? 0;
  const soldOut = availableQuantity <= 0;
  const total = product.price * quantity;

  useEffect(() => {
    setQuantity((current) =>
      Math.min(Math.max(1, current), Math.max(1, availableQuantity))
    );
  }, [availableQuantity]);

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
    setQuantity((current) =>
      Math.min(Math.max(1, availableQuantity), current + 1)
    );
  }

  function handleAddToCart() {
    if (!selectedSize || soldOut) return;

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
          <strong>{selectedSize || "SOLD OUT"}</strong>
        </div>

        <button type="button" className="size-guide-button">
          SIZE GUIDE
        </button>
      </div>

      <div
        className="product-detail-sizes"
        aria-label="Select product size"
      >
        {product.inventory.map((item) => {
          const unavailable = item.quantity <= 0;

          return (
            <button
              key={item.size}
              type="button"
              className={[
                "size-button",
                selectedSize === item.size ? "active-size" : "",
                unavailable ? "sold-out-size" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                if (!unavailable) {
                  setSelectedSize(item.size);
                  setQuantity(1);
                }
              }}
              aria-pressed={selectedSize === item.size}
              disabled={unavailable}
            >
              {item.size}
              <small>
                {unavailable
                  ? "SOLD OUT"
                  : item.quantity <= 3
                    ? `${item.quantity} LEFT`
                    : `${item.quantity} IN STOCK`}
              </small>
            </button>
          );
        })}
      </div>

      <div className="product-quantity-section">
        <span className="product-control-label">QUANTITY</span>

        <div className="quantity-row">
          <button
            type="button"
            onClick={decreaseQuantity}
            aria-label="Decrease quantity"
            disabled={soldOut}
          >
            −
          </button>

          <span>{quantity}</span>

          <button
            type="button"
            onClick={increaseQuantity}
            aria-label="Increase quantity"
            disabled={soldOut || quantity >= availableQuantity}
          >
            +
          </button>
        </div>

        {!soldOut && availableQuantity <= 3 ? (
          <p className="product-low-stock">
            ONLY {availableQuantity} LEFT IN {selectedSize}
          </p>
        ) : null}
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
        disabled={!selectedSize || soldOut}
      >
        {soldOut
          ? "SOLD OUT"
          : added
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
          <strong>LIVE INVENTORY</strong>
          <span>Availability updates after paid orders</span>
        </div>
      </div>
    </div>
  );
}
