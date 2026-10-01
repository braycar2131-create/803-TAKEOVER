import Navbar from "../../components/layout/Navbar";

export default function ContactPage() {
  return (
    <main className="contact-page">
      <Navbar />

      <section className="contact-hero">
        <span>803 TAKEOVER</span>
        <h1>CONTACT</h1>
        <p>FOR ORDERS, COLLABS, QUESTIONS, AND SUPPORT.</p>
      </section>

      <section className="contact-layout">
        <div className="contact-card">
          <h2>SUPPORT</h2>
          <p>Email us for order questions, sizing help, and drop information.</p>
          <a href="mailto:support@803takeover.com">
            SUPPORT@803TAKEOVER.COM
          </a>
        </div>

        <div className="contact-card">
          <h2>COLLABS</h2>
          <p>For brand partnerships, creative work, and campaign inquiries.</p>
          <a href="mailto:collabs@803takeover.com">
            COLLABS@803TAKEOVER.COM
          </a>
        </div>

        <div className="contact-card">
          <h2>SOCIAL</h2>
          <p>Follow the movement and stay ready for the next drop.</p>
          <a href="https://instagram.com/803takeover" target="_blank">
            @803TAKEOVER
          </a>
        </div>
      </section>
    </main>
  );
}