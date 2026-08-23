import ConvertQuoteForm from "@/components/convert-quote-form";
import { getSql } from "@/lib/db";
import { ensureOpsSchema } from "@/lib/ops-schema";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type QuoteRow = {
  id: string;
  company: string;
  contact_name: string;
  email: string;
  phone: string;
  pickup_location: string;
  delivery_location: string;
  pickup_date: string;
  equipment_type: string;
  freight_details: string;
  status: string;
};

type LoadRow = { load_number: string };

function label(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function QuoteReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await ensureOpsSchema();
  const sql = getSql();

  const [quoteRows, loadRows] = await Promise.all([
    sql`
      SELECT id, company, contact_name, email, phone, pickup_location, delivery_location,
             pickup_date, equipment_type, freight_details, status
      FROM quote_requests WHERE id = ${id} LIMIT 1
    `,
    sql`SELECT load_number FROM loads WHERE quote_request_id = ${id} LIMIT 1`,
  ]);

  const quote = quoteRows[0] as QuoteRow | undefined;
  if (!quote) notFound();
  const load = loadRows[0] as LoadRow | undefined;

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="shell nav-inner">
          <a className="brand" href="/dashboard" style={{ color: "white" }}><span className="brand-mark">F</span><span>FLOUSH OPS</span></a>
          <div className="ops-nav"><a href="/dashboard">Dashboard</a><a href="/dashboard/quotes">Quotes</a><a href="/">Public Website</a></div>
        </div>
      </header>
      <div className="shell ops-page">
        <div className="ops-title"><div><div className="eyebrow">Quote review</div><h1>{quote.company}</h1><p>{quote.pickup_location} → {quote.delivery_location}</p></div><span className="status">{label(quote.status)}</span></div>

        <div className="ops-detail-grid">
          <section className="card">
            <h3>Customer request</h3>
            <dl className="ops-details">
              <div><dt>Contact</dt><dd>{quote.contact_name}</dd></div>
              <div><dt>Email</dt><dd><a href={`mailto:${quote.email}`}>{quote.email}</a></dd></div>
              <div><dt>Phone</dt><dd><a href={`tel:${quote.phone}`}>{quote.phone}</a></dd></div>
              <div><dt>Pickup</dt><dd>{quote.pickup_location}</dd></div>
              <div><dt>Delivery</dt><dd>{quote.delivery_location}</dd></div>
              <div><dt>Pickup date</dt><dd>{String(quote.pickup_date).slice(0, 10)}</dd></div>
              <div><dt>Equipment</dt><dd>{quote.equipment_type}</dd></div>
              <div className="full"><dt>Freight details</dt><dd>{quote.freight_details}</dd></div>
            </dl>
          </section>

          <section className="card">
            <h3>{load ? "Booked load" : "Convert to booked load"}</h3>
            {load ? (
              <div className="form-message success">This quote is already linked to load <strong>{load.load_number}</strong>.</div>
            ) : (
              <>
                <p className="table-muted">Enter the agreed rate. Miles are optional now and can be updated later when dispatch details are complete.</p>
                <ConvertQuoteForm quoteId={quote.id} />
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
