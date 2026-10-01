import Image from "next/image";
import Link from "next/link";

export default function Campaign() {
  return (
    <section className="campaign-v2">
      <div className="campaign-v2-bg">TAKEOVER</div>

      <div className="campaign-v2-copy">
        <span>CAMPAIGN 2026</span>

        <h2>
          THE CITY <br />
          KNOWS
        </h2>

        <p>
          They laughed when we started. Now they watching. The LONG LIVE FELIX COLLECTIVE is built
          from pressure, loyalty, motion, and takeover energy.
        </p>

        <div className="campaign-v2-actions">
          <Link href="/shop">SHOP THE COLLECTIVE</Link>
          <Link href="/about" className="secondary">
            THE STORY
          </Link>
        </div>
      </div>

      <div className="campaign-v2-product">
        <div className="campaign-v2-glow"></div>

        <Image
          src="/products/drop001/black/back.png"
          alt="803 Takeover Black Felix Tee Back"
          width={900}
          height={900}
          priority={false}
        />

        <div className="campaign-v2-label">
          <span>LONG LIVE FELIX COLLECTIVE</span>
          <strong>LONG LIVE FELIX</strong>
        </div>
      </div>
    </section>
  );
}