import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/sections/Footer";
import PolicyPage from "../../components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Returns and Refunds | 803 TAKEOVER",
  description:
    "Return, refund, and damaged-item information for 803 TAKEOVER.",
};

export default function ReturnsPage() {
  return (
    <main className="legal-page">
      <Navbar />

      <PolicyPage
        eyebrow="CUSTOMER CARE"
        title="RETURNS & REFUNDS"
        description="Review return eligibility before sending any product back."
      >
        <section>
          <h2>RETURN WINDOW</h2>

          <p>
            Eligible return requests must be submitted within
            14 calendar days after the carrier marks the order
            as delivered.
          </p>

          <p>
            A return must be approved before the product is
            mailed back. Packages sent without authorization may
            not be accepted.
          </p>
        </section>

        <section>
          <h2>RETURN CONDITION</h2>

          <p>
            Returned products must be unworn, unwashed,
            unaltered, free from odors or damage, and returned
            with their original tags and packaging when
            applicable.
          </p>
        </section>

        <section>
          <h2>NON-RETURNABLE PRODUCTS</h2>

          <p>
            Products marked final sale, customized products,
            worn or washed products, gift cards, and products
            damaged after delivery are not eligible for return.
          </p>
        </section>

        <section>
          <h2>RETURN SHIPPING</h2>

          <p>
            The customer is responsible for return-shipping
            costs unless the wrong product was delivered or the
            product arrived defective or damaged.
          </p>

          <p>
            Original shipping charges are not refundable unless
            the return resulted from an error by 803 TAKEOVER.
          </p>
        </section>

        <section>
          <h2>REFUNDS</h2>

          <p>
            Approved refunds are issued to the original payment
            method after the returned product is received and
            inspected. Financial institutions may require
            additional time to display the refund.
          </p>
        </section>

        <section>
          <h2>EXCHANGES</h2>

          <p>
            Because products and sizes may sell out, direct
            exchanges are not guaranteed. The fastest option is
            generally to return an eligible product and place a
            new order for the preferred size or color while it
            remains available.
          </p>
        </section>

        <section>
          <h2>START A RETURN</h2>

          <p>
            Submit the order number, customer email, product,
            return reason, and any relevant photographs through
            our <Link href="/contact">contact page</Link>.
          </p>
        </section>
      </PolicyPage>

      <Footer />
    </main>
  );
}
