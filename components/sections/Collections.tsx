import Image from "next/image";
import Link from "next/link";

const collections = [
  {
    number: "01",
    title: "BLACK FELIX TEE",
    text: "Dark base. Red pressure.",
    href: "/products/black-felix-tee",
    image: "/products/drop001/black/front.png",
  },
  {
    number: "02",
    title: "WHITE FELIX TEE",
    text: "Clean base. Loud graphic.",
    href: "/products/white-felix-tee",
    image: "/products/drop001/white/front.png",
  },
  {
    number: "03",
    title: "RED FELIX TEE",
    text: "Statement piece. Full takeover.",
    href: "/products/red-felix-tee",
    image: "/products/drop001/red/front.png",
  },
];

export default function Collections() {
  return (
    <section className="collections" id="collections">
      <div className="section-header">
        <span>COLLECTIONS</span>
        <h2>EXPLORE DROP 001</h2>
      </div>

      <div className="collection-grid">
        {collections.map((item) => (
          <Link className="collection-card" href={item.href} key={item.title}>
            <div className="collection-number">{item.number}</div>

            <div className="collection-image">
              <Image
                src={item.image}
                alt={item.title}
                width={900}
                height={900}
              />
            </div>

            <div className="collection-content">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span>VIEW PRODUCT</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}