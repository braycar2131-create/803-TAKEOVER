"use client";

import { useEffect } from "react";
import Link from "next/link";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/sections/Footer";
import { useCart } from "../../context/CartContext";

export default function OrderConfirmationPage() {
  const { clearCart } = useCart();

  useEffect(() => {
  const searchParams = new URLSearchParams(
    window.location.search
  );

  const sessionId =
    searchParams.get("session_id");

  if (sessionId) {
    clearCart();
  }
}, [clearCart]);

  return (
    <main className="confirmation-page">
      <Navbar />

      <section className="confirmation-section">
        <div className="confirmation-glow" />

        <span className="confirmation-eyebrow">803 TAKEOVER</span>

        <div className="confirmation-check" aria-label="Order confirmed">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M5 12.5L9.5 17L19 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1>
          ORDER
          <br />
          CONFIRMED
        </h1>

        <p className="confirmation-message">
          Your order has been received and payment was confirmed. We will begin processing your order and send updates to the email used at checkout.
        </p>

        <div className="confirmation-details">
          <div>
            <span>STATUS</span>
            <strong>CONFIRMED</strong>
          </div>

          <div>
            <span>COLLECTION</span>
            <strong>LONG LIVE FELIX COLLECTIVE</strong>
          </div>

          <div>
            <span>NEXT STEP</span>
            <strong>PROCESSING</strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link href="/shop">CONTINUE SHOPPING</Link>

          <Link href="/" className="confirmation-secondary">
            RETURN HOME
          </Link>
        </div>

        <p className="confirmation-tagline">
          THE CITY WATCHING. THE MOVEMENT GROWING.
        </p>
      </section>

      <Footer />
    </main>
  );
}

