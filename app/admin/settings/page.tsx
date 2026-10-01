export default function AdminSettingsPage() {
  const environmentChecks = [
    {
      label: "DATABASE_URL",
      ready: Boolean(process.env.DATABASE_URL),
    },
    {
      label: "STRIPE_SECRET_KEY",
      ready: Boolean(process.env.STRIPE_SECRET_KEY),
    },
    {
      label: "STRIPE_WEBHOOK_SECRET",
      ready: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    },
    {
      label: "NEXT_PUBLIC_SITE_URL",
      ready: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    },
  ];

  return (
    <>
      <section className="admin-page-heading">
        <div>
          <span>SYSTEM CONTROL</span>
          <h1>SETTINGS</h1>
          <p>
            Environment status and store configuration overview.
          </p>
        </div>
      </section>

      <div className="admin-dashboard-grid">
        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span>ENVIRONMENT</span>
              <h2>SYSTEM STATUS</h2>
            </div>
          </div>

          <dl className="admin-detail-list">
            {environmentChecks.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>
                  <span
                    className={
                      item.ready
                        ? "admin-status admin-status--paid"
                        : "admin-status admin-status--cancelled"
                    }
                  >
                    {item.ready ? "CONNECTED" : "MISSING"}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="admin-panel">
          <div className="admin-panel-heading">
            <div>
              <span>STORE PROFILE</span>
              <h2>803 TAKEOVER</h2>
            </div>
          </div>

          <dl className="admin-detail-list">
            <div>
              <dt>BRAND</dt>
              <dd>803 TAKEOVER</dd>
            </div>

            <div>
              <dt>COLLECTION</dt>
              <dd>LONG LIVE FELIX COLLECTIVE</dd>
            </div>

            <div>
              <dt>CURRENCY</dt>
              <dd>USD</dd>
            </div>

            <div>
              <dt>PAYMENT PROVIDER</dt>
              <dd>STRIPE CHECKOUT</dd>
            </div>

            <div>
              <dt>DATABASE</dt>
              <dd>SUPABASE POSTGRESQL + PRISMA</dd>
            </div>
          </dl>
        </section>
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading">
          <div>
            <span>SECURITY NOTICE</span>
            <h2>ADMIN PROTECTION</h2>
          </div>
        </div>

        <div className="admin-empty-mini">
          Authentication is not installed yet. Do not deploy the admin dashboard
          publicly until Module 3 adds protected routes and an admin login.
        </div>
      </section>
    </>
  );
}
