import Link from "next/link";
import Image from "next/image";

const heroProducts = [
  {
    label: "BLACK",
    image: "/products/drop001/black/front.png",
  },
  {
    label: "WHITE",
    image: "/products/drop001/white/front.png",
  },
  {
    label: "RED",
    image: "/products/drop001/red/front.png",
  },
];

export default function Hero() {
  return (
    <section className="hero-v4" id="home">
      <div className="hero-v4-glow" />

      <div className="hero-v4-content">
        <span>803 TAKEOVER PRESENTS</span>

        <h1>
          DROP 001 <br />
          LONG LIVE FELIX
        </h1>

        <p>THE CITY WATCHING. THE MOVEMENT GROWING.</p>

        <div className="hero-v4-products">
          {heroProducts.map((product) => (
            <div className="hero-v4-card" key={product.label}>
              <Image
                src={product.image}
                alt={`${product.label} Felix Tee`}
                width={700}
                height={700}
                priority
              />
              <small>{product.label}</small>
            </div>
          ))}
        </div>

        <Link className="hero-v4-button" href="/shop">
          SHOP THE DROP
        </Link>
      </div>
    </section>
  );
}