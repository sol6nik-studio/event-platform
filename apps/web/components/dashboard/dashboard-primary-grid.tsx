import Link from 'next/link';
import { CalendarClock, ChevronRight, Clock3, Swords, Trophy } from 'lucide-react';

export function DashboardPrimaryGrid() {
  return (
    <div className="dashboardPrimaryGrid">
      <UpcomingMatchCard />
      <ActiveTournamentsCard />
    </div>
  );
}

function UpcomingMatchCard() {
  return (
    <section className="dashboardPanel panel">
      <div className="dashboardPanelHead">
        <div>
          <span className="dashboardKicker">БЛИЖАЙШИЙ МАТЧ</span>
          <h2>Northern Nexus Cup</h2>
        </div>
        <span className="dashboardStatus dashboardStatusReady">Готов к старту</span>
      </div>
      <div className="dashboardMatchMeta">
        <span>
          <CalendarClock size={15} /> Сегодня, 20:00
        </span>
        <span>
          <Swords size={15} /> Upper · Раунд 2
        </span>
        <span>Best of 3</span>
      </div>
      <div className="dashboardMatchup">
        <div className="dashboardTeam dashboardTeamOwn">
          <span className="dashboardTeamMark">A5</span>
          <span>
            <strong>Aurora Five</strong>
            <small>Ваша команда</small>
          </span>
        </div>
        <div className="dashboardVersus">
          <span>20:00</span>
          <b>VS</b>
        </div>
        <div className="dashboardTeam">
          <span className="dashboardTeamMark dashboardTeamMarkCrimson">CRG</span>
          <span>
            <strong>Crimson Guard</strong>
            <small>Seed 2</small>
          </span>
        </div>
      </div>
      <div className="dashboardPanelFooter">
        <span>
          <Clock3 size={14} /> Комната откроется за 15 минут
        </span>
        <Link href="/tournaments/northern-nexus-cup?tab=matches">
          Открыть матч <ChevronRight size={15} />
        </Link>
      </div>
    </section>
  );
}

function ActiveTournamentsCard() {
  return (
    <section className="dashboardPanel dashboardTournamentPanel panel">
      <div className="dashboardPanelHead">
        <div>
          <span className="dashboardKicker">МОИ ТУРНИРЫ</span>
          <h2>Активные участия</h2>
        </div>
        <Trophy size={20} />
      </div>
      <div className="dashboardTournamentList">
        <Link href="/tournaments/northern-nexus-cup">
          <span className="dashboardGameMark">D2</span>
          <span>
            <strong>Northern Nexus Cup</strong>
            <small>Aurora Five · верхняя сетка</small>
          </span>
          <span className="dashboardStatus dashboardStatusLive">LIVE</span>
          <ChevronRight size={16} />
        </Link>
        <Link href="/tournaments/rift-challengers">
          <span className="dashboardGameMark dashboardGameMarkViolet">LOL</span>
          <span>
            <strong>Rift Challengers</strong>
            <small>Регистрация до 10 сентября</small>
          </span>
          <span className="dashboardStatus dashboardStatusPending">Заявка</span>
          <ChevronRight size={16} />
        </Link>
      </div>
      <div className="dashboardPanelFooter">
        <span>2 активных участия</span>
        <Link href="/tournaments">
          Все турниры <ChevronRight size={15} />
        </Link>
      </div>
    </section>
  );
}
