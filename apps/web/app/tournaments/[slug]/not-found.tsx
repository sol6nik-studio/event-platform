import Link from 'next/link';
import { ArrowLeft, SearchX } from 'lucide-react';
import { SiteHeader } from '../../../components/site-header';

export default function TournamentNotFound() {
  return (
    <main className="shell">
      <SiteHeader compact />
      <section className="notFound pageContainer">
        <SearchX size={42} />
        <span className="sectionNumber">ОШИБКА 404</span>
        <h1>Такого турнира нет</h1>
        <p>Возможно, турнир был удалён или ссылка устарела.</p>
        <Link className="button buttonPrimary" href="/tournaments">
          <ArrowLeft size={16} /> Вернуться в каталог
        </Link>
      </section>
    </main>
  );
}
