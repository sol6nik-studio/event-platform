import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { AccountGreeting } from '../account-session-controls';

export function DashboardHeader() {
  return (
    <header className="dashboardPageHead">
      <div>
        <span className="sectionNumber">КОМАНДНЫЙ ЦЕНТР</span>
        <h1>
          С возвращением, <AccountGreeting />.
        </h1>
        <p>Здесь собраны ближайшие действия вашей команды.</p>
      </div>
      <Link className="button buttonGhost" href="/tournaments">
        Найти турнир <ArrowRight size={16} />
      </Link>
    </header>
  );
}
