"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../../lib/prisma";

const allowedStatuses = [
  "PAID",
  "PACKING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type AllowedOrderStatus = (typeof allowedStatuses)[number];

function getOptionalString(
  formData: FormData,
  field: string
): string | null {
  const value = String(formData.get(field) ?? "").trim();
  return value.length > 0 ? value : null;
}

export async function updateOrderFulfillmentAction(
  orderId: string,
  formData: FormData
) {
  const normalizedOrderId = orderId.trim();

  if (!normalizedOrderId) {
    throw new Error("Order ID is required.");
  }

  const orderStatus = String(
    formData.get("orderStatus") ?? ""
  ).trim() as AllowedOrderStatus;

  if (!allowedStatuses.includes(orderStatus)) {
    throw new Error("Invalid order status.");
  }

  const shippingCarrier = getOptionalString(
    formData,
    "shippingCarrier"
  );

  const trackingNumber = getOptionalString(
    formData,
    "trackingNumber"
  );

  const currentOrder = await prisma.order.findUnique({
    where: {
      id: normalizedOrderId,
    },

    select: {
      id: true,
      packedAt: true,
      shippedAt: true,
      deliveredAt: true,
    },
  });

  if (!currentOrder) {
    throw new Error("Order not found.");
  }

  const now = new Date();

  await prisma.order.update({
    where: {
      id: normalizedOrderId,
    },

    data: {
      orderStatus,
      shippingCarrier,
      trackingNumber,

      packedAt:
        orderStatus === "PACKING" ||
        orderStatus === "SHIPPED" ||
        orderStatus === "DELIVERED"
          ? currentOrder.packedAt ?? now
          : null,

      shippedAt:
        orderStatus === "SHIPPED" ||
        orderStatus === "DELIVERED"
          ? currentOrder.shippedAt ?? now
          : null,

      deliveredAt:
        orderStatus === "DELIVERED"
          ? currentOrder.deliveredAt ?? now
          : null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${normalizedOrderId}`);
}