import { Bell, Gamepad2, KeyRound, Shield, UserRound, type LucideIcon } from 'lucide-react';
import type { ProfileTab } from '../../lib/profile-tabs';
import type {
  GameAccount,
  NotificationPreferences,
  PrivacyPreferences,
  SessionItem,
} from './profile-types';

export const profileTabs: { id: ProfileTab; label: string; icon: LucideIcon }[] = [
  { id: 'profile', label: 'Профиль', icon: UserRound },
  { id: 'accounts', label: 'Игровые аккаунты', icon: Gamepad2 },
  { id: 'notifications', label: 'Уведомления', icon: Bell },
  { id: 'privacy', label: 'Приватность', icon: Shield },
  { id: 'security', label: 'Безопасность', icon: KeyRound },
];

export const initialAccounts: GameAccount[] = [
  {
    id: 'steam-dota',
    game: 'Dota 2',
    nickname: 'NorthFrost',
    region: 'EU',
    status: 'verified',
    accent: '#35e6ff',
  },
  {
    id: 'riot-lol',
    game: 'League of Legends',
    nickname: 'NorthFrost#EUW',
    region: 'EUW',
    status: 'pending',
    accent: '#9b7cff',
  },
];

export const initialSessions: SessionItem[] = [
  {
    id: 'current',
    device: 'Chrome · macOS',
    location: 'Москва, RU',
    lastSeen: 'Сейчас',
    current: true,
    mobile: false,
  },
  {
    id: 'mobile',
    device: 'Telegram · iPhone',
    location: 'Москва, RU',
    lastSeen: 'Сегодня, 08:42',
    current: false,
    mobile: true,
  },
  {
    id: 'desktop',
    device: 'Firefox · Windows',
    location: 'Санкт-Петербург, RU',
    lastSeen: '30 августа, 21:10',
    current: false,
    mobile: false,
  },
];

export const notificationOptions: {
  key: keyof NotificationPreferences;
  title: string;
  description: string;
}[] = [
  {
    key: 'matchStarts',
    title: 'Начало матча',
    description: 'За 30 и 5 минут до назначенного времени',
  },
  {
    key: 'matchResults',
    title: 'Результаты и споры',
    description: 'Подтверждение счёта, решение судьи, продвижение',
  },
  {
    key: 'checkIn',
    title: 'Check-in и roster lock',
    description: 'Все критичные сроки участия команды',
  },
  { key: 'invites', title: 'Приглашения', description: 'Новые команды и запросы в состав' },
  {
    key: 'announcements',
    title: 'Объявления организаторов',
    description: 'Изменения расписания и важные сообщения',
  },
  {
    key: 'digest',
    title: 'Еженедельный дайджест',
    description: 'Подборка новых турниров каждую пятницу',
  },
];

export const privacyOptions: {
  key: keyof PrivacyPreferences;
  title: string;
  description: string;
}[] = [
  {
    key: 'publicProfile',
    title: 'Публичный профиль',
    description: 'Никнейм, регион и краткое описание',
  },
  {
    key: 'showTeams',
    title: 'Показывать команды',
    description: 'Текущие команды и роль в составе',
  },
  {
    key: 'showAccounts',
    title: 'Показывать игровые аккаунты',
    description: 'Никнеймы и статус проверки',
  },
  {
    key: 'showHistory',
    title: 'Показывать историю',
    description: 'Турниры, матчи и занятые места',
  },
  {
    key: 'directInvites',
    title: 'Разрешить приглашения',
    description: 'Капитаны смогут приглашать вас напрямую',
  },
];
