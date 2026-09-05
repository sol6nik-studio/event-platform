import type { ComponentType } from 'react';
import Link from 'next/link';
import {
  Bell,
  CalendarDays,
  Gamepad2,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Swords,
  UsersRound,
} from 'lucide-react';
import { AccountLogout } from '../account-session-controls';

export type AccountSection = 'dashboard' | 'settings';

interface NavigationItem {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  badge?: string;
}

const primaryNavigation: NavigationItem[] = [
  { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { href: '/tournaments', label: 'Турниры', icon: CalendarDays },
  { href: '/tournaments/northern-nexus-cup?tab=matches', label: 'Матчи', icon: Swords },
  { href: '/dashboard#team', label: 'Команда', icon: UsersRound },
  { href: '/profile?tab=accounts', label: 'Игровые аккаунты', icon: Gamepad2 },
  { href: '/profile?tab=notifications', label: 'Уведомления', icon: Bell, badge: '3' },
];

const mobileNavigation: NavigationItem[] = [
  { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { href: '/tournaments', label: 'Турниры', icon: CalendarDays },
  { href: '/tournaments/northern-nexus-cup?tab=matches', label: 'Матчи', icon: Swords },
  { href: '/dashboard#team', label: 'Команда', icon: UsersRound },
  { href: '/profile', label: 'Настройки', icon: Settings },
];

export function AccountSidebar({ active }: { active: AccountSection }) {
  return (
    <aside className="accountSidebar">
      <nav aria-label="Личный кабинет">
        {primaryNavigation.map((item) => (
          <AccountNavigationLink
            active={item.href === '/dashboard' && active === 'dashboard'}
            item={item}
            key={item.href}
          />
        ))}
      </nav>
      <div className="sidebarBottom">
        <Link className={active === 'settings' ? 'isActive' : ''} href="/profile">
          <Settings size={17} /> <span>Настройки</span>
        </Link>
        <AccountLogout />
        <div className="securityNote">
          <ShieldCheck size={16} />
          <span>
            <strong>Аккаунт защищён</strong>
            <small>Email подтверждён</small>
          </span>
        </div>
      </div>
    </aside>
  );
}

export function AccountMobileNavigation({ active }: { active: AccountSection }) {
  return (
    <nav className="accountMobileNav" aria-label="Основная навигация">
      {mobileNavigation.map((item) => {
        const isActive =
          (item.href === '/dashboard' && active === 'dashboard') ||
          (item.href === '/profile' && active === 'settings');
        return <AccountNavigationLink active={isActive} item={item} key={item.href} />;
      })}
    </nav>
  );
}

function AccountNavigationLink({ active, item }: { active: boolean; item: NavigationItem }) {
  const Icon = item.icon;
  return (
    <Link
      className={active ? 'isActive' : ''}
      href={item.href}
      aria-current={active ? 'page' : undefined}
    >
      <Icon size={17} /> <span>{item.label}</span>
      {item.badge ? <b>{item.badge}</b> : null}
    </Link>
  );
}
