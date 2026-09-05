'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  clearBrowserSession,
  getDisplayRole,
  getUserDisplayName,
  getUserInitials,
  useBrowserSessionUser,
} from '../lib/browser-session';

const demoUsername = 'north_captain';

export function AccountIdentity() {
  const user = useBrowserSessionUser();
  const username = user?.username ?? demoUsername;

  return (
    <div className="headerUser">
      <span className="profileAvatar profileAvatarSmall">{getUserInitials(username)}</span>
      <span>
        <strong>{username}</strong>
        <small>{getDisplayRole(user?.roles ?? ['TEAM_CAPTAIN'])}</small>
      </span>
    </div>
  );
}

export function AccountGreeting() {
  const user = useBrowserSessionUser();
  const username = user?.username ?? demoUsername;
  const name = user === null ? 'Никита' : getUserDisplayName(username);
  return <>{name}</>;
}

export function AccountLogout() {
  const router = useRouter();

  return (
    <button
      className="sidebarLogout"
      type="button"
      onClick={() => {
        clearBrowserSession();
        router.replace('/auth/sign-in');
      }}
    >
      <LogOut size={17} /> <span>Выйти</span>
    </button>
  );
}
