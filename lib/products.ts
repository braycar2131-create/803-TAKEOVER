import "server-only";

import { prisma } from "./prisma";

import type {
  Product as StoreProduct,
  ProductCategory,
  ProductColor,
  ProductInventoryItem,
} from "../types/product";

function normalizeCategory(
  value: string
): ProductCategory {
  const normalized = value.trim().toUpperCase();

  switch (normalized) {
    case "HOODIES":
      return "HOODIES";

    case "SHORTS":
      return "SHORTS";

    case "SHIRTS":
      return "SHIRTS";

    default:
      console.warn(
        `Unknown product category "${value}". Falling back to SHIRTS.`
      );

      return "SHIRTS";
  }
}

function normalizeColor(
  value: string
): ProductColor {
  const normalized = value.trim().toUpperCase();

  switch (normalized) {
    case "WHITE":
      return "WHITE";

    case "RED":
      return "RED";

    case "BLACK":
      return "BLACK";

    default:
      console.warn(
        `Unknown product color "${value}". Falling back to BLACK.`
      );

      return "BLACK";
  }
}

export async function getDatabaseProducts(options?: {
  includeInactive?: boolean;
  featuredOnly?: boolean;
}) {
  return prisma.product.findMany({
    where: {
      active: options?.includeInactive
        ? undefined
        : true,

      featured: options?.featuredOnly
        ? true
        : undefined,
    },

    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },

      inventory: {
        orderBy: {
          size: "asc",
        },
      },
    },

    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getDatabaseProductBySlug(
  slug: string
) {
  return prisma.product.findUnique({
    where: {
      slug,
    },

    include: {
      images: {
        orderBy: {
          position: "asc",
        },
      },

      inventory: {
        orderBy: {
          size: "asc",
        },
      },
    },
  });
}

type DatabaseProduct = NonNullable<
  Awaited<ReturnType<typeof getDatabaseProductBySlug>>
>;

export function toStoreProduct(
  product: DatabaseProduct
): StoreProduct {
  const price = product.priceCents / 100;

  const images =
    product.images.length > 0
      ? product.images.map((image) => image.url)
      : [product.primaryImage];

  const inventory: ProductInventoryItem[] =
    product.inventory.map((item) => ({
      size: item.size,
      quantity: item.quantity,
    }));

  const sizes = inventory.map((item) => item.size);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,

    price,

    displayPrice: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price),

    category: normalizeCategory(product.category),
    tag: product.tag,
    color: normalizeColor(product.color),

    image: product.primaryImage,
    images,

    sizes,
    inventory,

    description: product.description,

    featured: product.featured,
    active: product.active,
  };
}

export async function getStoreProducts(options?: {
  includeInactive?: boolean;
  featuredOnly?: boolean;
}): Promise<StoreProduct[]> {
  const products = await getDatabaseProducts(options);

  return products.map(toStoreProduct);
}

export async function getStoreProductBySlug(
  slug: string
): Promise<StoreProduct | null> {
  const product = await getDatabaseProductBySlug(slug);

  return product
    ? toStoreProduct(product)
    : null;
}