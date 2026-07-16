import Image from "next/image";
import Link from "next/link";

export default function FeaturedReveal() {
  return (
    <section className="featured-reveal">

      <div className="featured-reveal-bg">
        DROP 001
      </div>

      <div className="featured-reveal-image">

        <div className="reveal-glow"></div>

        <Image
          src="/products/drop001/black/front.png"
          alt="Black Felix Tee"
          width={900}
          height={900}
          priority
        />

      </div>

      <div className="featured-reveal-content">

        <span>LIMITED RELEASE</span>

        <h2>
          BLACK <br />
          FELIX TEE
        </h2>

        <p>
          Heavyweight luxury cotton.
          Premium screen print.
          Built for the ones taking over.
        </p>

        <Link href="/products/black-felix-tee">
          VIEW PRODUCT
        </Link>

      </div>

    </section>
  );
}