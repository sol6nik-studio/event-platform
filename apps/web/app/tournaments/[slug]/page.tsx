import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map((part) => (part[0]?.toUpperCase() ?? '') + part.slice(1))
    .join(' ');
  return (
    <main className="shell">
      <div className="container">
        <nav className="nav">
          <Link className="brand" href="/">
            <span>ARENA</span> GRID
          </Link>
          <Link className="button secondary" href="/tournaments">
            Catalog
          </Link>
        </nav>
        <section className="section">
          <div className="eyebrow">Tournament detail · registration open</div>
          <h1 style={{ fontSize: 54 }}>{title}</h1>
          <p>
            Your next action is clear: choose a team, verify the roster, and lock in before check-in
            closes.
          </p>
          <div className="cards" style={{ marginTop: 28 }}>
            <div className="card">
              <div className="game">Format</div>
              <h3>Double Elimination</h3>
              <div className="meta">
                <span>Best of 3 · 5v5</span>
              </div>
            </div>
            <div className="card">
              <div className="game">Schedule</div>
              <h3>Registration open</h3>
              <div className="meta">
                <span>Check-in starts tomorrow</span>
              </div>
            </div>
            <div className="card">
              <div className="game">Bracket</div>
              <h3>Not generated yet</h3>
              <div className="meta">
                <span>Seeding follows check-in</span>
              </div>
            </div>
          </div>
          <div className="actions">
            <Link className="button primary" href="/dashboard">
              Register your team
            </Link>
            <Link className="button secondary" href="#rules">
              View rules
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
