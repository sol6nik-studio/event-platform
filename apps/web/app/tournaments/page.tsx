import Link from 'next/link';

const items = ['Northern Nexus Cup', 'Rift Challengers', 'Triple Strike Open', 'Crown Masters'];
export default function TournamentsPage() {
  return (
    <main className="shell">
      <div className="container">
        <nav className="nav">
          <Link className="brand" href="/">
            <span>ARENA</span> GRID
          </Link>
          <Link className="button secondary" href="/">
            Back home
          </Link>
        </nav>
        <section className="section">
          <div className="eyebrow">Tournament catalog</div>
          <h1 style={{ fontSize: 48 }}>Find your next bracket.</h1>
          <p>
            Filter-ready catalog powered by <code>/api/v1/tournaments</code>; search state is
            URL-addressable in the full client.
          </p>
          <div className="cards" style={{ marginTop: 28 }}>
            {items.map((title) => (
              <Link
                className="card"
                href={`/tournaments/${title.toLowerCase().replaceAll(' ', '-')}`}
                key={title}
              >
                <div className="game">LIVE DISCOVERY</div>
                <h3>{title}</h3>
                <div className="meta">
                  <span>Registration · EU · 5v5</span>
                  <span className="status">Open</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
