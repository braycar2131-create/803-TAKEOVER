import Link from "next/link";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export default async function AdminCustomersPage() {
  const orders = await prisma.order.findMany({
    where: {
      customerEmail: {
        not: null,
      },

      paymentStatus: "paid",
    },

    select: {
      id: true,
      customerEmail: true,
      customerName: true,
      customerPhone: true,
      amountTotal: true,
      createdAt: true,
      items: {
        select: {
          size: true,
          quantity: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const customerMap = new Map<
    string,
    {
      email: string;
      name: string | null;
      phone: string | null;
      orders: number;
      totalSpent: number;
      lastOrder: Date;
      sizes: Map<string, number>;
    }
  >();

  for (const order of orders) {
    if (!order.customerEmail) continue;

    const email = order.customerEmail.toLowerCase();

    const existing = customerMap.get(email) ?? {
      email,
      name: order.customerName,
      phone: order.customerPhone,
      orders: 0,
      totalSpent: 0,
      lastOrder: order.createdAt,
      sizes: new Map<string, number>(),
    };

    existing.orders += 1;
    existing.totalSpent += order.amountTotal;

    if (order.createdAt > existing.lastOrder) {
      existing.lastOrder = order.createdAt;
      existing.name = order.customerName;
      existing.phone = order.customerPhone;
    }

    for (const item of order.items) {
      existing.sizes.set(
        item.size,
        (existing.sizes.get(item.size) ?? 0) + item.quantity
      );
    }

    customerMap.set(email, existing);
  }

  const customers = Array.from(customerMap.values())
    .map((customer) => {
      const favoriteSize =
        Array.from(customer.sizes.entries()).sort(
          (a, b) => b[1] - a[1]
        )[0]?.[0] ?? "—";

      return {
        ...customer,
        favoriteSize,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>CUSTOMER DATABASE</span>
          <h1>CUSTOMERS</h1>

          <p>
            Review customer spending, order frequency, contact
            information, and preferred sizes.
          </p>
        </div>

        <strong>{customers.length} CUSTOMERS</strong>
      </section>

      <section className="admin-panel">
        {customers.length === 0 ? (
          <div className="admin-empty-state">
            <span>NO CUSTOMERS</span>
            <h3>NO CUSTOMER DATA YET</h3>
            <p>Paid orders will automatically appear here.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>PHONE</th>
                  <th>ORDERS</th>
                  <th>LIFETIME SPEND</th>
                  <th>FAVORITE SIZE</th>
                  <th>LAST ORDER</th>
                  <th />
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.email}>
                    <td>
                      <strong>
                        {customer.name || "CUSTOMER"}
                      </strong>

                      <small>{customer.email}</small>
                    </td>

                    <td>{customer.phone || "—"}</td>
                    <td>{customer.orders}</td>
                    <td>{formatMoney(customer.totalSpent)}</td>
                    <td>{customer.favoriteSize}</td>

                    <td>
                      {customer.lastOrder.toLocaleDateString()}
                    </td>

                    <td>
                      <Link
                        className="admin-table-link"
                        href={`/admin/orders?q=${encodeURIComponent(
                          customer.email
                        )}`}
                      >
                        ORDERS
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}