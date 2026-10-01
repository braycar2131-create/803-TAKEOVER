/* eslint-disable @next/next/no-img-element */
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/sections/Footer";
import { useCart } from "../../context/CartContext";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  async function handleCheckout(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (items.length === 0 || isLoading) {
      return;
    }

    setCheckoutError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,

          items: items.map((item) => ({
            slug: item.slug,
            size: item.size,
            quantity: item.quantity,
          })),
        }),
      });

      const data = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(
          data.error || "Unable to begin checkout."
        );
      }

      window.location.href = data.url;
    } catch (error) {
      setCheckoutError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setIsLoading(false);
    }
  }

  return (
    <main className="checkout-page">
      <Navbar />

      <section className="checkout-hero checkout-hero-v2">
        <span>803 TAKEOVER</span>

        <h1>SECURE CHECKOUT</h1>

        <p>COMPLETE YOUR ORDER</p>

        <div className="checkout-progress">
          <div className="active">CART</div>
          <span />
          <div className="active">DETAILS</div>
          <span />
          <div>PAYMENT</div>
        </div>
      </section>

      <section className="checkout-layout">
        <div className="checkout-form-box">
          <span>SECURE PAYMENT</span>

          <h2>CONTINUE TO STRIPE</h2>

          <p>
            Your shipping address and payment information
            will be collected securely by Stripe.
          </p>

          {items.length === 0 ? (
            <div className="checkout-empty">
              <h3>YOUR CART IS EMPTY</h3>

              <Link href="/shop" className="checkout-button">
                RETURN TO SHOP
              </Link>
            </div>
          ) : (
            <form
              className="checkout-form"
              onSubmit={handleCheckout}
            >
              <input
                name="email"
                type="email"
                placeholder="EMAIL ADDRESS"
                autoComplete="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

              {checkoutError && (
                <p className="checkout-error">
                  {checkoutError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
              >
                {isLoading
                  ? "OPENING SECURE CHECKOUT..."
                  : "CONTINUE TO PAYMENT"}
              </button>

              <div className="checkout-benefits">
                <p>✓ PAYMENT SECURED BY STRIPE</p>
                <p>✓ SHIPPING DETAILS PROTECTED</p>
                <p>✓ LIMITED-RELEASE PRODUCTS</p>
              </div>

              <p className="checkout-note">
                You will be redirected to Stripe to complete
                payment.
              </p>
            </form>
          )}
        </div>

        <aside className="checkout-summary">
          <span className="summary-label">LONG LIVE FELIX COLLECTIVE</span>

          <h2>ORDER SUMMARY</h2>

          {items.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {items.map((item) => (
                <div
                  className="checkout-item"
                  key={`${item.slug}-${item.size}`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                  />

                  <div>
                    <h3>{item.name}</h3>
                    <p>SIZE: {item.size}</p>
                    <p>QTY: {item.quantity}</p>
                  </div>

                  <strong>
                    $
                    {(
                      item.price * item.quantity
                    ).toFixed(2)}
                  </strong>
                </div>
              ))}

              <div className="checkout-total checkout-total-v2">
                <span>SUBTOTAL</span>

                <strong>
                  ${subtotal.toFixed(2)}
                </strong>
              </div>
            </>
          )}
        </aside>
      </section>

      <Footer />
    </main>
  );
}