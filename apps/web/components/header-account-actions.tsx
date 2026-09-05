'use client';

import Link from 'next/link';
import { LogIn, UserRound } from 'lucide-react';
import { getDisplayRole, getUserInitials, useBrowserSessionUser } from '../lib/browser-session';

export function HeaderAccountActions() {
  const user = useBrowserSessionUser();

  if (user === null) {
    return (
      <Link className="button buttonQuiet signInButton" href="/auth/sign-in">
        <LogIn size={17} />
        Войти
      </Link>
    );
  }

  return (
    <Link
      className="headerProfileButton"
      href="/profile"
      aria-label={`Открыть профиль ${user.username}`}
    >
      <span className="profileAvatar profileAvatarSmall" aria-hidden="true">
        {getUserInitials(user.username)}
      </span>
      <span className="headerProfileCopy">
        <strong>{user.username}</strong>
        <small>{getDisplayRole(user.roles)}</small>
      </span>
      <UserRound className="headerProfileIcon" size={15} aria-hidden="true" />
    </Link>
  );
}
