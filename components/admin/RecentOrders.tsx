import Link from "next/link";

import type { Order, OrderItem } from "../../app/generated/prisma/client";
import OrdersTable from "./OrdersTable";

type OrderWithItems = Order & {
  items: OrderItem[];
};

export default function RecentOrders({
  orders,
}: {
  orders: OrderWithItems[];
}) {
  return (
    <section className="admin-panel">
      <div className="admin-panel-heading">
        <div>
          <span>LIVE DATABASE</span>
          <h2>RECENT ORDERS</h2>
        </div>

        <Link href="/admin/orders">VIEW ALL</Link>
      </div>

      <OrdersTable orders={orders} compact />
    </section>
  );
}
