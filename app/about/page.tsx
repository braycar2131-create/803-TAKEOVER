import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/sections/Footer";

export default function AboutPage() {
  return (
    <main className="about-page">
      <Navbar />

      <section className="about-hero">
        <span>803 TAKEOVER</span>
        <h1>BUILT FROM PRESSURE</h1>
        <p>
          A luxury streetwear movement built from the city, ambition, loyalty,
          pain, and legacy.
        </p>
      </section>

      <section className="about-story-block">
        <div>
          <span>THE MOVEMENT</span>
          <h2>NOT MADE TO FIT IN</h2>
        </div>

        <p>
          803 TAKEOVER represents the people who were counted out, overlooked,
          doubted, and still found a way to move different. Every piece is built
          with pressure, meaning, and street luxury energy.
        </p>
      </section>

      <section className="about-values">
        <div>
          <h3>PRESSURE</h3>
          <p>Every drop is designed to feel bold, intentional, and impossible to ignore.</p>
        </div>

        <div>
          <h3>LOYALTY</h3>
          <p>The brand stands on legacy, memory, and the people who shaped the movement.</p>
        </div>

        <div>
          <h3>TAKEOVER</h3>
          <p>This is about becoming impossible to overlook.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}