export default function AdminSettingsPage() {
  const settings = [
    {
      label: "ADMIN EMAIL",
      value: process.env.ADMIN_EMAIL || "NOT CONFIGURED",
    },
    {
      label: "SITE URL",
      value:
        process.env.NEXT_PUBLIC_SITE_URL ||
        "http://localhost:3000",
    },
    {
      label: "DATABASE",
      value: process.env.DATABASE_URL
        ? "CONNECTED"
        : "NOT CONFIGURED",
    },
    {
      label: "STRIPE",
      value: process.env.STRIPE_SECRET_KEY
        ? process.env.STRIPE_SECRET_KEY.startsWith("sk_live_")
          ? "LIVE MODE"
          : "TEST MODE"
        : "NOT CONFIGURED",
    },
    {
      label: "STRIPE WEBHOOK",
      value: process.env.STRIPE_WEBHOOK_SECRET
        ? "CONFIGURED"
        : "NOT CONFIGURED",
    },
    {
      label: "SUPABASE",
      value: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? "CONNECTED"
        : "NOT CONFIGURED",
    },
  ];

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>STORE CONFIGURATION</span>
          <h1>SETTINGS</h1>

          <p>
            Review the current environment and production-service
            configuration.
          </p>
        </div>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        {settings.map((setting) => (
          <article className="admin-panel" key={setting.label}>
            <span
              style={{
                color: "var(--admin-muted)",
                fontSize: "0.58rem",
                letterSpacing: "0.18em",
              }}
            >
              {setting.label}
            </span>

            <strong
              style={{
                display: "block",
                marginTop: "14px",
                overflowWrap: "anywhere",
              }}
            >
              {setting.value}
            </strong>
          </article>
        ))}
      </section>

      <section
        className="admin-panel"
        style={{ marginTop: "22px" }}
      >
        <h2>PRODUCTION CHECKLIST</h2>

        <div
          style={{
            display: "grid",
            gap: "12px",
            marginTop: "20px",
            color: "var(--admin-muted)",
          }}
        >
          <p>✓ Database URL configured</p>
          <p>✓ Stripe secret key configured</p>
          <p>✓ Stripe webhook secret configured</p>
          <p>✓ Supabase URL and anonymous key configured</p>
          <p>✓ Admin email configured</p>
          <p>✓ Production site URL configured before deployment</p>
        </div>
      </section>
    </>
  );
}