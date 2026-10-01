"use client";

import { useMemo, useState } from "react";
import ProductCard from "../product/ProductCard";
import QuickViewModal from "./QuickViewModal";
import type { Product } from "../../types/product";

type ShopClientProps = {
  products: Product[];
};

const categories = ["ALL", "SHIRTS", "HOODIES", "SHORTS"];

export default function ShopClient({ products }: ShopClientProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [sort, setSort] = useState("featured");
  const [quickViewProduct, setQuickViewProduct] =
    useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    let list = products.filter((product) => {
      const matchesSearch =
        searchValue.length === 0 ||
        product.name.toLowerCase().includes(searchValue) ||
        product.color.toLowerCase().includes(searchValue) ||
        product.category.toLowerCase().includes(searchValue);

      const matchesCategory =
        category === "ALL" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    switch (sort) {
      case "price-low":
        list = [...list].sort((a, b) => a.price - b.price);
        break;

      case "price-high":
        list = [...list].sort((a, b) => b.price - a.price);
        break;

      case "name":
        list = [...list].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      default:
        list = [...list].sort(
          (a, b) => Number(b.featured) - Number(a.featured)
        );
    }

    return list;
  }, [products, search, category, sort]);

  function clearFilters() {
    setSearch("");
    setCategory("ALL");
    setSort("featured");
  }

  return (
    <>
      <section className="shop-catalog">
        <div className="shop-catalog-heading">
          <div>
            <span>THE COLLECTION</span>
            <h2>SHOP THE COLLECTIVE</h2>
          </div>

          <div className="shop-catalog-stats">
            <div>
              <strong>{filteredProducts.length}</strong>
              <span>PRODUCTS</span>
            </div>

            <div>
              <strong>LLF</strong>
              <span>LIMITED COLLECTIVE</span>
            </div>
          </div>
        </div>

        <div className="shop-toolbar">
          <label className="shop-search">
            <span>SEARCH</span>

            <input
              type="search"
              placeholder="SEARCH NAME, COLOR OR CATEGORY"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="shop-sort">
            <label htmlFor="shop-sort-select">SORT BY</label>

            <select
              id="shop-sort-select"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="featured">FEATURED</option>
              <option value="price-low">PRICE: LOW TO HIGH</option>
              <option value="price-high">PRICE: HIGH TO LOW</option>
              <option value="name">NAME: A–Z</option>
            </select>
          </div>
        </div>

        <div className="shop-category-row">
          <div className="shop-category-buttons">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={
                  category === item
                    ? "shop-category-button active-filter"
                    : "shop-category-button"
                }
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {(search || category !== "ALL" || sort !== "featured") && (
            <button
              type="button"
              className="clear-filters-button"
              onClick={clearFilters}
            >
              CLEAR FILTERS
            </button>
          )}
        </div>

        <div className="shop-results-line">
          <span>
            SHOWING {filteredProducts.length} OF {products.length}
          </span>

          <span>803 TAKEOVER — LONG LIVE FELIX COLLECTIVE</span>
        </div>

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
            <div className="no-products">
              <span>NO MATCHES</span>
              <h3>NO PRODUCTS FOUND</h3>

              <button type="button" onClick={clearFilters}>
                RESET FILTERS
              </button>
            </div>
          )}
        </section>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}