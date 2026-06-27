import { products } from "../../data/products";
import ShopClient from "components/shop/ShopClient";

export default function ShopPage() {
  return (
    <main className="shop-page">
      <section className="shop-hero">
        <span>DROP 001</span>
        <h1>SHOP THE DROP</h1>
        <p>LONG LIVE FELIX — LIMITED FIRST RELEASE</p>
      </section>

      <ShopClient products={products} />
    </main>
  );
}