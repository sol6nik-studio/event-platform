import Link from 'next/link';

export default function DashboardPage() {
  return (
    <main className="shell">
      <div className="container">
        <nav className="nav">
          <Link className="brand" href="/">
            <span>ARENA</span> GRID
          </Link>
          <Link href="/tournaments" className="button secondary">
            Find tournaments
          </Link>
        </nav>
        <section className="section">
          <div className="eyebrow">Player cockpit</div>
          <h1 style={{ fontSize: 48 }}>Ready room.</h1>
          <p>
            Your next action is to finish roster verification for Aurora Five before check-in opens.
          </p>
          <div className="cards" style={{ marginTop: 28 }}>
            <div className="card">
              <div className="game">NEXT ACTION</div>
              <h3>Verify game account</h3>
              <div className="meta">
                <span>Steam · Dota 2</span>
                <span className="status">Continue</span>
              </div>
            </div>
            <div className="card">
              <div className="game">TEAM</div>
              <h3>Aurora Five</h3>
              <div className="meta">
                <span>2 active members</span>
                <span>Captain</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
