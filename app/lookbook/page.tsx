/* eslint-disable @next/next/no-img-element */
import Navbar from "../../components/layout/Navbar";

export default function LookbookPage() {
  return (
    <main className="lookbook-page">
      <Navbar />

      <section className="lookbook-hero">
        <span>803 TAKEOVER</span>
        <h1>LOOKBOOK</h1>
        <p>LONG LIVE FELIX COLLECTIVE VISUALS • LONG LIVE FELIX</p>
      </section>

      <section className="lookbook-grid-page">
        <div className="lookbook-photo large">
          <img src="/products/drop001/black/front.png" alt="Black Felix Tee Front" />
          <div>
            <h2>BLACK COLORWAY</h2>
            <p>FRONT DESIGN</p>
          </div>
        </div>

        <div className="lookbook-photo">
          <img src="/products/drop001/black/back.png" alt="Black Felix Tee Back" />
          <div>
            <h2>BACK GRAPHIC</h2>
            <p>TRUCK CAMPAIGN ART</p>
          </div>
        </div>

        <div className="lookbook-photo">
          <img src="/products/drop001/red/front.png" alt="Red Felix Tee Front" />
          <div>
            <h2>RED COLORWAY</h2>
            <p>LOUD STATEMENT PIECE</p>
          </div>
        </div>

        <div className="lookbook-photo wide">
          <img src="/products/drop001/white/back.png" alt="White Felix Tee Back" />
          <div>
            <h2>WHITE COLORWAY</h2>
            <p>CLEAN BASE • HEAVY GRAPHIC</p>
          </div>
        </div>
      </section>
    </main>
  );
}