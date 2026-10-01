import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/sections/Footer";
import PolicyPage from "../../components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Terms and Conditions | 803 TAKEOVER",
  description:
    "Terms governing use of the 803 TAKEOVER website and store.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <Navbar />

      <PolicyPage
        eyebrow="STORE TERMS"
        title="TERMS & CONDITIONS"
        description="The rules that apply when using this website or placing an order."
      >
        <section>
          <h2>ACCEPTANCE</h2>

          <p>
            By using this website or placing an order, you agree
            to these terms and the policies linked throughout
            the website. Do not use the website when you do not
            agree with these terms.
          </p>
        </section>

        <section>
          <h2>PRODUCT INFORMATION</h2>

          <p>
            We work to display product descriptions, images,
            colors, availability, and prices accurately.
            Displays and lighting may cause product colors to
            appear differently on individual devices.
          </p>

          <p>
            We may correct errors, update information, or cancel
            an affected order when material product or pricing
            information is incorrect.
          </p>
        </section>

        <section>
          <h2>ORDERS</h2>

          <p>
            Submitting an order does not guarantee acceptance.
            We may decline or cancel an order for suspected
            fraud, payment problems, inventory errors,
            purchasing-limit violations, inaccurate customer
            information, or other legitimate business reasons.
          </p>

          <p>
            When a paid order is cancelled by us, the affected
            payment will be refunded.
          </p>
        </section>

        <section>
          <h2>PAYMENTS</h2>

          <p>
            Customers authorize the store and its payment
            provider to charge the payment method submitted at
            checkout for the order total shown, including
            applicable shipping charges and taxes.
          </p>
        </section>

        <section>
          <h2>SHIPPING AND RETURNS</h2>

          <p>
            Shipping and return eligibility are governed by our{" "}
            <Link href="/shipping">Shipping Policy</Link> and{" "}
            <Link href="/returns">
              Returns and Refunds Policy
            </Link>.
          </p>
        </section>

        <section>
          <h2>INTELLECTUAL PROPERTY</h2>

          <p>
            The 803 TAKEOVER name, logos, graphics, product
            designs, photographs, website design, text, and
            other original content are protected by applicable
            intellectual-property laws.
          </p>

          <p>
            Content may not be copied, reproduced, modified,
            distributed, sold, or used commercially without
            authorization.
          </p>
        </section>

        <section>
          <h2>PROHIBITED ACTIVITY</h2>

          <p>
            You may not misuse the website, attempt unauthorized
            access, interfere with website operation, introduce
            malicious code, scrape protected content, commit
            fraud, impersonate another person, or use the
            website for unlawful activity.
          </p>
        </section>

        <section>
          <h2>WEBSITE AVAILABILITY</h2>

          <p>
            Website access may occasionally be interrupted for
            maintenance, updates, service-provider problems, or
            circumstances outside our reasonable control.
          </p>
        </section>

        <section>
          <h2>LIMITATION</h2>

          <p>
            To the fullest extent permitted by applicable law,
            803 TAKEOVER is not responsible for indirect,
            incidental, special, or consequential losses
            resulting from use of the website.
          </p>

          <p>
            Nothing in these terms excludes rights or remedies
            that cannot legally be excluded.
          </p>
        </section>

        <section>
          <h2>CHANGES TO THESE TERMS</h2>

          <p>
            These terms may be updated periodically. Continued
            use of the website after an update means the revised
            terms apply to later use and purchases.
          </p>
        </section>

        <section>
          <h2>CONTACT</h2>

          <p>
            Questions about these terms can be submitted through
            our <Link href="/contact">contact page</Link>.
          </p>
        </section>
      </PolicyPage>

      <Footer />
    </main>
  );
}
