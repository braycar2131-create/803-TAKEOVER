import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CartMetadataItem = {
  slug: string;
  size: string;
  quantity: number;
};

function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing.");
  }

  return new Stripe(secretKey);
}

function parseCartMetadata(
  value: string | undefined
): CartMetadataItem[] {
  if (!value) {
    throw new Error(
      "The Checkout Session is missing cart metadata."
    );
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(value);
  } catch {
    throw new Error(
      "The Checkout Session cart metadata is invalid."
    );
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error(
      "The Checkout Session cart metadata is empty."
    );
  }

  return parsed.map((item, index) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("slug" in item) ||
      !("size" in item) ||
      !("quantity" in item) ||
      typeof item.slug !== "string" ||
      typeof item.size !== "string" ||
      typeof item.quantity !== "number"
    ) {
      throw new Error(
        `Invalid cart item at position ${index}.`
      );
    }

    return {
      slug: item.slug,
      size: item.size,
      quantity: Math.max(
        1,
        Math.min(10, Math.floor(item.quantity))
      ),
    };
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/stripe/webhook",
    message: "Stripe webhook route is active.",
  });
}

export async function POST(request: Request) {
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "WEBHOOK ERROR: STRIPE_WEBHOOK_SECRET is missing."
    );

    return NextResponse.json(
      {
        error: "STRIPE_WEBHOOK_SECRET is missing.",
      },
      { status: 500 }
    );
  }

  const signature =
    request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        error: "Stripe signature is missing.",
      },
      { status: 400 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "WEBHOOK SIGNATURE FAILED:",
      error
    );

    return NextResponse.json(
      {
        error: "Invalid webhook signature.",
      },
      { status: 400 }
    );
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({
      received: true,
      ignoredEvent: event.type,
    });
  }

  try {
    const session =
      event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({
        received: true,
        saved: false,
        paymentStatus: session.payment_status,
      });
    }

    /*
     * Prevent Stripe retries from creating another order
     * or reducing inventory more than once.
     */
    const existingOrder =
      await prisma.order.findUnique({
        where: {
          stripeSessionId: session.id,
        },
        select: {
          id: true,
        },
      });

    if (existingOrder) {
      return NextResponse.json({
        received: true,
        saved: true,
        duplicate: true,
        orderId: existingOrder.id,
      });
    }

    const cartItems = parseCartMetadata(
      session.metadata?.cart
    );

    /*
     * Load each product together with its size inventory.
     */
    const databaseProducts =
      await prisma.product.findMany({
        where: {
          slug: {
            in: cartItems.map(
              (item) => item.slug
            ),
          },
        },
        include: {
          inventory: true,
        },
      });

    const productMap = new Map(
      databaseProducts.map((product) => [
        product.slug,
        product,
      ])
    );

    const preparedItems = cartItems.map(
      (cartItem) => {
        const product = productMap.get(
          cartItem.slug
        );

        if (!product) {
          throw new Error(
            `Product not found in Prisma: ${cartItem.slug}`
          );
        }

        const inventory =
          product.inventory.find(
            (entry) =>
              entry.size.trim().toUpperCase() ===
              cartItem.size.trim().toUpperCase()
          );

        if (!inventory) {
          throw new Error(
            `Inventory record not found for ${product.name}, size ${cartItem.size}.`
          );
        }

        if (
          inventory.quantity <
          cartItem.quantity
        ) {
          throw new Error(
            `Not enough inventory for ${product.name}, size ${cartItem.size}.`
          );
        }

        return {
          product,
          inventory,
          quantity: cartItem.quantity,

          orderItem: {
            productSlug: product.slug,
            productName: product.name,
            size: inventory.size,
            quantity: cartItem.quantity,
            unitAmount: product.priceCents,
            lineTotal:
              product.priceCents *
              cartItem.quantity,
          },
        };
      }
    );

    const expectedSubtotal =
      preparedItems.reduce(
        (total, item) =>
          total + item.orderItem.lineTotal,
        0
      );

    const stripeSubtotal =
      session.amount_subtotal ?? 0;

    if (stripeSubtotal !== expectedSubtotal) {
      throw new Error(
        `Order subtotal mismatch. Stripe: ${stripeSubtotal}; database: ${expectedSubtotal}.`
      );
    }

    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const shipping =
      session.collected_information
        ?.shipping_details ?? null;

    /*
     * Inventory reduction and order creation happen in
     * the same transaction.
     *
     * If either operation fails, both are rolled back.
     */
    const order = await prisma.$transaction(
      async (transaction) => {
        for (const item of preparedItems) {
          const inventoryUpdate =
            await transaction.productInventory.updateMany(
              {
                where: {
                  id: item.inventory.id,

                  quantity: {
                    gte: item.quantity,
                  },
                },

                data: {
                  quantity: {
                    decrement: item.quantity,
                  },
                },
              }
            );

          if (inventoryUpdate.count !== 1) {
            throw new Error(
              `Inventory changed before the order completed for ${item.product.name}, size ${item.inventory.size}.`
            );
          }
        }

        return transaction.order.create({
          data: {
            stripeSessionId: session.id,

            stripePaymentIntentId:
              paymentIntentId,

            customerEmail:
              session.customer_details?.email ??
              session.customer_email ??
              null,

            customerName:
              session.customer_details?.name ??
              shipping?.name ??
              null,

            customerPhone:
              session.customer_details?.phone ??
              null,

            amountSubtotal: stripeSubtotal,

            amountTotal:
              session.amount_total ??
              stripeSubtotal,

            currency:
              session.currency ?? "usd",

            paymentStatus:
              session.payment_status,

            orderStatus: "PAID",

            shippingName:
              shipping?.name ?? null,

            shippingLine1:
              shipping?.address?.line1 ?? null,

            shippingLine2:
              shipping?.address?.line2 ?? null,

            shippingCity:
              shipping?.address?.city ?? null,

            shippingState:
              shipping?.address?.state ?? null,

            shippingPostalCode:
              shipping?.address?.postal_code ??
              null,

            shippingCountry:
              shipping?.address?.country ?? null,

            items: {
              create: preparedItems.map(
                (item) => item.orderItem
              ),
            },
          },

          include: {
            items: true,
          },
        });
      }
    );

    console.log(
      "ORDER SAVED AND INVENTORY REDUCED:",
      {
        orderId: order.id,
        sessionId: session.id,
        items: preparedItems.map((item) => ({
          slug: item.product.slug,
          size: item.inventory.size,
          quantityReduced: item.quantity,
        })),
      }
    );

    return NextResponse.json({
      received: true,
      saved: true,
      inventoryReduced: true,
      orderId: order.id,
    });
  } catch (error) {
    console.error(
      "ORDER OR INVENTORY UPDATE FAILED:",
      error
    );

    return NextResponse.json(
      {
        received: true,
        saved: false,
        inventoryReduced: false,

        error:
          error instanceof Error
            ? error.message
            : "The order could not be processed.",
      },
      { status: 500 }
    );
  }
}