import Link from 'next/link';
import { ArrowRight, Radio, ShieldCheck, Swords, Trophy } from 'lucide-react';

const tournaments = [
  {
    game: 'Dota 2',
    title: 'Northern Nexus Cup',
    meta: 'Double Elim · 5v5',
    date: 'Tomorrow · 18:00',
    status: 'Registration open',
  },
  {
    game: 'League of Legends',
    title: 'Rift Challengers',
    meta: 'Round Robin · 5v5',
    date: 'Sep 12 · 16:00',
    status: 'Registration open',
  },
  {
    game: 'Brawl Stars',
    title: 'Triple Strike Open',
    meta: 'Single Elim · 3v3',
    date: 'Sep 14 · 12:00',
    status: 'Published',
  },
  {
    game: 'Clash Royale',
    title: 'Crown Masters',
    meta: 'Single Elim · 1v1',
    date: 'Completed',
    status: 'Final results',
  },
];

export default function HomePage() {
  return (
    <main className="shell">
      <div className="container">
        <nav className="nav">
          <Link className="brand" href="/">
            <span>ARENA</span> GRID
          </Link>
          <div className="navLinks">
            <Link href="/tournaments">Find tournaments</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/organizer">Organizer Studio</Link>
          </div>
          <Link className="button secondary" href="/tournaments">
            Explore <ArrowRight size={16} />
          </Link>
        </nav>
        <section className="hero">
          <div>
            <div className="eyebrow">Competitive play, organized</div>
            <h1>
              Your next
              <br />
              <span style={{ color: 'var(--cyan)' }}>arena</span> awaits.
            </h1>
            <p>
              Run the full tournament journey in one control room — from roster lock and check-in to
              bracket progression and verified results.
            </p>
            <div className="actions">
              <Link className="button primary" href="/tournaments">
                Find a tournament <ArrowRight size={16} />
              </Link>
              <Link className="button secondary" href="/organizer/tournaments/new">
                Create tournament
              </Link>
            </div>
          </div>
          <div className="broadcast">
            <div className="broadcastHeader">
              <span className="live">
                <Radio size={14} /> LIVE MATCH
              </span>
              <span style={{ color: 'var(--muted)', fontSize: 12 }}>Upper Bracket · R2</span>
            </div>
            <div className="matchLine" style={{ margin: '30px 0 20px' }}>
              <div>
                <strong>Northern Nexus</strong>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>AURORA FIVE</div>
              </div>
              <div className="score">1 : 0</div>
              <div style={{ textAlign: 'right' }}>
                <strong>Vertex Core</strong>
                <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 8 }}>VCOR</div>
              </div>
            </div>
            <div
              style={{
                borderTop: '1px solid #ffffff14',
                paddingTop: 14,
                color: 'var(--muted)',
                fontSize: 12,
              }}
            >
              Game 2 · Dota 2 · Check-in verified
            </div>
          </div>
        </section>
        <section className="section">
          <div className="sectionHeader">
            <div>
              <h2>Upcoming tournaments</h2>
              <p>Pick a game. Build your run.</p>
            </div>
            <Link href="/tournaments" className="button secondary">
              View catalog <ArrowRight size={15} />
            </Link>
          </div>
          <div className="cards">
            {tournaments.map((item) => (
              <Link
                href={`/tournaments/${item.title.toLowerCase().replaceAll(' ', '-')}`}
                className="card"
                key={item.title}
              >
                <div className="game">{item.game}</div>
                <h3>{item.title}</h3>
                <div className="meta">
                  <span>{item.meta}</span>
                  <span className="status">{item.status}</span>
                </div>
                <div className="meta" style={{ marginTop: 12 }}>
                  <span>{item.date}</span>
                  <Trophy size={14} />
                </div>
              </Link>
            ))}
          </div>
        </section>
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="cards">
            <div className="card">
              <Swords color="var(--cyan)" />
              <h3>Built for the match</h3>
              <div className="meta">
                <span>Rooms, results, disputes</span>
              </div>
            </div>
            <div className="card">
              <ShieldCheck color="var(--green)" />
              <h3>Verified outcomes</h3>
              <div className="meta">
                <span>Evidence + audit trail</span>
              </div>
            </div>
            <div className="card">
              <Radio color="var(--violet)" />
              <h3>Broadcast-ready</h3>
              <div className="meta">
                <span>Live bracket updates</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
