import { prisma } from "./prisma";

export type AdminOrderStatus =
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export function formatMoney(
  amountInCents: number,
  currency = "usd"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100);
}

export function formatAdminDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function shortOrderId(id: string): string {
  return id.length > 12 ? `${id.slice(0, 12)}…` : id;
}

export async function getAdminDashboardData() {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalRevenueResult,
    todayRevenueResult,
    monthRevenueResult,
    totalOrders,
    paidOrders,
    uniqueCustomers,
    recentOrders,
    bestSellerRows,
  ] = await Promise.all([
    prisma.order.aggregate({
      _sum: { amountTotal: true },
      where: { paymentStatus: "paid" },
    }),
    prisma.order.aggregate({
      _sum: { amountTotal: true },
      where: {
        paymentStatus: "paid",
        createdAt: { gte: startOfToday },
      },
    }),
    prisma.order.aggregate({
      _sum: { amountTotal: true },
      where: {
        paymentStatus: "paid",
        createdAt: { gte: startOfMonth },
      },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "paid" } }),
    prisma.order.groupBy({
      by: ["customerEmail"],
      where: { customerEmail: { not: null } },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true },
    }),
    prisma.orderItem.groupBy({
      by: ["productSlug", "productName"],
      _sum: {
        quantity: true,
        lineTotal: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    }),
  ]);

  const totalRevenue = totalRevenueResult._sum.amountTotal ?? 0;
  const averageOrderValue =
    paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0;

  return {
    totalRevenue,
    todayRevenue: todayRevenueResult._sum.amountTotal ?? 0,
    monthRevenue: monthRevenueResult._sum.amountTotal ?? 0,
    totalOrders,
    paidOrders,
    customerCount: uniqueCustomers.length,
    averageOrderValue,
    recentOrders,
    bestSellers: bestSellerRows.map((row) => ({
      productSlug: row.productSlug,
      productName: row.productName,
      quantity: row._sum.quantity ?? 0,
      revenue: row._sum.lineTotal ?? 0,
    })),
  };
}

export async function getOrders(search?: string) {
  const normalizedSearch = search?.trim();

  return prisma.order.findMany({
    where: normalizedSearch
      ? {
          OR: [
            {
              id: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              customerEmail: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              customerName: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
            {
              stripeSessionId: {
                contains: normalizedSearch,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function getRevenueByDay(days = 14) {
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  start.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      paymentStatus: "paid",
      createdAt: {
        gte: start,
      },
    },
    select: {
      amountTotal: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const daily = new Map<
    string,
    { label: string; amount: number; orders: number }
  >();

  for (let index = 0; index < days; index += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + index);

    const key = date.toISOString().slice(0, 10);

    daily.set(key, {
      label: new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
      }).format(date),
      amount: 0,
      orders: 0,
    });
  }

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    const current = daily.get(key);

    if (current) {
      current.amount += order.amountTotal;
      current.orders += 1;
    }
  }

  return Array.from(daily.values());
}
