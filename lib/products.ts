import { prisma } from "./prisma";
import type { Product as StoreProduct } from "../types/product";

export async function getDatabaseProducts(options?: {
  includeInactive?: boolean;
  featuredOnly?: boolean;
}) {
  return prisma.product.findMany({
    where: {
      active: options?.includeInactive ? undefined : true,
      featured: options?.featuredOnly ? true : undefined,
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

export async function getDatabaseProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
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

export function toStoreProduct(
  product: Awaited<ReturnType<typeof getDatabaseProducts>>[number]
): StoreProduct {
  const inventory = product.inventory.map((item) => ({
    size: item.size,
    quantity: item.quantity,
  }));

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.priceCents / 100,
    displayPrice: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(product.priceCents / 100),
    category: product.category,
    tag: product.tag,
    color: product.color,
    image: product.primaryImage,
    images:
      product.images.length > 0
        ? product.images.map((image) => image.url)
        : [product.primaryImage],
    sizes: inventory.map((item) => item.size),
    inventory,
    description: product.description,
    featured: product.featured,
    active: product.active,
  };
}

export async function getStoreProducts(options?: {
  featuredOnly?: boolean;
}) {
  const products = await getDatabaseProducts(options);
  return products.map(toStoreProduct);
}

export async function getStoreProductBySlug(slug: string) {
  const product = await getDatabaseProductBySlug(slug);
  return product ? toStoreProduct(product) : null;
}
