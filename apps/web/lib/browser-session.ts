import { useMemo, useSyncExternalStore } from 'react';

const accessTokenKey = 'arena-grid-access-token:v1';
const userKey = 'arena-grid-user:v1';
const legacyAccessTokenKey = 'arena-grid-access-token';
const legacyUserKey = 'arena-grid-user';
const subscribers = new Set<() => void>();
let cachedUserSnapshot: string | null | undefined;

export interface BrowserSessionUser {
  id?: string;
  username: string;
  email: string;
  roles?: string[];
}

function getUserSnapshot() {
  if (typeof window === 'undefined') return null;
  if (cachedUserSnapshot !== undefined) return cachedUserSnapshot;
  try {
    const currentValue = window.localStorage.getItem(userKey);
    const legacyValue = currentValue === null ? window.localStorage.getItem(legacyUserKey) : null;
    cachedUserSnapshot = currentValue ?? legacyValue;
    if (currentValue === null && legacyValue !== null) {
      window.localStorage.setItem(userKey, legacyValue);
      window.localStorage.removeItem(legacyUserKey);
      const legacyAccessToken = window.localStorage.getItem(legacyAccessTokenKey);
      if (legacyAccessToken !== null) {
        window.localStorage.setItem(accessTokenKey, legacyAccessToken);
        window.localStorage.removeItem(legacyAccessTokenKey);
      }
    }
  } catch {
    cachedUserSnapshot = null;
  }
  return cachedUserSnapshot;
}

function subscribeToUser(onStoreChange: () => void) {
  subscribers.add(onStoreChange);
  if (subscribers.size === 1) window.addEventListener('storage', handleStorageChange);
  return () => {
    subscribers.delete(onStoreChange);
    if (subscribers.size === 0) window.removeEventListener('storage', handleStorageChange);
  };
}

function handleStorageChange(event: StorageEvent) {
  if (event.key !== userKey && event.key !== legacyUserKey && event.key !== null) return;
  cachedUserSnapshot = undefined;
  notifySubscribers();
}

function notifySubscribers() {
  subscribers.forEach((subscriber) => {
    subscriber();
  });
}

function parseUser(value: string | null): BrowserSessionUser | null {
  if (value === null) return null;
  try {
    const candidate = JSON.parse(value) as unknown;
    if (typeof candidate !== 'object' || candidate === null) return null;
    const user = candidate as BrowserSessionUser;
    if (typeof user.username !== 'string' || typeof user.email !== 'string') return null;
    return user;
  } catch {
    return null;
  }
}

export function useBrowserSessionUser() {
  const snapshot = useSyncExternalStore(subscribeToUser, getUserSnapshot, () => null);
  return useMemo(() => parseUser(snapshot), [snapshot]);
}

export function storeBrowserSession(accessToken: string, user: BrowserSessionUser) {
  try {
    const storedUser: BrowserSessionUser = {
      ...(user.id ? { id: user.id } : {}),
      username: user.username,
      email: user.email,
      ...(user.roles ? { roles: user.roles } : {}),
    };
    cachedUserSnapshot = JSON.stringify(storedUser);
    window.localStorage.setItem(accessTokenKey, accessToken);
    window.localStorage.setItem(userKey, cachedUserSnapshot);
    window.localStorage.removeItem(legacyAccessTokenKey);
    window.localStorage.removeItem(legacyUserKey);
    notifySubscribers();
    return true;
  } catch {
    try {
      window.localStorage.removeItem(accessTokenKey);
      window.localStorage.removeItem(userKey);
    } catch {
      // Storage remains unavailable; no persisted session can be trusted.
    }
    cachedUserSnapshot = null;
    return false;
  }
}

export function clearBrowserSession() {
  try {
    window.localStorage.removeItem(accessTokenKey);
    window.localStorage.removeItem(userKey);
    window.localStorage.removeItem(legacyAccessTokenKey);
    window.localStorage.removeItem(legacyUserKey);
  } catch {
    // Storage may be disabled; the in-memory session still needs to be cleared.
  }
  cachedUserSnapshot = null;
  notifySubscribers();
}

export function getDisplayRole(roles: string[] | undefined) {
  if (roles?.includes('PLATFORM_ADMIN')) return 'Администратор';
  if (roles?.includes('ORGANIZER')) return 'Организатор';
  if (roles?.includes('MODERATOR')) return 'Модератор';
  if (roles?.includes('TEAM_CAPTAIN')) return 'Капитан';
  if (roles?.includes('SPECTATOR')) return 'Зритель';
  return 'Игрок';
}

export function getUserInitials(username: string) {
  return username
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toLocaleUpperCase('ru');
}

export function getUserDisplayName(username: string) {
  return username
    .split(/[_-]+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toLocaleUpperCase('ru') ?? ''}${part.slice(1)}`)
    .join(' ');
}
