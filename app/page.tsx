import QuoteForm from "@/components/quote-form";

const services = [
  ["DV", "Dry Van", "Dependable dry-van transportation for general freight across regional and long-haul lanes."],
  ["RF", "Regional Freight", "Responsive regional coverage designed for consistent service and tighter delivery windows."],
  ["LH", "Long-Haul", "Professional over-the-road transportation with visibility, communication, and disciplined execution."],
  ["DF", "Dedicated Freight", "Capacity solutions built around recurring lanes, shipper requirements, and dependable schedules."],
  ["TV", "Shipment Visibility", "Milestone tracking and document workflows designed into the operating model from the start."],
  ["DI", "Data-Driven Operations", "A technology foundation for load profitability, fleet KPIs, predictive maintenance, and smarter dispatch."],
];

const compliance = [
  ["USDOT", "Pending"],
  ["MC Authority", "Pending"],
  ["Safety Rating", "Not yet assigned"],
  ["Insurance", "Being finalized"],
];

const businessPhoneDisplay = "(346) 847-2601";
const businessPhoneHref = "tel:+13468472601";

export default function HomePage() {
  return (
    <main>
      <header className="nav">
        <div className="shell nav-inner">
          <a className="brand" href="#top"><span className="brand-mark">F</span><span>FLOUSH LOGISTICS</span></a>
          <nav className="nav-links" aria-label="Primary navigation">
            <a href="#services">Services</a><a href="#why-us">Why Floush</a><a href="#quote">Quote</a><a href="/dashboard">Operations</a>
          </nav>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="shell hero-grid">
          <div>
            <div className="eyebrow">Technology-enabled freight transportation</div>
            <h1>Reliable freight transportation across America.</h1>
            <p>Floush Logistics is building a modern carrier around disciplined operations, responsive communication, safety, and data-driven decision making.</p>
            <div className="hero-actions"><a className="btn btn-primary" href="#quote">Request a Quote</a><a className="btn btn-secondary" href="#services">Explore Services</a></div>
          </div>
          <aside className="hero-card">
            <div className="eyebrow">Built for trust</div>
            <div className="metric"><span>Operations</span><strong>Safety First</strong></div>
            <div className="metric"><span>Communication</span><strong>Responsive</strong></div>
            <div className="metric"><span>Execution</span><strong>Disciplined</strong></div>
            <div className="metric"><span>Intelligence</span><strong>Data Driven</strong></div>
          </aside>
        </div>
      </section>

      <section className="section" id="services">
        <div className="shell">
          <div className="section-head"><div className="eyebrow">What we do</div><h2>Freight service built around execution.</h2><p>Start with dependable transportation, then add the technology, data, and operating discipline required to scale responsibly.</p></div>
          <div className="grid-3">{services.map(([icon,title,copy]) => <article className="card" key={title}><div className="icon" aria-hidden="true">{icon}</div><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </div>
      </section>

      <section className="section soft" id="why-us">
        <div className="shell split">
          <div className="section-head"><div className="eyebrow">Why Floush</div><h2>Delivering Excellence. Driving Trust.</h2><p>Floush is starting lean, but the company is being built with professional systems from day one: clear communication, accountable processes, shipment visibility, careful cost control, and a serious commitment to safety.</p></div>
          <div className="panel"><h3>Designed to grow the right way</h3><div className="checklist"><div className="check"><b>✓</b><span>Safety and compliance built into operating procedures.</span></div><div className="check"><b>✓</b><span>Load, truck, driver, document, and invoice workflows designed to stay organized as volume grows.</span></div><div className="check"><b>✓</b><span>Profitability measured by lane, load, customer, and asset.</span></div><div className="check"><b>✓</b><span>AI-ready architecture for dispatch, maintenance, and exception intelligence.</span></div></div></div>
        </div>
      </section>

      <section className="section" id="quote">
        <div className="shell">
          <div className="section-head centered"><div className="eyebrow">Request a quote</div><h2>Tell us about your freight.</h2><p>Share your route, timing, equipment needs, and freight details. We will review the request and follow up with availability and next steps. Prefer email? Contact <a href="mailto:quotes@floushlogistics.com"><strong>quotes@floushlogistics.com</strong></a> or call <a href={businessPhoneHref}><strong>{businessPhoneDisplay}</strong></a>.</p></div>

          <div className="trust-strip" aria-label="Carrier compliance status">
            {compliance.map(([label, value]) => <div className="trust-item" key={label}><span>{label}</span><strong>{value}</strong></div>)}
          </div>
          <p className="compliance-note">Floush Logistics is a new carrier. Regulatory identifiers and active coverage details will be published here as they are issued and finalized. We do not display placeholder numbers.</p>

          <QuoteForm />
        </div>
      </section>

      <footer className="footer"><div className="shell footer-inner"><strong>Floush Logistics LLC</strong><span><a href="mailto:quotes@floushlogistics.com">quotes@floushlogistics.com</a></span><span><a href={businessPhoneHref}>{businessPhoneDisplay}</a></span><span>Delivering Excellence. Driving Trust.</span><span>© 2026 Floush Logistics LLC</span></div></footer>
    </main>
  );
}
