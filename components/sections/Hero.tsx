import Link from "next/link";
import ThreeDCrown from "../hero/ThreeDCrown";

const stars = Array.from({ length: 32 }, (_, index) => index + 1);
const crosses = Array.from({ length: 12 }, (_, index) => index + 1);

export default function Hero() {
  return (
    <section className="cinematic-hero">
      <div className="hero-noise"></div>
      <div className="hero-red-glow"></div>
      <div className="logo-flare"></div>

      <div className="flare-stars">
        {stars.map((star) => (
          <span className={`flare-star star-${star}`} key={star}></span>
        ))}
      </div>

      <div className="floating-crosses">
        {crosses.map((cross) => (
          <span className={`neon-cross cross-${cross}`} key={cross}>
            ✝
          </span>
        ))}
      </div>

      <div className="smoke-layer smoke-left"></div>
      <div className="smoke-layer smoke-right"></div>
      <div className="smoke-layer smoke-bottom"></div>

      <div className="cloud-smoke">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className="cinematic-content">
        <ThreeDCrown />

        <p className="cinematic-eyebrow">
          803 TAKEOVER PRESENTS
        </p>

        <h1>
          803 <br />
          <span>TAKEOVER</span>
        </h1>

        <p className="cinematic-tagline">
          THE CITY WATCHING.
          <br />
          THE MOVEMENT GROWING.
        </p>

        <Link href="/shop" className="cinematic-button">
          SHOP NOW
        </Link>
      </div>

      <div className="scroll-cue">
        <span>SCROLL DOWN</span>
        <div></div>
      </div>
    </section>
  );
}