import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const seedProducts = [
  {
    slug: "black-felix-tee",
    name: "BLACK FELIX TEE",
    priceCents: 6000,
    category: "SHIRTS",
    tag: "DROP 001",
    color: "BLACK",
    primaryImage: "/products/drop001/black/front.png",
    description:
      "The black colorway from DROP 001 — LONG LIVE FELIX. Heavy streetwear energy with bold 803 graphics, red star details, and full back artwork.",
    featured: true,
    active: true,
    images: [
      "/products/drop001/black/front.png",
      "/products/drop001/black/back.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    slug: "white-felix-tee",
    name: "WHITE FELIX TEE",
    priceCents: 6000,
    category: "SHIRTS",
    tag: "DROP 001",
    color: "WHITE",
    primaryImage: "/products/drop001/white/front.png",
    description:
      "The white colorway from DROP 001 — LONG LIVE FELIX. Clean white tee with black and red graphics built around the 803 TAKEOVER identity.",
    featured: true,
    active: true,
    images: [
      "/products/drop001/white/front.png",
      "/products/drop001/white/back.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    slug: "red-felix-tee",
    name: "RED FELIX TEE",
    priceCents: 6000,
    category: "SHIRTS",
    tag: "DROP 001",
    color: "RED",
    primaryImage: "/products/drop001/red/front.png",
    description:
      "The red colorway from DROP 001 — LONG LIVE FELIX. Loud red base with white 803 graphics, black star details, and full cinematic back print.",
    featured: true,
    active: true,
    images: [
      "/products/drop001/red/front.png",
      "/products/drop001/red/back.png",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
];

async function main() {
  for (const product of seedProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },

      update: {
        name: product.name,
        priceCents: product.priceCents,
        category: product.category,
        tag: product.tag,
        color: product.color,
        primaryImage: product.primaryImage,
        description: product.description,
        featured: product.featured,
        active: product.active,

        images: {
          deleteMany: {},
          create: product.images.map((url, position) => ({
            url,
            position,
          })),
        },

        inventory: {
          deleteMany: {},
          create: product.sizes.map((size) => ({
            size,
            quantity: 0,
          })),
        },
      },

      create: {
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        category: product.category,
        tag: product.tag,
        color: product.color,
        primaryImage: product.primaryImage,
        description: product.description,
        featured: product.featured,
        active: product.active,

        images: {
          create: product.images.map((url, position) => ({
            url,
            position,
          })),
        },

        inventory: {
          create: product.sizes.map((size) => ({
            size,
            quantity: 0,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Product seed completed.");
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
