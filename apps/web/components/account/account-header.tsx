import Link from 'next/link';
import { Bell } from 'lucide-react';
import { AccountIdentity } from '../account-session-controls';
import { Brand } from '../site-header';

export function AccountHeader() {
  return (
    <header className="accountHeader">
      <Brand />
      <div className="accountHeaderRight">
        <Link className="button buttonGhost accountCreate" href="/organizer/tournaments/new">
          Создать турнир
        </Link>
        <Link className="iconButton" href="/profile?tab=notifications" aria-label="Уведомления">
          <Bell size={17} />
          <span className="notificationDot" />
        </Link>
        <AccountIdentity />
      </div>
    </header>
  );
}
