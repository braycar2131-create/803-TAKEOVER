import Link from "next/link";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/sections/Footer";
import { collectives } from "../../data/collectives";

export default function ShopPage() {
  return (
    <main className="shop-page">
      <Navbar />

      <section className="shop-hero">
        <span>803 TAKEOVER PRESENTS</span>

        <h1>
          SHOP THE
          <br />
          COLLECTIVES
        </h1>

        <p>
          EACH COLLECTIVE CARRIES ITS OWN STORY,
          <br />
          IDENTITY, AND LEGACY.
        </p>
      </section>

      <section className="collective-directory">
        <div className="collective-directory-header">
          <span>803 TAKEOVER ARCHIVE</span>
          <h2>CHOOSE A COLLECTIVE</h2>
        </div>

        <div className="collective-directory-grid">
          {collectives.map((collective, index) => (
            <Link
              key={collective.slug}
              href={`/shop/collectives/${collective.slug}`}
              className="collective-card"
            >
              <div className="collective-card-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="collective-card-content">
                <span>{collective.eyebrow}</span>

                <h3>{collective.name}</h3>

                <p>{collective.description}</p>

                <strong>ENTER COLLECTIVE ↗</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}