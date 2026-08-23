import { getSql } from "@/lib/db";
import { ensureQuoteSchema } from "@/lib/quote-schema";

export const dynamic = "force-dynamic";

type QuoteRow = {
  id: string;
  company: string;
  contact_name: string;
  pickup_location: string;
  delivery_location: string;
  pickup_date: string;
  equipment_type: string;
  status: string;
  created_at: string;
};

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function QuoteInboxPage() {
  await ensureQuoteSchema();
  const sql = getSql();
  const quotes = await sql`
    SELECT id, company, contact_name, pickup_location, delivery_location,
           pickup_date, equipment_type, status, created_at
    FROM quote_requests
    ORDER BY created_at DESC
    LIMIT 100
  ` as QuoteRow[];

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="shell nav-inner">
          <a className="brand" href="/dashboard" style={{ color: "white" }}><span className="brand-mark">F</span><span>FLOUSH OPS</span></a>
          <div className="ops-nav"><a href="/dashboard">Dashboard</a><a href="/dashboard/quotes">Quotes</a><a href="/">Public Website</a></div>
        </div>
      </header>
      <div className="shell ops-page">
        <div className="ops-title"><div><div className="eyebrow">Sales intake</div><h1>Quote Inbox</h1><p>Review incoming freight requests and convert accepted quotes into booked loads.</p></div></div>
        <section className="table-wrap">
          <table>
            <thead><tr><th>Company</th><th>Lane</th><th>Pickup</th><th>Equipment</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {quotes.length ? quotes.map((quote) => (
                <tr key={quote.id}>
                  <td><strong>{quote.company}</strong><br /><span className="table-muted">{quote.contact_name}</span></td>
                  <td>{quote.pickup_location} → {quote.delivery_location}</td>
                  <td>{String(quote.pickup_date).slice(0, 10)}</td>
                  <td>{quote.equipment_type}</td>
                  <td><span className="status">{label(quote.status)}</span></td>
                  <td><a className="table-link" href={`/dashboard/quotes/${quote.id}`}>Review</a></td>
                </tr>
              )) : <tr><td colSpan={6}>No quote requests yet.</td></tr>}
            </tbody>
          </table>
        </section>
      </div>
    </main>
  );
}
