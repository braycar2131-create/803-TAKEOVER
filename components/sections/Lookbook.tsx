const lookbook = [
  { title: "BLACK FRONT", image: "/products/drop001/black/front.png" },
  { title: "BLACK BACK", image: "/products/drop001/black/back.png" },
  { title: "WHITE FRONT", image: "/products/drop001/white/front.png" },
  { title: "RED FRONT", image: "/products/drop001/red/front.png" },
];

export default function Lookbook() {
  return (
    <section className="lookbook" id="lookbook">
      <div className="section-header"><span>LOOKBOOK 2026</span><h2>THE TAKEOVER FILES</h2></div>
      <div className="lookbook-grid">
        {lookbook.map((item) => (
          <article className="lookbook-card" key={item.title}>
            <img src={item.image} alt={item.title} />
            <div><h3>{item.title}</h3><p>EXPLORE</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
