import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CircleCheck,
  Clock3,
  Gamepad2,
  MapPin,
  Play,
  Radio,
  ShieldCheck,
  Trophy,
  UsersRound,
} from 'lucide-react';
import { BracketBoard } from '../../../components/bracket-board';
import { SiteHeader } from '../../../components/site-header';
import { TeamMark } from '../../../components/team-mark';
import {
  getTeam,
  getTournament,
  statusLabels,
  tournaments,
  type Tournament,
} from '../../../lib/mock-data';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string }>;
}

const tabIds = ['overview', 'participants', 'bracket', 'matches', 'rules', 'stream'] as const;
type TabId = (typeof tabIds)[number];

const tabs: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Обзор' },
  { id: 'participants', label: 'Участники' },
  { id: 'bracket', label: 'Сетка' },
  { id: 'matches', label: 'Матчи' },
  { id: 'rules', label: 'Правила' },
  { id: 'stream', label: 'Трансляция' },
];

function isTab(value: string | undefined): value is TabId {
  return tabIds.some((tab) => tab === value);
}

export function generateStaticParams() {
  return tournaments.map((tournament) => ({ slug: tournament.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tournament = getTournament(slug);
  return tournament
    ? { title: tournament.name, description: tournament.description }
    : { title: 'Турнир не найден' };
}

function TournamentHero({ tournament }: { tournament: Tournament }) {
  const isCompleted = tournament.status === 'COMPLETED';
  const champion = getTeam(tournament, tournament.placements[0]?.teamId);
  return (
    <section className={`detailHero tone-${tournament.accent}`}>
      <div className="pageContainer">
        <div className="breadcrumbs">
          <Link href="/tournaments">
            <ArrowLeft size={15} /> Турниры
          </Link>
          <span>/</span>
          <span>{tournament.game}</span>
        </div>
        <div className="detailHeroGrid">
          <div className="detailHeroCopy">
            <div className={`statusPill status-${tournament.status.toLowerCase()}`}>
              <span /> {statusLabels[tournament.status]}
            </div>
            <div className="detailGame">{tournament.game}</div>
            <h1>{tournament.name}</h1>
            <p>{tournament.description}</p>
            <div className="detailTags">
              {tournament.tags.map((tag) => (
                <span key={tag}>
                  <Check size={13} /> {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="tournamentEmblem" aria-hidden="true">
            <span>{tournament.gameShort.slice(0, 3)}</span>
          </div>
          <aside className="nextActionCard">
            {isCompleted ? (
              <>
                <div className="nextActionLabel">
                  <Trophy size={15} /> Победитель турнира
                </div>
                <TeamMark team={champion} />
                <div className="actionDivider" />
                <span>Финальный счёт</span>
                <strong className="finalScore">3 : 2</strong>
                <Link className="button buttonSecondary" href="?tab=bracket">
                  Открыть результаты <ArrowRight size={16} />
                </Link>
              </>
            ) : tournament.status === 'REGISTRATION_OPEN' ? (
              <>
                <div className="nextActionLabel">
                  <Clock3 size={15} /> Ваш следующий шаг
                </div>
                <h2>Подать заявку</h2>
                <p>До закрытия регистрации осталось 6 дней. Состав можно изменить до check-in.</p>
                <div className="actionCapacity">
                  <span>{tournament.teams.length} команд зарегистрировано</span>
                  <strong>{tournament.participantLimit} мест</strong>
                </div>
                <div className="progressTrack">
                  <span
                    style={{
                      width: `${String((tournament.teams.length / tournament.participantLimit) * 100)}%`,
                    }}
                  />
                </div>
                <Link className="button buttonPrimary" href="/auth/sign-in">
                  Зарегистрировать команду <ArrowRight size={16} />
                </Link>
              </>
            ) : tournament.status === 'LIVE' ? (
              <>
                <div className="nextActionLabel liveText">
                  <Radio size={15} /> Турнир в эфире
                </div>
                <h2>Следите за сеткой</h2>
                <p>
                  Один матч идёт прямо сейчас. Результаты обновляются после подтверждения судьи.
                </p>
                <Link className="button buttonPrimary" href="?tab=bracket">
                  Открыть live-сетку <ArrowRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <div className="nextActionLabel">
                  <CalendarDays size={15} /> Скоро
                </div>
                <h2>Регистрация ещё не открыта</h2>
                <p>Вернитесь 7 сентября или сохраните турнир, чтобы не пропустить старт.</p>
                <button className="button buttonSecondary" type="button">
                  Напомнить об открытии
                </button>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function Overview({ tournament }: { tournament: Tournament }) {
  const isCompleted = tournament.status === 'COMPLETED';
  return (
    <div className="detailColumns">
      <div className="detailMainColumn">
        {isCompleted && tournament.placements.length > 0 && (
          <section className="panel podiumPanel">
            <div className="panelHeading">
              <div>
                <span className="sectionNumber">ИТОГИ</span>
                <h2>Призёры турнира</h2>
              </div>
              <CircleCheck size={22} />
            </div>
            <div className="podiumList">
              {tournament.placements.map((placement) => (
                <div className="podiumRow" key={placement.place}>
                  <strong className={`place place-${String(placement.place)}`}>
                    {placement.place}
                  </strong>
                  <TeamMark team={getTeam(tournament, placement.teamId)} />
                  <span>{placement.prize}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        <section className="panel">
          <div className="panelHeading">
            <div>
              <span className="sectionNumber">ФОРМАТ</span>
              <h2>Как проходит турнир</h2>
            </div>
          </div>
          <div className="formatSteps">
            <div>
              <span>01</span>
              <h3>Регистрация</h3>
              <p>Капитан фиксирует состав и подтверждает участие.</p>
            </div>
            <div>
              <span>02</span>
              <h3>Посев</h3>
              <p>Команды получают seed согласно рейтингу и форме.</p>
            </div>
            <div>
              <span>03</span>
              <h3>{tournament.format}</h3>
              <p>Матчи BO3, решающий финал проводится в формате BO5.</p>
            </div>
          </div>
        </section>
        <section className="panel">
          <div className="panelHeading">
            <div>
              <span className="sectionNumber">УЧАСТНИКИ</span>
              <h2>Команды по посеву</h2>
            </div>
            <Link className="textLink" href="?tab=participants">
              Все составы <ArrowRight size={15} />
            </Link>
          </div>
          <div className="teamPreviewGrid">
            {tournament.teams.slice(0, 6).map((team) => (
              <div className="teamPreview" key={team.id}>
                <span className="seedNumber">{String(team.seed).padStart(2, '0')}</span>
                <TeamMark team={team} />
                <span className="teamRecord">{team.record}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
      <aside className="detailAside">
        <section className="panel factsPanel">
          <h2>О турнире</h2>
          <dl>
            <div>
              <dt>
                <CalendarDays size={16} /> Начало
              </dt>
              <dd>{tournament.startAt}</dd>
            </div>
            <div>
              <dt>
                <Gamepad2 size={16} /> Формат
              </dt>
              <dd>{tournament.format}</dd>
            </div>
            <div>
              <dt>
                <UsersRound size={16} /> Участники
              </dt>
              <dd>
                {tournament.teams.length} команд · {tournament.teamSize}×{tournament.teamSize}
              </dd>
            </div>
            <div>
              <dt>
                <MapPin size={16} /> Регион
              </dt>
              <dd>{tournament.region}</dd>
            </div>
            <div>
              <dt>
                <Trophy size={16} /> {tournament.prizeLabel}
              </dt>
              <dd>{tournament.prizePool}</dd>
            </div>
          </dl>
        </section>
        <section className="panel organizerPanel">
          <span>Организатор</span>
          <h3>
            {tournament.organizer} {tournament.organizerVerified && <ShieldCheck size={17} />}
          </h3>
          <p>Проводит турниры на ARENA GRID с 2024 года.</p>
        </section>
      </aside>
    </div>
  );
}

function Participants({ tournament }: { tournament: Tournament }) {
  return (
    <div className="participantsGrid">
      {tournament.teams.map((team) => (
        <article className="panel rosterCard" key={team.id}>
          <div className="rosterCardHead">
            <TeamMark team={team} />
            <span className="seedPill">SEED {team.seed}</span>
          </div>
          <div className="rosterMeta">
            <span>{team.region}</span>
            <strong>{team.record}</strong>
          </div>
          <ul className="rosterList">
            {team.members.map((member) => (
              <li key={`${team.id}-${member.nickname}`}>
                <span className="playerAvatar">{member.nickname.slice(0, 2).toUpperCase()}</span>
                <span>
                  <strong>{member.nickname}</strong>
                  <small>{member.role}</small>
                </span>
                <span className={member.verified ? 'verifiedDot' : 'pendingDot'}>
                  {member.verified ? 'Проверен' : 'Ожидает'}
                </span>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function Matches({ tournament }: { tournament: Tournament }) {
  const matches = tournament.bracket.flatMap((stage) =>
    stage.rounds.flatMap((round) =>
      round.matches.map((match) => ({ ...match, stage: stage.name, round: round.name })),
    ),
  );
  return (
    <section className="panel matchTablePanel">
      <div className="panelHeading">
        <div>
          <span className="sectionNumber">РАСПИСАНИЕ</span>
          <h2>Все матчи</h2>
        </div>
        <span className="mutedLabel">{matches.length} матчей</span>
      </div>
      <div className="matchList">
        {matches.map((match) => (
          <div className="matchListRow" key={match.id}>
            <div className="matchListCode">
              <strong>{match.code}</strong>
              <span>{match.round}</span>
            </div>
            <TeamMark
              team={getTeam(tournament, match.first.teamId)}
              label={match.first.label}
              compact
            />
            <div className="listScore">
              {match.first.score ?? '—'} : {match.second.score ?? '—'}
            </div>
            <TeamMark
              team={getTeam(tournament, match.second.teamId)}
              label={match.second.label}
              compact
            />
            <div className="matchListTime">
              <span>{match.scheduledAt}</span>
              <small>{match.stage}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Rules({ tournament }: { tournament: Tournament }) {
  return (
    <div className="rulesLayout">
      <section className="panel rulesPanel">
        <div className="panelHeading">
          <div>
            <span className="sectionNumber">РЕДАКЦИЯ 1.2</span>
            <h2>Правила турнира</h2>
          </div>
          <ShieldCheck size={22} />
        </div>
        {tournament.rules.map((rule, index) => (
          <article className="ruleItem" key={rule.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{rule.title}</h3>
              <p>{rule.text}</p>
            </div>
          </article>
        ))}
      </section>
      <aside className="panel rulesSummary">
        <CircleCheck size={26} />
        <h3>Правила приняты участниками</h3>
        <p>Все зарегистрированные команды подтвердили актуальную редакцию.</p>
      </aside>
    </div>
  );
}

function Stream({ tournament }: { tournament: Tournament }) {
  return (
    <section className="streamPanel">
      <div className="streamPreview">
        <div className="streamGrid" />
        <button type="button" className="playButton" aria-label="Воспроизвести трансляцию">
          <Play size={24} fill="currentColor" />
        </button>
        <span className="liveLabel">
          <Radio size={13} /> {tournament.status === 'COMPLETED' ? 'ЗАПИСЬ' : 'LIVE'}
        </span>
      </div>
      <div className="streamInfo">
        <span className="sectionNumber">ОФИЦИАЛЬНАЯ ТРАНСЛЯЦИЯ</span>
        <h2>{tournament.name}</h2>
        <p>
          Комментаторы, статистика матчей и обновление сетки. Запись останется доступна после
          завершения.
        </p>
        <div className="streamStats">
          <span>{tournament.stats.viewers} зрителей</span>
          <span>Русский язык</span>
          <span>1080p</span>
        </div>
      </div>
    </section>
  );
}

export default async function TournamentPage({ params, searchParams }: Props) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const tournament = getTournament(slug);
  if (!tournament) notFound();
  const activeTab: TabId = isTab(query.tab) ? query.tab : 'overview';

  return (
    <main className="shell">
      <SiteHeader compact />
      <TournamentHero tournament={tournament} />
      <div className="detailNavWrap">
        <nav className="detailTabs pageContainer" aria-label="Разделы турнира">
          {tabs.map((tab) => (
            <Link
              className={activeTab === tab.id ? 'isActive' : ''}
              href={`/tournaments/${tournament.slug}?tab=${tab.id}`}
              key={tab.id}
            >
              {tab.label}
              {tab.id === 'participants' && <span>{tournament.teams.length}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <section className="detailContent pageContainer">
        {activeTab === 'overview' && <Overview tournament={tournament} />}
        {activeTab === 'participants' && <Participants tournament={tournament} />}
        {activeTab === 'bracket' && <BracketBoard tournament={tournament} />}
        {activeTab === 'matches' && <Matches tournament={tournament} />}
        {activeTab === 'rules' && <Rules tournament={tournament} />}
        {activeTab === 'stream' && <Stream tournament={tournament} />}
      </section>
    </main>
  );
}
