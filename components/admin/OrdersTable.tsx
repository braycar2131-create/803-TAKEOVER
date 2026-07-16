import Link from "next/link";
import type { Order, OrderItem } from "../../app/generated/prisma/client";
import {
  formatAdminDate,
  formatMoney,
  shortOrderId,
} from "../../lib/admin";

type OrderWithItems = Order & {
  items: OrderItem[];
};

export default function OrdersTable({
  orders,
  compact = false,
}: {
  orders: OrderWithItems[];
  compact?: boolean;
}) {
  if (orders.length === 0) {
    return (
      <div className="admin-empty-state">
        <span>NO DATA</span>
        <h3>NO ORDERS FOUND</h3>
        <p>Completed Stripe orders will appear here automatically.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>ORDER</th>
            <th>CUSTOMER</th>
            <th>ITEMS</th>
            <th>TOTAL</th>
            <th>STATUS</th>
            {!compact ? <th>DATE</th> : null}
            <th />
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const quantity = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0
            );

            return (
              <tr key={order.id}>
                <td>
                  <strong>{shortOrderId(order.id)}</strong>
                  <small>{order.stripeSessionId.slice(0, 18)}…</small>
                </td>

                <td>
                  <strong>
                    {order.customerName ||
                      order.shippingName ||
                      "Unknown customer"}
                  </strong>
                  <small>{order.customerEmail || "No email"}</small>
                </td>

                <td>{quantity}</td>

                <td>
                  {formatMoney(order.amountTotal, order.currency)}
                </td>

                <td>
                  <span
                    className={`admin-status admin-status--${order.orderStatus.toLowerCase()}`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                {!compact ? (
                  <td>{formatAdminDate(order.createdAt)}</td>
                ) : null}

                <td>
                  <Link
                    className="admin-table-link"
                    href={`/admin/orders/${order.id}`}
                  >
                    VIEW
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
