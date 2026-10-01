import { prisma } from "../../../lib/prisma";
import { formatAdminDate, formatMoney } from "../../../lib/admin";

export const dynamic = "force-dynamic";

type CustomerSummary = {
  email: string;
  name: string;
  phone: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: Date;
};

export default async function AdminCustomersPage() {
  const orders = await prisma.order.findMany({
    where: {
      customerEmail: {
        not: null,
      },
    },
    select: {
      customerEmail: true,
      customerName: true,
      shippingName: true,
      customerPhone: true,
      amountTotal: true,
      currency: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const customerMap = new Map<string, CustomerSummary>();

  for (const order of orders) {
    const email = order.customerEmail?.trim().toLowerCase();

    if (!email) continue;

    const existing = customerMap.get(email);

    if (existing) {
      existing.orderCount += 1;
      existing.totalSpent += order.amountTotal;

      if (order.createdAt > existing.lastOrderAt) {
        existing.lastOrderAt = order.createdAt;
        existing.name =
          order.customerName ||
          order.shippingName ||
          existing.name;
        existing.phone =
          order.customerPhone ||
          existing.phone;
      }

      continue;
    }

    customerMap.set(email, {
      email,
      name:
        order.customerName ||
        order.shippingName ||
        "Unknown customer",
      phone:
        order.customerPhone ||
        "Not provided",
      orderCount: 1,
      totalSpent: order.amountTotal,
      lastOrderAt: order.createdAt,
    });
  }

  const customers = Array.from(customerMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>CUSTOMER DATABASE</span>
          <h1>CUSTOMERS</h1>
          <p>
            Every customer with a completed Stripe order appears here.
          </p>
        </div>

        <strong>{customers.length} CUSTOMERS</strong>
      </section>

      <section className="admin-panel">
        {customers.length === 0 ? (
          <div className="admin-empty-state">
            <span>NO DATA</span>
            <h3>NO CUSTOMERS YET</h3>
            <p>
              Customer records will appear after completed orders are saved.
            </p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>CUSTOMER</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>ORDERS</th>
                  <th>TOTAL SPENT</th>
                  <th>LAST ORDER</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.email}>
                    <td>
                      <strong>{customer.name}</strong>
                    </td>

                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td>{customer.orderCount}</td>
                    <td>{formatMoney(customer.totalSpent)}</td>
                    <td>{formatAdminDate(customer.lastOrderAt)}</td>
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
