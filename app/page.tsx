const services = [
  ["DV", "Dry Van", "Dependable dry-van transportation for general freight across regional and long-haul lanes."],
  ["RF", "Regional Freight", "Responsive regional coverage designed for consistent service and tighter delivery windows."],
  ["LH", "Long-Haul", "Professional over-the-road transportation with visibility, communication, and disciplined execution."],
  ["DF", "Dedicated Freight", "Capacity solutions built around recurring lanes, shipper requirements, and dependable schedules."],
  ["TR", "Real-Time Visibility", "Shipment status, milestone tracking, and document workflows designed into the operating model."],
  ["AI", "Data-Driven Operations", "A technology foundation for load profitability, fleet KPIs, predictive maintenance, and smarter dispatch."],
];

export default function HomePage() {
  return (
    <main>
      <header className="nav">
        <div className="shell nav-inner">
          <a className="brand" href="#top"><span className="brand-mark">F</span><span>FLOUSH LOGISTICS</span></a>
          <nav className="nav-links">
            <a href="#services">Services</a><a href="#why">Why Floush</a><a href="#quote">Quote</a><a href="/dashboard">Operations</a>
          </nav>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="shell hero-grid">
          <div>
            <div className="eyebrow">Technology-enabled freight transportation</div>
            <h1>Reliable freight transportation across America.</h1>
            <p>Floush Logistics combines disciplined transportation operations, strong communication, and modern logistics technology to move freight with confidence.</p>
            <div className="hero-actions"><a className="btn btn-primary" href="#quote">Request a Quote</a><a className="btn btn-secondary" href="#services">Explore Services</a></div>
          </div>
          <aside className="hero-card">
            <div className="eyebrow">Built for trust</div>
            <div className="metric"><span>Operations</span><strong>Safety First</strong></div>
            <div className="metric"><span>Visibility</span><strong>Connected</strong></div>
            <div className="metric"><span>Execution</span><strong>On Time</strong></div>
            <div className="metric"><span>Intelligence</span><strong>Data Driven</strong></div>
          </aside>
        </div>
      </section>

      <section className="section" id="services">
        <div className="shell">
          <div className="section-head"><div className="eyebrow">What we do</div><h2>Freight service built around execution.</h2><p>Start with dependable transportation. Add the technology, data, and operating discipline required to scale responsibly.</p></div>
          <div className="grid-3">{services.map(([icon,title,copy]) => <article className="card" key={title}><div className="icon">{icon}</div><h3>{title}</h3><p>{copy}</p></article>)}</div>
        </div>
      </section>

      <section className="section soft" id="why">
        <div className="shell split">
          <div className="section-head"><div className="eyebrow">Why Floush</div><h2>Delivering Excellence. Driving Trust.</h2><p>Floush is being built with the operating standards of a larger carrier from day one: professional communication, accountable processes, shipment visibility, and rigorous economics behind every load.</p></div>
          <div className="panel"><h3>Designed to scale</h3><div className="checklist"><div className="check"><b>✓</b><span>Safety and compliance embedded into operations.</span></div><div className="check"><b>✓</b><span>Load, truck, driver, document, and invoice workflows in one operating model.</span></div><div className="check"><b>✓</b><span>Profitability measured by lane, load, customer, and asset.</span></div><div className="check"><b>✓</b><span>AI-ready architecture for dispatch, maintenance, and exception intelligence.</span></div></div></div>
        </div>
      </section>

      <section className="section" id="quote">
        <div className="shell"><div className="section-head" style={{marginInline:"auto", textAlign:"center"}}><div className="eyebrow">Request a quote</div><h2>Tell us about your freight.</h2><p>This v0.1 form establishes the customer intake experience. Backend submission and CRM routing are the next integration layer.</p></div>
          <form className="form-card">
            <div className="form-grid">
              <div className="field"><label>Company</label><input name="company" placeholder="Your company" /></div>
              <div className="field"><label>Contact name</label><input name="contact" placeholder="Full name" /></div>
              <div className="field"><label>Email</label><input name="email" type="email" placeholder="you@company.com" /></div>
              <div className="field"><label>Phone</label><input name="phone" placeholder="Business phone" /></div>
              <div className="field"><label>Pickup</label><input name="pickup" placeholder="City, State" /></div>
              <div className="field"><label>Delivery</label><input name="delivery" placeholder="City, State" /></div>
              <div className="field full"><label>Freight details</label><textarea name="details" placeholder="Commodity, weight, equipment, dates, and special requirements" /></div>
              <div className="field full"><button className="btn btn-primary" type="button">Submit Quote Request</button></div>
            </div>
          </form>
        </div>
      </section>

      <footer className="footer"><div className="shell footer-inner"><strong>Floush Logistics LLC</strong><span>Delivering Excellence. Driving Trust.</span><span>© 2026 Floush Logistics LLC</span></div></footer>
    </main>
  );
}
