"use client";

import { useMemo, useState } from "react";
import ProductCard from "../product/ProductCard";
import QuickViewModal from "./QuickViewModal";
import type { Product } from "../../types/product";

export default function ShopClient({ products }: { products: Product[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    let list = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "ALL" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") {
      list = [...list].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [products, search, category, sort]);

  return (
    <>
      <section className="shop-toolbar">
        <input
          type="text"
          placeholder="SEARCH PRODUCTS"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="toolbar-right">
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">FEATURED</option>
            <option value="price-low">PRICE ↑</option>
            <option value="price-high">PRICE ↓</option>
            <option value="name">A–Z</option>
          </select>

          <div>
            {["ALL", "SHIRTS", "HOODIES", "SHORTS"].map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? "active-filter" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="shop-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              product={product}
              key={product.slug}
              onQuickView={() => setQuickViewProduct(product)}
            />
          ))
        ) : (
          <p className="no-products">NO PRODUCTS FOUND</p>
        )}
      </section>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}