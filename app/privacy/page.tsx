import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/sections/Footer";
import PolicyPage from "../../components/legal/PolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy | 803 TAKEOVER",
  description:
    "Information about how 803 TAKEOVER collects and uses personal information.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Navbar />

      <PolicyPage
        eyebrow="YOUR INFORMATION"
        title="PRIVACY POLICY"
        description="How information is collected, used, protected, and shared."
      >
        <section>
          <h2>INFORMATION WE COLLECT</h2>

          <p>
            We may collect information that you provide during
            checkout or when contacting us, including your name,
            email address, telephone number, billing and
            shipping addresses, order details, and customer
            service messages.
          </p>

          <p>
            Payment-card information is processed by our payment
            provider. We do not intentionally store complete
            payment-card numbers on the 803 TAKEOVER website.
          </p>
        </section>

        <section>
          <h2>AUTOMATIC INFORMATION</h2>

          <p>
            The website and its service providers may
            automatically receive technical information such as
            IP address, browser type, device type, pages viewed,
            referral information, and cookie or similar
            technology data.
          </p>
        </section>

        <section>
          <h2>HOW INFORMATION IS USED</h2>

          <p>
            Information may be used to process payments,
            fulfill and deliver orders, provide customer
            service, prevent fraud, maintain website security,
            analyze website performance, comply with legal
            obligations, and communicate about orders or
            services.
          </p>
        </section>

        <section>
          <h2>SERVICE PROVIDERS</h2>

          <p>
            Information may be shared with companies that help
            operate the store, including payment processors,
            hosting providers, database providers, shipping
            carriers, analytics providers, email providers, and
            professional advisers.
          </p>

          <p>
            These providers receive information only as needed
            to perform services for the store or as otherwise
            permitted by law.
          </p>
        </section>

        <section>
          <h2>COOKIES AND ANALYTICS</h2>

          <p>
            Cookies and similar technologies may be used to keep
            the website functioning, remember preferences,
            measure traffic, improve performance, and understand
            how visitors use the store.
          </p>
        </section>

        <section>
          <h2>DATA RETENTION AND SECURITY</h2>

          <p>
            Information is retained for as long as reasonably
            needed to complete transactions, maintain business
            records, resolve disputes, enforce agreements, and
            satisfy legal obligations.
          </p>

          <p>
            Reasonable safeguards are used to protect
            information, but no online transmission or storage
            system can be guaranteed completely secure.
          </p>
        </section>

        <section>
          <h2>YOUR PRIVACY REQUESTS</h2>

          <p>
            Depending on where you live, you may have rights
            concerning access, correction, deletion, or use of
            personal information. We may need to verify a
            request before completing it.
          </p>

          <p>
            Submit a privacy request through our{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </section>

        <section>
          <h2>CHILDREN</h2>

          <p>
            This website is not intended for children under 13,
            and we do not knowingly request personal
            information from children under 13.
          </p>
        </section>

        <section>
          <h2>POLICY UPDATES</h2>

          <p>
            This policy may be updated when store practices,
            technology, or legal requirements change. The date
            at the top of this page identifies the latest
            revision.
          </p>
        </section>
      </PolicyPage>

      <Footer />
    </main>
  );
}
