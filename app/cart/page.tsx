"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/sections/Footer";
import { useCart } from "../../context/CartContext";

export default function CartPage() {
  const {
    items,
    subtotal,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();

  return (
    <main className="cart-page cart-page-v2">
      <Navbar />

      <section className="cart-hero">
        <span>803 TAKEOVER</span>
        <h1>YOUR CART</h1>
        <p>YOUR SELECTED PIECES</p>
      </section>

      {items.length === 0 ? (
        <section className="cart-empty-state">
          <div className="cart-empty-glow" />

          <span>LONG LIVE FELIX COLLECTIVE</span>

          <h2>
            YOUR CART
            <br />
            IS WAITING
          </h2>

          <p>
            The takeover starts with your first piece.
          </p>

          <Link href="/shop">SHOP THE COLLECTIVE</Link>
        </section>
      ) : (
        <section className="cart-layout">
          <div className="cart-products-column">
            <div className="cart-section-heading">
              <div>
                <span>YOUR SELECTION</span>
                <h2>
                  {items.length} {items.length === 1 ? "PIECE" : "PIECES"}
                </h2>
              </div>

              <button type="button" onClick={clearCart}>
                CLEAR CART
              </button>
            </div>

            <div className="cart-items-list">
              {items.map((item) => {
                const lineTotal = item.price * item.quantity;

                return (
                  <article
                    className="cart-product-card"
                    key={`${item.slug}-${item.size}`}
                  >
                    <Link
                      href={`/shop/${item.slug}`}
                      className="cart-product-image"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={320}
                        height={320}
                      />
                    </Link>

                    <div className="cart-product-details">
                      <div className="cart-product-top">
                        <div>
                          <span>803 TAKEOVER</span>
                          <h3>{item.name}</h3>
                        </div>

                        <strong>${lineTotal.toFixed(2)}</strong>
                      </div>

                      <div className="cart-product-meta">
                        <p>
                          SIZE
                          <strong>{item.size}</strong>
                        </p>

                        <p>
                          UNIT PRICE
                          <strong>{item.displayPrice}</strong>
                        </p>
                      </div>

                      <div className="cart-product-controls">
                        <div className="cart-quantity-control">
                          <button
                            type="button"
                            aria-label={`Decrease ${item.name} quantity`}
                            onClick={() =>
                              updateQuantity(
                                item.slug,
                                item.size,
                                item.quantity - 1
                              )
                            }
                          >
                            −
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            type="button"
                            aria-label={`Increase ${item.name} quantity`}
                            onClick={() =>
                              updateQuantity(
                                item.slug,
                                item.size,
                                item.quantity + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="cart-remove-button"
                          type="button"
                          onClick={() =>
                            removeItem(item.slug, item.size)
                          }
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <Link href="/shop" className="continue-shopping-link">
              ← CONTINUE SHOPPING
            </Link>
          </div>

          <aside className="cart-summary-card">
            <span>ORDER SUMMARY</span>
            <h2>YOUR TOTAL</h2>

            <div className="cart-summary-lines">
              <div>
                <span>SUBTOTAL</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>

              <div>
                <span>SHIPPING</span>
                <strong>CALCULATED AT CHECKOUT</strong>
              </div>

              <div>
                <span>ESTIMATED TAX</span>
                <strong>CALCULATED AT CHECKOUT</strong>
              </div>
            </div>

            <div className="cart-summary-total">
              <span>TOTAL</span>
              <strong>${subtotal.toFixed(2)}</strong>
            </div>

            <Link href="/checkout" className="cart-secure-checkout">
              SECURE CHECKOUT →
            </Link>

            <div className="cart-benefits">
              <p>SECURE CHECKOUT</p>
              <p>LIMITED RELEASE</p>
              <p>PREMIUM QUALITY</p>
            </div>
          </aside>
        </section>
      )}

      <Footer />
    </main>
  );
}