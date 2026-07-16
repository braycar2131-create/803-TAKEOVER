import { formatMoney } from "../../lib/admin";

type RevenuePoint = {
  label: string;
  amount: number;
  orders: number;
};

export default function RevenueChart({
  points,
}: {
  points: RevenuePoint[];
}) {
  const maximum = Math.max(...points.map((point) => point.amount), 1);
  const total = points.reduce((sum, point) => sum + point.amount, 0);

  return (
    <section className="admin-panel admin-revenue-panel">
      <div className="admin-panel-heading">
        <div>
          <span>LAST {points.length} DAYS</span>
          <h2>REVENUE</h2>
        </div>

        <strong>{formatMoney(total)}</strong>
      </div>

      <div className="admin-revenue-chart" aria-label="Revenue by day">
        {points.map((point) => {
          const height =
            point.amount === 0
              ? 4
              : Math.max(10, Math.round((point.amount / maximum) * 100));

          return (
            <div className="admin-revenue-column" key={point.label}>
              <div className="admin-revenue-value">
                {formatMoney(point.amount)}
              </div>

              <div className="admin-revenue-track">
                <div
                  className="admin-revenue-bar"
                  style={{ height: `${height}%` }}
                />
              </div>

              <span>{point.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
