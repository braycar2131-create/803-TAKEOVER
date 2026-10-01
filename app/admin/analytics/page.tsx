import DashboardCards from "../../../components/admin/DashboardCards";
import RevenueChart from "../../../components/admin/RevenueChart";
import {
  formatMoney,
  getAdminDashboardData,
  getRevenueByDay,
} from "../../../lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const [dashboard, revenuePoints] = await Promise.all([
    getAdminDashboardData(),
    getRevenueByDay(30),
  ]);

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>STORE PERFORMANCE</span>
          <h1>ANALYTICS</h1>
          <p>
            Revenue, customer, order, and product performance from your live database.
          </p>
        </div>

        <strong>30 DAY VIEW</strong>
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
              <span>PRODUCT RANKING</span>
              <h2>TOP PRODUCTS</h2>
            </div>
          </div>

          {dashboard.bestSellers.length === 0 ? (
            <div className="admin-empty-mini">
              Product analytics will appear after paid orders are saved.
            </div>
          ) : (
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
          )}
        </section>
      </div>
    </>
  );
}
