import QuoteForm from "@/components/quote-form";

const services = [
  ["01", "Full Truckload", "Dedicated capacity for the freight that cannot wait."],
  ["02", "Expedited Freight", "Responsive planning and clear communication when time is critical."],
  ["03", "Specialized Solutions", "A practical freight plan shaped around your shipment."],
];

const businessPhoneDisplay = "(346) 847-2601";
const businessPhoneHref = "tel:+13468472601";
const usdotNumber = "7575471";
const mcNumber = "45585216";

export default function HomePage() {
  return (
    <main className="new-site">
      <header className="new-nav">
        <a className="new-brand" href="#top"><span>F</span> FLOUSH <em>LOGISTICS</em></a>
        <nav><a href="#services">Services</a><a href="#why-us">Why Floush</a><a href="#quote">Quote</a><a href="/dashboard">Operations</a></nav>
        <a className="new-button small" href="#quote">REQUEST A QUOTE →</a>
      </header>
      <section id="top" className="new-hero">
        <div className="new-copy"><p className="new-eyebrow">━ FREIGHT, WITHOUT THE GUESSWORK</p><h1>Every mile.<br/><i>Handled.</i></h1><p>Floush Logistics moves freight with disciplined planning, direct communication, and a commitment to getting the details right.</p><div className="new-actions"><a className="new-button" href="#quote">GET A FREIGHT QUOTE →</a><a href="#services">EXPLORE SERVICES ↓</a></div></div>
        <div className="new-map" aria-label="Freight route illustration"><div className="new-route route-one"/><div className="new-route route-two"/><span className="new-dot dot-one"/><span className="new-dot dot-two"/><div className="transit-card"><b>● IN TRANSIT</b><strong>Houston, TX → Atlanta, GA</strong><small>Live shipment coordination</small></div><mark>F</mark></div>
      </section>
      <section className="new-stats"><div><b>24/7</b><span>SHIPMENT VISIBILITY</span></div><div><b>{usdotNumber}</b><span>USDOT</span></div><div><b>{mcNumber}</b><span>MC</span></div><p>Delivering Excellence.<br/><strong>Driving Trust.</strong></p></section>
      <section id="services" className="new-section"><p className="new-eyebrow">━ WHAT WE MOVE</p><h2>Freight service that<br/><i>keeps moving.</i></h2><div className="new-services">{services.map(([number,title,copy])=><article key={title}><b>{number}</b><h3>{title}</h3><p>{copy}</p><a href="#quote">LEARN MORE →</a></article>)}</div></section>
      <section id="why-us" className="new-why"><div><p className="new-eyebrow">━ THE FLOUSH STANDARD</p><h2>Freight is personal.<br/><i>So is our service.</i></h2></div><div className="new-reasons"><article><b>01</b><div><h3>Clear from the start</h3><p>One accountable team, honest updates, and no disappearing acts.</p></div></article><article><b>02</b><div><h3>Built on follow-through</h3><p>We manage the details before they become problems on the road.</p></div></article><article><b>03</b><div><h3>Partner, not just carrier</h3><p>Your freight plan should support the way your business grows.</p></div></article></div></section>
      <section id="quote" className="new-quote"><div><p className="new-eyebrow">━ START A CONVERSATION</p><h2>Let&apos;s move<br/><i>something forward.</i></h2><p>Tell us where your freight is headed. Our team will come back with a clear plan.</p><strong className="new-phone">CALL FLOUSH<a href={businessPhoneHref}>{businessPhoneDisplay}</a></strong><p>USDOT {usdotNumber} · MC {mcNumber}</p></div><QuoteForm/></section>
      <footer className="new-footer"><a className="new-brand" href="#top"><span>F</span> FLOUSH <em>LOGISTICS</em></a><p>© 2026 Floush Logistics LLC · USDOT {usdotNumber} · MC {mcNumber}</p><div><a href="mailto:quotes@floushlogistics.com">quotes@floushlogistics.com</a><a href="/dashboard">Operations</a></div></footer>
    </main>
  );
}