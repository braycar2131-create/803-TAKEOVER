import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/sections/Footer";
import PolicyPage from "../../components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Shipping Policy | 803 TAKEOVER",
  description:
    "Shipping and order-delivery information for 803 TAKEOVER.",
};

export default function ShippingPage() {
  return (
    <main className="legal-page">
      <Navbar />

      <PolicyPage
        eyebrow="ORDER INFORMATION"
        title="SHIPPING POLICY"
        description="How 803 TAKEOVER processes, ships, and delivers your order."
      >
        <section>
          <h2>ORDER PROCESSING</h2>

          <p>
            Most in-stock orders are processed within
            3–7 business days after payment is confirmed.
            Business days exclude weekends and holidays.
          </p>

          <p>
            Preorders, made-to-order products, and special
            releases may have a different processing period.
            Any different timeline will be displayed on the
            relevant product or release page.
          </p>
        </section>

        <section>
          <h2>SHIPPING AND DELIVERY</h2>

          <p>
            Delivery estimates begin after the order has been
            processed and transferred to the shipping carrier.
            Carrier delivery dates are estimates and are not
            guaranteed.
          </p>

          <p>
            Tracking information will be sent to the email
            address provided during checkout when it becomes
            available.
          </p>
        </section>

        <section>
          <h2>DELAYS</h2>

          <p>
            When we learn that an order cannot ship within the
            stated timeframe, we will contact the customer with
            updated information and provide available options,
            including waiting for the order or cancelling it for
            a refund.
          </p>
        </section>

        <section>
          <h2>ADDRESS ACCURACY</h2>

          <p>
            Customers are responsible for providing a complete
            and accurate shipping address. Contact us as soon as
            possible when an address needs to be corrected.
            Address changes cannot be guaranteed after an order
            begins processing.
          </p>
        </section>

        <section>
          <h2>LOST OR DAMAGED PACKAGES</h2>

          <p>
            Contact us when an order arrives damaged or tracking
            indicates a delivery problem. Keep the packaging and
            provide photographs when damage is involved so we
            can review the issue and assist with the carrier
            claim.
          </p>
        </section>

        <section>
          <h2>CONTACT</h2>

          <p>
            Questions about shipping or an existing order can be
            submitted through our{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </section>
      </PolicyPage>

      <Footer />
    </main>
  );
}
