import Link from 'next/link';
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Radio,
  ShieldCheck,
  Sparkles,
  Trophy,
  UsersRound,
} from 'lucide-react';
import { SiteHeader } from '../components/site-header';
import { TeamMark } from '../components/team-mark';
import { TournamentCard } from '../components/tournament-card';
import {
  completedTournaments,
  getTeam,
  liveTournament,
  upcomingTournaments,
} from '../lib/mock-data';

export default function HomePage() {
  const liveMatch = liveTournament?.bracket
    .flatMap((stage) => stage.rounds)
    .flatMap((round) => round.matches)
    .find((match) => match.status === 'LIVE');

  return (
    <main className="shell">
      <SiteHeader active="home" />
      <section className="homeHero pageContainer">
        <div className="heroCopy">
          <div className="eyebrow">
            <Sparkles size={14} /> Соревнуйся. Побеждай. Запоминай.
          </div>
          <h1>
            Твоя команда.
            <br />
            Твоя <span>арена.</span>
          </h1>
          <p>
            Находи турниры, собирай состав и следи за каждым матчем в сетке. Всё необходимое — от
            регистрации до кубка — в одном месте.
          </p>
          <div className="heroActions">
            <Link className="button buttonPrimary buttonLarge" href="/tournaments">
              Найти турнир <ArrowRight size={18} />
            </Link>
            <Link className="button buttonSecondary buttonLarge" href="/organizer/tournaments/new">
              Создать свой
            </Link>
          </div>
          <div className="trustLine">
            <span>
              <CheckCircle2 size={15} /> Проверенные результаты
            </span>
            <span>
              <ShieldCheck size={15} /> Честные сетки
            </span>
          </div>
        </div>
        {liveTournament && liveMatch && (
          <Link className="livePanel" href={`/tournaments/${liveTournament.slug}?tab=bracket`}>
            <div className="livePanelTop">
              <div className="liveLabel">
                <Radio size={14} /> LIVE
              </div>
              <span>{liveMatch.code}</span>
            </div>
            <div className="liveGame">{liveTournament.game}</div>
            <h2>{liveTournament.name}</h2>
            <div className="liveMatchup">
              <TeamMark team={getTeam(liveTournament, liveMatch.first.teamId)} />
              <div className="heroScore">
                <strong>{liveMatch.first.score ?? 0}</strong>
                <span>:</span>
                <strong>{liveMatch.second.score ?? 0}</strong>
              </div>
              <TeamMark team={getTeam(liveTournament, liveMatch.second.teamId)} />
            </div>
            <div className="livePanelBottom">
              <span>Карта 2 · Best of {liveMatch.bestOf}</span>
              <span>
                Смотреть матч <ArrowRight size={15} />
              </span>
            </div>
          </Link>
        )}
      </section>

      <section className="homeMetrics pageContainer" aria-label="Показатели платформы">
        <div>
          <strong>42</strong>
          <span>активных турнира</span>
        </div>
        <div>
          <strong>1 280</strong>
          <span>команд на платформе</span>
        </div>
        <div>
          <strong>8 640</strong>
          <span>матчей проведено</span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>актуальные сетки</span>
        </div>
      </section>

      <section className="contentSection pageContainer">
        <div className="sectionHeading">
          <div>
            <span className="sectionNumber">01 · БЛИЖАЙШИЕ</span>
            <h2>Новые турниры</h2>
            <p>Регистрация уже открыта — выбери дисциплину и займи место в сетке.</p>
          </div>
          <Link className="textLink" href="/tournaments">
            Все турниры <ArrowRight size={16} />
          </Link>
        </div>
        <div className="tournamentGrid">
          {upcomingTournaments.map((tournament, index) => (
            <TournamentCard tournament={tournament} featured={index === 0} key={tournament.slug} />
          ))}
        </div>
      </section>

      <section className="featureBand">
        <div className="pageContainer featureGrid">
          <div className="featureIntro">
            <span className="sectionNumber">02 · ОДИН КОНТУР</span>
            <h2>От заявки до финала — без хаоса</h2>
            <p>
              Участники и организаторы видят одинаковое состояние турнира, сроки и следующий шаг.
            </p>
          </div>
          <div className="featureCard">
            <UsersRound size={22} />
            <span>01</span>
            <h3>Собери команду</h3>
            <p>Пригласи игроков, проверь игровые аккаунты и зафиксируй состав.</p>
          </div>
          <div className="featureCard">
            <CalendarCheck2 size={22} />
            <span>02</span>
            <h3>Зарегистрируйся</h3>
            <p>Выбери турнир, подтверди правила и не пропусти check-in.</p>
          </div>
          <div className="featureCard">
            <Trophy size={22} />
            <span>03</span>
            <h3>Пройди сетку</h3>
            <p>Играй матчи, подтверждай счёт и следи за продвижением в реальном времени.</p>
          </div>
        </div>
      </section>

      <section className="contentSection pageContainer pastSection">
        <div className="sectionHeading">
          <div>
            <span className="sectionNumber">03 · АРХИВ</span>
            <h2>Недавние чемпионы</h2>
          </div>
        </div>
        {completedTournaments.map((tournament) => {
          const champion = getTeam(tournament, tournament.placements[0]?.teamId);
          return (
            <Link
              className="pastTournament"
              href={`/tournaments/${tournament.slug}`}
              key={tournament.slug}
            >
              <div className={`pastArt tone-${tournament.accent}`}>
                <Trophy size={30} />
              </div>
              <div>
                <span>{tournament.game}</span>
                <h3>{tournament.name}</h3>
              </div>
              <div className="pastChampion">
                <span>Чемпион</span>
                <strong>{champion?.name}</strong>
              </div>
              <div className="pastPrize">
                <span>{tournament.prizeLabel}</span>
                <strong>{tournament.prizePool}</strong>
              </div>
              <ArrowRight size={20} />
            </Link>
          );
        })}
      </section>

      <footer className="siteFooter">
        <div className="pageContainer footerInner">
          <span>© 2026 ARENA GRID</span>
          <span>Турнирная платформа для игроков и организаторов</span>
          <div>
            <Link href="/tournaments">Турниры</Link>
            <Link href="/auth/sign-in">Войти</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
