import Link from "next/link";

import DashboardCards from "../../components/admin/DashboardCards";
import RecentOrders from "../../components/admin/RecentOrders";
import RevenueChart from "../../components/admin/RevenueChart";
import {
  formatMoney,
  getAdminDashboardData,
  getRevenueByDay,
} from "../../lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [dashboard, revenuePoints] = await Promise.all([
    getAdminDashboardData(),
    getRevenueByDay(14),
  ]);

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>OVERVIEW</span>
          <h1>COMMAND CENTER</h1>
          <p>
            Live sales, customers, and order activity from your Supabase
            database.
          </p>
        </div>

        <Link href="/admin/orders">MANAGE ORDERS</Link>
      </section>

      <DashboardCards
        todayRevenue={dashboard.todayRevenue}
        monthRevenue={dashboard.monthRevenue}
        totalRevenue={dashboard.totalRevenue}
        totalOrders={dashboard.totalOrders}
        customerCount={dashboard.customerCount}
        averageOrderValue={dashboard.averageOrderValue}
      />

      <div className="admin-dashboard-grid">
        <RevenueChart points={revenuePoints} />

        <section className="admin-panel admin-best-sellers">
          <div className="admin-panel-heading">
            <div>
              <span>PRODUCT PERFORMANCE</span>
              <h2>BEST SELLERS</h2>
            </div>
          </div>

          {dashboard.bestSellers.length > 0 ? (
            <div className="admin-best-seller-list">
              {dashboard.bestSellers.map((product, index) => (
                <article key={product.productSlug}>
                  <span>{String(index + 1).padStart(2, "0")}</span>

                  <div>
                    <strong>{product.productName}</strong>
                    <small>{product.quantity} UNITS SOLD</small>
                  </div>

                  <b>{formatMoney(product.revenue)}</b>
                </article>
              ))}
            </div>
          ) : (
            <div className="admin-empty-mini">
              Product sales will appear after paid orders are saved.
            </div>
          )}
        </section>
      </div>

      <RecentOrders orders={dashboard.recentOrders} />
    </>
  );
}
