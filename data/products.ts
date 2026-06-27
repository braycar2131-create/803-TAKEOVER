import type { Product } from "../types/product";

export const products: Product[] = [
  {
    id: 1,
    slug: "black-felix-tee",
    name: "BLACK FELIX TEE",
    price: 60,
    displayPrice: "$60",
    category: "SHIRTS",
    tag: "DROP 001",
    color: "BLACK",
    image: "/products/drop001/black/front.png",
    images: ["/products/drop001/black/front.png", "/products/drop001/black/back.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The black colorway from DROP 001 — LONG LIVE FELIX. Heavy streetwear energy with bold 803 graphics, red star details, and full back artwork.",
    featured: true,
  },
  {
    id: 2,
    slug: "white-felix-tee",
    name: "WHITE FELIX TEE",
    price: 60,
    displayPrice: "$60",
    category: "SHIRTS",
    tag: "DROP 001",
    color: "WHITE",
    image: "/products/drop001/white/front.png",
    images: ["/products/drop001/white/front.png", "/products/drop001/white/back.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The white colorway from DROP 001 — LONG LIVE FELIX. Clean white tee with black and red graphics built around the 803 TAKEOVER identity.",
    featured: true,
  },
  {
    id: 3,
    slug: "red-felix-tee",
    name: "RED FELIX TEE",
    price: 60,
    displayPrice: "$60",
    category: "SHIRTS",
    tag: "DROP 001",
    color: "RED",
    image: "/products/drop001/red/front.png",
    images: ["/products/drop001/red/front.png", "/products/drop001/red/back.png"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description:
      "The red colorway from DROP 001 — LONG LIVE FELIX. Loud red base with white 803 graphics, black star details, and full cinematic back print.",
    featured: true,
  },
];
