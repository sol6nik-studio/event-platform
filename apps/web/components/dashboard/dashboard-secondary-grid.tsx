import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  CheckCircle2,
  Gamepad2,
  Swords,
  UsersRound,
} from 'lucide-react';

const rosterInitials = ['NF', 'MR', 'LN', 'KD', 'VC', '+1'];

const deadlines = [
  {
    date: 'Сегодня',
    title: 'Матч против Crimson Guard',
    detail: '20:00 · комната откроется в 19:45',
    current: true,
  },
  {
    date: '5 сен',
    title: 'Окончание проверки состава',
    detail: '17:30 · Northern Nexus Cup',
    current: false,
  },
  {
    date: '11 сен',
    title: 'Закрытие регистрации',
    detail: '20:00 · Rift Challengers',
    current: false,
  },
];

export function DashboardSecondaryGrid() {
  return (
    <div className="dashboardSecondaryGrid">
      <TeamCard />
      <DeadlineCard />
      <ActivityCard />
    </div>
  );
}

function TeamCard() {
  return (
    <section className="dashboardPanel dashboardTeamPanel panel" id="team">
      <div className="dashboardPanelHead">
        <div>
          <span className="dashboardKicker">КОМАНДА</span>
          <h2>Aurora Five</h2>
        </div>
        <UsersRound size={20} />
      </div>
      <div className="dashboardRosterSummary">
        <span className="dashboardTeamMark">A5</span>
        <div>
          <strong>5 основных · 1 запасной</strong>
          <span>EU · Dota 2 · вы капитан</span>
        </div>
        <span className="dashboardStatus dashboardStatusReady">
          <Check size={12} /> Состав готов
        </span>
      </div>
      <div className="dashboardAvatarStack" aria-label="Участники Aurora Five">
        {rosterInitials.map((initials, index) => (
          <span className={index === rosterInitials.length - 1 ? 'isMore' : ''} key={initials}>
            {initials}
          </span>
        ))}
      </div>
      <Link className="dashboardTextLink" href="/profile?tab=accounts">
        Проверить игровые аккаунты <ArrowRight size={15} />
      </Link>
    </section>
  );
}

function DeadlineCard() {
  return (
    <section className="dashboardPanel dashboardTimelinePanel panel">
      <div className="dashboardPanelHead">
        <div>
          <span className="dashboardKicker">РАСПИСАНИЕ</span>
          <h2>Ближайшие сроки</h2>
        </div>
        <CalendarClock size={20} />
      </div>
      <ol className="dashboardTimeline">
        {deadlines.map((deadline) => (
          <li
            className={deadline.current ? 'isCurrent' : ''}
            key={`${deadline.date}-${deadline.title}`}
          >
            <span>{deadline.date}</span>
            <div>
              <strong>{deadline.title}</strong>
              <small>{deadline.detail}</small>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function ActivityCard() {
  return (
    <section className="dashboardPanel dashboardFeedPanel panel">
      <div className="dashboardPanelHead">
        <div>
          <span className="dashboardKicker">УВЕДОМЛЕНИЯ</span>
          <h2>Последние события</h2>
        </div>
        <Bell size={20} />
      </div>
      <div className="dashboardFeed">
        <div>
          <span className="feedIcon feedIconWarning">
            <Gamepad2 size={15} />
          </span>
          <span>
            <strong>Требуется проверка Steam ID</strong>
            <small>12 минут назад</small>
          </span>
        </div>
        <div>
          <span className="feedIcon">
            <Swords size={15} />
          </span>
          <span>
            <strong>Назначен соперник следующего матча</strong>
            <small>1 час назад</small>
          </span>
        </div>
        <div>
          <span className="feedIcon feedIconSuccess">
            <CheckCircle2 size={15} />
          </span>
          <span>
            <strong>Результат матча подтверждён</strong>
            <small>Вчера, 22:14</small>
          </span>
        </div>
      </div>
      <Link className="dashboardTextLink" href="/profile?tab=notifications">
        Настроить уведомления <ArrowRight size={15} />
      </Link>
    </section>
  );
}
