import { getSql } from "@/lib/db";
import { ensureOpsSchema } from "@/lib/ops-schema";

export const dynamic = "force-dynamic";

type DashboardSummary = {
  active_loads: number | string;
  revenue_week_cents: number | string;
  avg_effective_rpm: number | string | null;
  delivered_loads: number | string;
  new_quotes: number | string;
};

type LoadRow = {
  load_number: string;
  pickup_location: string;
  delivery_location: string;
  revenue_cents: number | string;
  loaded_miles: number | string | null;
  status: string;
};

function money(cents: number | string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(cents) / 100);
}

function statusLabel(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function DashboardPage() {
  let summary: DashboardSummary = {
    active_loads: 0,
    revenue_week_cents: 0,
    avg_effective_rpm: null,
    delivered_loads: 0,
    new_quotes: 0,
  };
  let loads: LoadRow[] = [];
  let databaseReady = true;

  try {
    await ensureOpsSchema();
    const sql = getSql();

    const [summaryRows, quoteRows, loadRows] = await Promise.all([
      sql`
        SELECT
          COUNT(*) FILTER (WHERE status IN ('booked','dispatched','in_transit')) AS active_loads,
          COALESCE(SUM(revenue_cents) FILTER (WHERE created_at >= date_trunc('week', NOW())), 0) AS revenue_week_cents,
          ROUND(AVG(CASE WHEN loaded_miles IS NOT NULL AND loaded_miles > 0 THEN (revenue_cents::numeric / 100) / loaded_miles END), 2) AS avg_effective_rpm,
          COUNT(*) FILTER (WHERE status IN ('delivered','invoiced','paid')) AS delivered_loads
        FROM loads
      `,
      sql`SELECT COUNT(*) AS new_quotes FROM quote_requests WHERE status IN ('new','reviewing')`,
      sql`
        SELECT load_number, pickup_location, delivery_location, revenue_cents, loaded_miles, status
        FROM loads
        ORDER BY created_at DESC
        LIMIT 20
      `,
    ]);

    if (summaryRows[0]) summary = { ...summary, ...(summaryRows[0] as Omit<DashboardSummary, "new_quotes">) };
    if (quoteRows[0]) summary.new_quotes = quoteRows[0].new_quotes as number | string;
    loads = loadRows as LoadRow[];
  } catch (error) {
    databaseReady = false;
    console.error("Operations dashboard database query failed:", error);
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="shell nav-inner">
          <a className="brand" href="/dashboard" style={{ color: "white" }}><span className="brand-mark">F</span><span>FLOUSH OPS</span></a>
          <div className="ops-nav"><a href="/dashboard">Dashboard</a><a href="/dashboard/quotes">Quotes ({Number(summary.new_quotes)})</a><a href="/">Public Website</a></div>
        </div>
      </header>

      <div className="shell">
        <div className="dashboard-grid">
          <div className="stat"><span>Active Loads</span><strong>{Number(summary.active_loads)}</strong></div>
          <div className="stat"><span>Revenue This Week</span><strong>{money(summary.revenue_week_cents)}</strong></div>
          <div className="stat"><span>Avg. Effective RPM</span><strong>{summary.avg_effective_rpm == null ? "—" : `$${Number(summary.avg_effective_rpm).toFixed(2)}`}</strong></div>
          <div className="stat"><span>New Quotes</span><strong>{Number(summary.new_quotes)}</strong></div>
        </div>

        {!databaseReady ? (
          <section className="form-message error">The operations database is unavailable. Check the Railway DATABASE_URL and visit /api/health/database for the exact status.</section>
        ) : (
          <section className="table-wrap">
            <table>
              <thead><tr><th>Load</th><th>Pickup</th><th>Delivery</th><th>Rate</th><th>Eff. RPM</th><th>Status</th></tr></thead>
              <tbody>
                {loads.length ? loads.map((load) => {
                  const miles = load.loaded_miles == null ? 0 : Number(load.loaded_miles);
                  const effectiveRpm = miles > 0 ? Number(load.revenue_cents) / 100 / miles : null;
                  return (
                    <tr key={load.load_number}>
                      <td>{load.load_number}</td><td>{load.pickup_location}</td><td>{load.delivery_location}</td><td>{money(load.revenue_cents)}</td><td>{effectiveRpm == null ? "—" : `$${effectiveRpm.toFixed(2)}`}</td><td><span className="status">{statusLabel(load.status)}</span></td>
                    </tr>
                  );
                }) : <tr><td colSpan={6}>No loads yet. Open the Quote Inbox and convert an accepted quote into the first booked load.</td></tr>}
              </tbody>
            </table>
          </section>
        )}

        <section className="section">
          <div className="section-head"><div className="eyebrow">Floush Intelligence</div><h2>Live operating system foundation</h2><p>The dashboard reads from Neon and displays real operational data only. Incoming quotes can now be reviewed and converted into persistent booked loads.</p></div>
        </section>
      </div>
    </main>
  );
}
