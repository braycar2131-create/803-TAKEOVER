type StatCardProps = {
  label: string;
  value: string;
  detail?: string;
  accent?: string;
};

export default function StatCard({
  label,
  value,
  detail,
  accent,
}: StatCardProps) {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-card__top">
        <span>{label}</span>
        <i aria-hidden="true" />
      </div>

      <strong>{value}</strong>

      {detail ? <p>{detail}</p> : null}
      {accent ? <small>{accent}</small> : null}
    </article>
  );
}
