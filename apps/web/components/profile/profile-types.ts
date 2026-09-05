export interface GameAccount {
  id: string;
  game: string;
  nickname: string;
  region: string;
  status: 'verified' | 'pending';
  accent: string;
}

export interface SessionItem {
  id: string;
  device: string;
  location: string;
  lastSeen: string;
  current: boolean;
  mobile: boolean;
}

export interface ProfileDetails {
  displayName: string;
  username: string;
  email: string;
  bio: string;
  region: string;
  language: string;
  timezone: string;
  mainGame: string;
}

export interface NotificationPreferences {
  matchStarts: boolean;
  matchResults: boolean;
  checkIn: boolean;
  invites: boolean;
  announcements: boolean;
  digest: boolean;
  email: boolean;
  push: boolean;
}

export interface PrivacyPreferences {
  publicProfile: boolean;
  showTeams: boolean;
  showAccounts: boolean;
  showHistory: boolean;
  directInvites: boolean;
}

export interface PasswordFields {
  current: string;
  next: string;
  confirm: string;
}
