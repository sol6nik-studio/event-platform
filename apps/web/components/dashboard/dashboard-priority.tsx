import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldAlert, Zap } from 'lucide-react';

export function DashboardPriority() {
  return (
    <section className="dashboardPriority panel">
      <div className="priorityMarker" aria-hidden="true">
        <Zap size={22} />
      </div>
      <div className="priorityCopy">
        <span className="dashboardKicker">СЛЕДУЮЩЕЕ ДЕЙСТВИЕ · ДО 5 СЕНТЯБРЯ, 17:30</span>
        <h2>Завершите проверку игрового аккаунта</h2>
        <p>Для участия Aurora Five в Northern Nexus Cup капитану нужен подтверждённый Steam ID.</p>
        <div className="priorityChecks" aria-label="Готовность к турниру">
          <span>
            <CheckCircle2 size={14} /> Состав 5/5
          </span>
          <span>
            <CheckCircle2 size={14} /> Правила приняты
          </span>
          <span className="hasWarning">
            <ShieldAlert size={14} /> 1 аккаунт ожидает проверки
          </span>
        </div>
      </div>
      <div className="priorityProgress" aria-label="Готовность 86 процентов">
        <strong>86%</strong>
        <span>готово</span>
      </div>
      <Link className="button buttonPrimary" href="/profile?tab=accounts">
        Продолжить <ArrowRight size={16} />
      </Link>
    </section>
  );
}
