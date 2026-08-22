const loads = [
  ["FL-1001", "Houston, TX", "Dallas, TX", "$1,425", "5.20", "In Transit"],
  ["FL-1002", "San Antonio, TX", "Memphis, TN", "$2,980", "3.11", "Booked"],
  ["FL-1003", "Dallas, TX", "Oklahoma City, OK", "$1,180", "4.03", "Delivered"],
];

export default function DashboardPage() {
  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div className="shell nav-inner">
          <a className="brand" href="/" style={{color:"white"}}><span className="brand-mark">F</span><span>FLOUSH OPS</span></a>
          <a className="btn btn-secondary" href="/">Public Website</a>
        </div>
      </header>
      <div className="shell">
        <div className="dashboard-grid">
          <div className="stat"><span>Active Loads</span><strong>2</strong></div>
          <div className="stat"><span>Revenue This Week</span><strong>$5,585</strong></div>
          <div className="stat"><span>Avg. Effective RPM</span><strong>$4.11</strong></div>
          <div className="stat"><span>On-Time Delivery</span><strong>100%</strong></div>
        </div>
        <section className="table-wrap">
          <table>
            <thead><tr><th>Load</th><th>Pickup</th><th>Delivery</th><th>Rate</th><th>Eff. RPM</th><th>Status</th></tr></thead>
            <tbody>{loads.map((load) => <tr key={load[0]}>{load.slice(0,5).map((cell,i) => <td key={i}>{cell}</td>)}<td><span className="status">{load[5]}</span></td></tr>)}</tbody>
          </table>
        </section>
        <section className="section">
          <div className="section-head"><div className="eyebrow">Floush Intelligence</div><h2>Operating system foundation</h2><p>This dashboard currently uses demonstration data. The next release will connect persistent loads, drivers, trucks, customers, brokers, documents, expenses, and AI recommendations to a real database.</p></div>
        </section>
      </div>
    </main>
  );
}
