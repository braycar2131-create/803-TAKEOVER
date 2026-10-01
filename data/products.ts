import type { Product } from "../types/product";

const createInventory = () => [
  {
    size: "S",
    quantity: 10,
  },
  {
    size: "M",
    quantity: 10,
  },
  {
    size: "L",
    quantity: 10,
  },
  {
    size: "XL",
    quantity: 10,
  },
  {
    size: "XXL",
    quantity: 10,
  },
];

export const products: Product[] = [
  {
    id: 1,
    slug: "black-felix-tee",
    name: "BLACK FELIX TEE",

    price: 60,
    displayPrice: "$60",

    category: "SHIRTS",
    tag: "LONG LIVE FELIX COLLECTIVE",
    color: "BLACK",

    image: "/products/drop001/black/front.png",

    images: [
      "/products/drop001/black/front.png",
      "/products/drop001/black/back.png",
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],

    inventory: createInventory(),

    description:
      "The black colorway from the LONG LIVE FELIX COLLECTIVE. Heavy streetwear energy with bold 803 graphics, red star details, and full back artwork.",

    featured: true,
    active: true,
  },

  {
    id: 2,
    slug: "white-felix-tee",
    name: "WHITE FELIX TEE",

    price: 60,
    displayPrice: "$60",

    category: "SHIRTS",
    tag: "LONG LIVE FELIX COLLECTIVE",
    color: "WHITE",

    image: "/products/drop001/white/front.png",

    images: [
      "/products/drop001/white/front.png",
      "/products/drop001/white/back.png",
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],

    inventory: createInventory(),

    description:
      "The white colorway from the LONG LIVE FELIX COLLECTIVE. Clean white tee with black and red graphics built around the 803 TAKEOVER identity.",

    featured: true,
    active: true,
  },

  {
    id: 3,
    slug: "red-felix-tee",
    name: "RED FELIX TEE",

    price: 60,
    displayPrice: "$60",

    category: "SHIRTS",
    tag: "LONG LIVE FELIX COLLECTIVE",
    color: "RED",

    image: "/products/drop001/red/front.png",

    images: [
      "/products/drop001/red/front.png",
      "/products/drop001/red/back.png",
    ],

    sizes: ["S", "M", "L", "XL", "XXL"],

    inventory: createInventory(),

    description:
      "The red colorway from the LONG LIVE FELIX COLLECTIVE. Loud red base with white 803 graphics, black star details, and full cinematic back print.",

    featured: true,
    active: true,
  },
];