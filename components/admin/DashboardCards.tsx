import StatCard from "./StatCard";
import { formatMoney } from "../../lib/admin";

type DashboardCardsProps = {
  todayRevenue: number;
  monthRevenue: number;
  totalRevenue: number;
  totalOrders: number;
  customerCount: number;
  averageOrderValue: number;
};

export default function DashboardCards({
  todayRevenue,
  monthRevenue,
  totalRevenue,
  totalOrders,
  customerCount,
  averageOrderValue,
}: DashboardCardsProps) {
  return (
    <section className="admin-stat-grid">
      <StatCard
        label="REVENUE TODAY"
        value={formatMoney(todayRevenue)}
        detail="Paid orders since midnight"
      />

      <StatCard
        label="THIS MONTH"
        value={formatMoney(monthRevenue)}
        detail="Current calendar month"
      />

      <StatCard
        label="TOTAL REVENUE"
        value={formatMoney(totalRevenue)}
        detail="All completed test and live orders"
      />

      <StatCard
        label="TOTAL ORDERS"
        value={String(totalOrders)}
        detail="All saved order records"
      />

      <StatCard
        label="CUSTOMERS"
        value={String(customerCount)}
        detail="Unique customer email addresses"
      />

      <StatCard
        label="AVERAGE ORDER"
        value={formatMoney(averageOrderValue)}
        detail="Average paid order value"
      />
    </section>
  );
}
