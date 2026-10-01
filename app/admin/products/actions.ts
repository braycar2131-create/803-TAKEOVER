"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";

function requiredString(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();

  if (!value) {
    throw new Error(`${key} is required.`);
  }

  return value;
}

function parsePriceCents(value: FormDataEntryValue | null) {
  const price = Number(value);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a valid positive number.");
  }

  return Math.round(price * 100);
}

function parseLines(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseInventory(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((entry) => {
      const [sizePart, quantityPart] = entry.split(":");
      const size = sizePart?.trim().toUpperCase();
      const quantity = Number(quantityPart ?? 0);

      if (!size) {
        throw new Error(`Invalid inventory entry: ${entry}`);
      }

      if (!Number.isInteger(quantity) || quantity < 0) {
        throw new Error(`Invalid inventory quantity for ${size}.`);
      }

      return { size, quantity };
    });
}

function productPayload(formData: FormData) {
  const images = parseLines(formData.get("images"));
  const inventory = parseInventory(formData.get("inventory"));
  const primaryImage = requiredString(formData, "primaryImage");

  return {
    slug: requiredString(formData, "slug").toLowerCase(),
    name: requiredString(formData, "name").toUpperCase(),
    priceCents: parsePriceCents(formData.get("price")),
    category: requiredString(formData, "category").toUpperCase(),
    tag: requiredString(formData, "tag").toUpperCase(),
    color: requiredString(formData, "color").toUpperCase(),
    primaryImage,
    description: requiredString(formData, "description"),
    featured: formData.get("featured") === "on",
    active: formData.get("active") === "on",
    images: images.length > 0 ? images : [primaryImage],
    inventory,
  };
}

export async function createProductAction(formData: FormData) {
  const payload = productPayload(formData);

  await prisma.product.create({
    data: {
      slug: payload.slug,
      name: payload.name,
      priceCents: payload.priceCents,
      category: payload.category,
      tag: payload.tag,
      color: payload.color,
      primaryImage: payload.primaryImage,
      description: payload.description,
      featured: payload.featured,
      active: payload.active,

      images: {
        create: payload.images.map((url, position) => ({
          url,
          position,
        })),
      },

      inventory: {
        create: payload.inventory,
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  redirect(`/admin/products/${payload.slug}`);
}

export async function updateProductAction(
  slug: string,
  formData: FormData
) {
  const payload = productPayload(formData);

  await prisma.product.update({
    where: { slug },

    data: {
      slug: payload.slug,
      name: payload.name,
      priceCents: payload.priceCents,
      category: payload.category,
      tag: payload.tag,
      color: payload.color,
      primaryImage: payload.primaryImage,
      description: payload.description,
      featured: payload.featured,
      active: payload.active,

      images: {
        deleteMany: {},
        create: payload.images.map((url, position) => ({
          url,
          position,
        })),
      },

      inventory: {
        deleteMany: {},
        create: payload.inventory,
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  revalidatePath(`/shop/${payload.slug}`);
  redirect(`/admin/products/${payload.slug}`);
}

export async function deleteProductAction(
  slug: string,
  formData: FormData
) {
  void formData;
  await prisma.product.delete({
    where: { slug },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/inventory");
  revalidatePath("/shop");
  redirect("/admin/products");
}

export async function updateInventoryAction(formData: FormData) {
  const productId = Number(formData.get("productId"));
  const size = requiredString(formData, "size").toUpperCase();
  const quantity = Number(formData.get("quantity"));

  if (!Number.isInteger(productId) || productId <= 0) {
    throw new Error("Invalid product.");
  }

  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new Error("Quantity must be zero or greater.");
  }

  await prisma.productInventory.upsert({
    where: {
      productId_size: {
        productId,
        size,
      },
    },

    update: {
      quantity,
    },

    create: {
      productId,
      size,
      quantity,
    },
  });

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
}
