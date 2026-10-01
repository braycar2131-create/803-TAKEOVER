import Stripe from "stripe";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutItem = {
  slug: string;
  size: string;
  quantity: number;
};

type CheckoutRequestBody = {
  items?: CheckoutItem[];
  email?: string;
};

function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is missing.");
  }

  return new Stripe(secretKey);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequestBody;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const normalizedItems = body.items.map((item) => ({
      slug: item.slug,
      size: item.size,
      quantity: Math.max(
        1,
        Math.min(10, Math.floor(item.quantity))
      ),
    }));

    const slugs = [
      ...new Set(normalizedItems.map((item) => item.slug)),
    ];

    const databaseProducts = await prisma.product.findMany({
      where: {
        slug: {
          in: slugs,
        },
        active: true,
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

    const validatedItems = normalizedItems.map((item) => {
      const product = productMap.get(item.slug);

      if (!product) {
        throw new Error(
          `Product is unavailable: ${item.slug}`
        );
      }

      const inventory = product.inventory.find(
        (entry) => entry.size === item.size
      );

      if (!inventory) {
        throw new Error(
          `Invalid size for ${product.name}: ${item.size}`
        );
      }

      if (inventory.quantity < item.quantity) {
        throw new Error(
          `${product.name} in size ${item.size} only has ${inventory.quantity} left.`
        );
      }

      return {
        product,
        size: item.size,
        quantity: item.quantity,
      };
    });

    const compactCart = validatedItems.map(
      ({ product, size, quantity }) => ({
        slug: product.slug,
        size,
        quantity,
      })
    );

    const cartMetadata = JSON.stringify(compactCart);

    if (cartMetadata.length > 500) {
      throw new Error(
        "The cart contains too many separate items."
      );
    }

    const requestUrl = new URL(request.url);

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      requestUrl.origin;

    const session =
      await getStripe().checkout.sessions.create({
        mode: "payment",

        line_items: validatedItems.map(
          ({ product, size, quantity }) => ({
            quantity,

            price_data: {
              currency: "usd",
              unit_amount: product.priceCents,

              product_data: {
                name: product.name,
                description: `${product.color} / Size ${size}`,

                metadata: {
                  slug: product.slug,
                  size,
                },
              },
            },
          })
        ),

        success_url:
          `${siteUrl}/order-confirmation` +
          "?session_id={CHECKOUT_SESSION_ID}",

        cancel_url: `${siteUrl}/checkout?canceled=true`,

        customer_email:
          body.email?.trim() || undefined,

        customer_creation: "always",

        billing_address_collection: "required",

       shipping_address_collection: {
  allowed_countries: ["US"],
},
shipping_options: [
  {
    shipping_rate_data: {
      type: "fixed_amount",
      fixed_amount: {
        amount: 1000,
        currency: "usd",
      },
      display_name: "Standard Shipping",
    },
  },
],
phone_number_collection: {
  enabled: true,
},

        allow_promotion_codes: true,

        metadata: {
          source: "803-takeover-website",
          catalog: "database",
          cart: cartMetadata,
        },
      });

    if (!session.url) {
      throw new Error(
        "Stripe did not return a checkout URL."
      );
    }

    console.log("CHECKOUT SESSION CREATED:", {
      sessionId: session.id,
      cart: compactCart,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("CHECKOUT CREATION FAILED:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to start checkout.",
      },
      { status: 500 }
    );
  }
}