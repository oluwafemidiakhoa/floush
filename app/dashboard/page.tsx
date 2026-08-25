import { getSql } from "@/lib/db";
import { ensureOpsSchema } from "@/lib/ops-schema";

export const dynamic = "force-dynamic";

type DashboardSummary = { active_loads:number|string; revenue_week_cents:number|string; avg_effective_rpm:number|string|null; delivered_loads:number|string; new_quotes:number|string };
type LoadRow = { load_number:string; pickup_location:string; delivery_location:string; revenue_cents:number|string; loaded_miles:number|string|null; status:string };

function money(cents:number|string){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(Number(cents)/100)}
function statusLabel(status:string){return status.replaceAll("_"," ").replace(/\b\w/g,l=>l.toUpperCase())}

export default async function DashboardPage(){
 let summary:DashboardSummary={active_loads:0,revenue_week_cents:0,avg_effective_rpm:null,delivered_loads:0,new_quotes:0};let loads:LoadRow[]=[];let databaseReady=true;
 try{await ensureOpsSchema();const sql=getSql();const [summaryRows,quoteRows,loadRows]=await Promise.all([
 sql`SELECT COUNT(*) FILTER (WHERE status IN ('booked','dispatched','in_transit')) AS active_loads,COALESCE(SUM(revenue_cents) FILTER (WHERE created_at >= date_trunc('week', NOW())),0) AS revenue_week_cents,ROUND(AVG(CASE WHEN loaded_miles IS NOT NULL AND loaded_miles > 0 THEN (revenue_cents::numeric / 100) / loaded_miles END),2) AS avg_effective_rpm,COUNT(*) FILTER (WHERE status IN ('delivered','invoiced','paid')) AS delivered_loads FROM loads`,
 sql`SELECT COUNT(*) AS new_quotes FROM quote_requests WHERE status IN ('new','reviewing')`,
 sql`SELECT load_number,pickup_location,delivery_location,revenue_cents,loaded_miles,status FROM loads ORDER BY created_at DESC LIMIT 20`]);
 if(summaryRows[0])summary={...summary,...(summaryRows[0] as Omit<DashboardSummary,"new_quotes">)};if(quoteRows[0])summary.new_quotes=quoteRows[0].new_quotes as number|string;loads=loadRows as LoadRow[];
 }catch(error){databaseReady=false;console.error("Operations dashboard database query failed:",error)}
 const newQuotes=Number(summary.new_quotes);
 return <main className="ops-workspace">
  <aside className="ops-sidebar"><a className="ops-logo" href="/dashboard"><span>F</span><b>FLOUSH</b><small>OPERATIONS</small></a><nav><a className="active" href="/dashboard">Overview</a><a href="/dashboard/quotes">Quote inbox <strong>{newQuotes}</strong></a><a href="/">Public website</a></nav><div className="ops-sidebar-note"><span>LIVE SYSTEM</span><b>Database connected</b><p>Real operational data only.</p></div></aside>
  <section className="ops-main"><header className="ops-topbar"><div><p>MONDAY, AUGUST 25</p><h1>Operations overview.</h1></div><div className="ops-actions"><a href="/dashboard/quotes" className="ops-quote-button">Review {newQuotes} quote{newQuotes===1?"":"s"} →</a></div></header>
   {!databaseReady&&<div className="ops-alert">The operations database is unavailable. Check the Railway DATABASE_URL and /api/health/database.</div>}
   <section className="ops-kpis"><article><span>ACTIVE LOADS</span><b>{Number(summary.active_loads)}</b><small>On the road now</small></article><article><span>WEEKLY REVENUE</span><b>{money(summary.revenue_week_cents)}</b><small>Booked this week</small></article><article><span>EFFECTIVE RPM</span><b>{summary.avg_effective_rpm==null?"—":`$${Number(summary.avg_effective_rpm).toFixed(2)}`}</b><small>Loaded-mile average</small></article><article className="quote-kpi"><span>NEW QUOTES</span><b>{newQuotes}</b><a href="/dashboard/quotes">Open inbox →</a></article></section>
   <section className="ops-content"><div className="ops-loads"><div className="ops-section-head"><div><p>OPERATIONS BOARD</p><h2>Current loads</h2></div><span>{loads.length} total</span></div>{loads.length?<div className="load-list">{loads.map(load=>{const miles=load.loaded_miles==null?0:Number(load.loaded_miles);const rpm=miles>0?Number(load.revenue_cents)/100/miles:null;return <article key={load.load_number} className="load-row"><div className="load-id"><b>{load.load_number}</b><span>{statusLabel(load.status)}</span></div><div><small>PICKUP</small><b>{load.pickup_location}</b></div><div className="route-arrow">→</div><div><small>DELIVERY</small><b>{load.delivery_location}</b></div><div><small>RATE</small><b>{money(load.revenue_cents)}</b></div><div><small>RPM</small><b>{rpm==null?"—":`$${rpm.toFixed(2)}`}</b></div></article>})}</div>:<div className="ops-empty"><span>○</span><h3>Your operations board is ready.</h3><p>Convert an accepted quote into your first booked load to begin tracking revenue, miles, and delivery performance.</p><a href="/dashboard/quotes">Open quote inbox →</a></div>}</div>
    <aside className="ops-side-panel"><p>FLOUSH INTELLIGENCE</p><h2>Today&apos;s focus</h2><div className="focus-card"><span>01</span><div><b>Respond to new quotes</b><p>{newQuotes? `${newQuotes} request${newQuotes===1?"":"s"} waiting for review.`:"Your inbox is clear."}</p></div></div><div className="focus-card"><span>02</span><div><b>Keep every load visible</b><p>Load status, margin, and documents stay in one operating system.</p></div></div><a href="/dashboard/quotes">Go to quote inbox →</a></aside></section>
  </section>
 </main>;
}