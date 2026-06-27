export default function Collections() {
  return (
    <section className="collections" id="collections">
      <div className="section-header">
        <span>COLLECTIONS</span>
        <h2>EXPLORE DROP 001</h2>
      </div>

      <div className="collection-grid">
        <a className="collection-card black-card" href="/shop/black-felix-tee">
          <div className="collection-content"><span>01</span><h3>BLACK</h3><p>Dark base. Red pressure.</p></div>
        </a>
        <a className="collection-card white-card" href="/shop/white-felix-tee">
          <div className="collection-content"><span>02</span><h3>WHITE</h3><p>Clean base. Loud graphic.</p></div>
        </a>
        <a className="collection-card red-card" href="/shop/red-felix-tee">
          <div className="collection-content"><span>03</span><h3>RED</h3><p>Statement piece. Full takeover.</p></div>
        </a>
      </div>
    </section>
  );
}
