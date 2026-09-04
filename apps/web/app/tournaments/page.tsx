import type { Metadata } from 'next';
import { TournamentCatalog } from '../../components/tournament-catalog';
import { SiteHeader } from '../../components/site-header';
import { tournaments } from '../../lib/mock-data';

export const metadata: Metadata = {
  title: 'Турниры',
  description: 'Актуальные, будущие и завершённые киберспортивные турниры ARENA GRID.',
};

export default function TournamentsPage() {
  return (
    <main className="shell">
      <SiteHeader active="tournaments" />
      <section className="catalogHero pageContainer">
        <span className="sectionNumber">ТУРНИРНЫЙ ЦЕНТР</span>
        <h1>Найди свою следующую арену</h1>
        <p>
          Открытые регистрации, матчи в эфире и полный архив результатов — выбери игру и начинай
          путь к финалу.
        </p>
      </section>
      <section className="catalogContent pageContainer">
        <TournamentCatalog tournaments={tournaments} />
      </section>
    </main>
  );
}
