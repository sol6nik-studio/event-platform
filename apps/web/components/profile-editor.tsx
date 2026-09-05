'use client';

import { useState, type ChangeEvent, type ReactNode, type SyntheticEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  getUserDisplayName,
  getUserInitials,
  useBrowserSessionUser,
  type BrowserSessionUser,
} from '../lib/browser-session';
import type { ProfileTab } from '../lib/profile-tabs';
import { ConnectedAccountsTab } from './profile/connected-accounts-tab';
import { initialAccounts, initialSessions } from './profile/profile-data';
import {
  ProfilePageHeader,
  ProfilePrototypeNotice,
  ProfileSummary,
  ProfileTabs,
  SaveToast,
} from './profile/profile-chrome';
import { ProfileDetailsTab } from './profile/profile-details-tab';
import type {
  NotificationPreferences,
  PasswordFields,
  PrivacyPreferences,
  ProfileDetails,
} from './profile/profile-types';
import { NotificationsTab } from './profile/notifications-tab';
import { PrivacyTab } from './profile/privacy-tab';
import { SecurityTab } from './profile/security-tab';

const initialNotifications: NotificationPreferences = {
  matchStarts: true,
  matchResults: true,
  checkIn: true,
  invites: true,
  announcements: true,
  digest: false,
  email: true,
  push: true,
};

const initialPrivacy: PrivacyPreferences = {
  publicProfile: true,
  showTeams: true,
  showAccounts: false,
  showHistory: true,
  directInvites: true,
};

const initialPasswords: PasswordFields = { current: '', next: '', confirm: '' };

export function ProfileEditor({ initialTab }: { initialTab: ProfileTab }) {
  const sessionUser = useBrowserSessionUser();
  return (
    <ProfileEditorForm
      key={sessionUser?.id ?? sessionUser?.username ?? 'demo'}
      activeTab={initialTab}
      sessionUser={sessionUser}
    />
  );
}

function ProfileEditorForm({
  activeTab,
  sessionUser,
}: {
  activeTab: ProfileTab;
  sessionUser: BrowserSessionUser | null;
}) {
  const router = useRouter();
  const initialUsername = sessionUser?.username ?? 'north_captain';
  const [message, setMessage] = useState('');
  const [avatar, setAvatar] = useState('');
  const [details, setDetails] = useState<ProfileDetails>({
    displayName: sessionUser === null ? 'Nikita Frost' : getUserDisplayName(initialUsername),
    username: initialUsername,
    email: sessionUser?.email ?? 'captain@arena-grid.local',
    bio: 'Капитан Aurora Five. Играю на позиции carry, люблю длинные серии и честную конкуренцию.',
    region: 'EU · CIS',
    language: 'Русский',
    timezone: 'Europe/Moscow',
    mainGame: 'Dota 2',
  });
  const [accounts, setAccounts] = useState(initialAccounts);
  const [showAccountForm, setShowAccountForm] = useState(false);
  const [newGame, setNewGame] = useState('Brawl Stars');
  const [newNickname, setNewNickname] = useState('');
  const [notifications, setNotifications] = useState(initialNotifications);
  const [privacy, setPrivacy] = useState(initialPrivacy);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessions, setSessions] = useState(initialSessions);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [passwords, setPasswords] = useState(initialPasswords);
  const profileInitials = getUserInitials(details.username || details.displayName || 'AG');

  function showMessage(nextMessage: string) {
    setMessage(nextMessage);
  }

  function openTab(tab: ProfileTab) {
    setMessage('');
    router.replace(tab === 'profile' ? '/profile' : `/profile?tab=${tab}`, { scroll: false });
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showMessage('Файл слишком большой. Выберите изображение до 2 МБ.');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
        showMessage('Новый аватар выбран.');
      }
    });
    reader.readAsDataURL(file);
  }

  function handleProfileSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    showMessage('Прототип: изменения сохранены локально до перезагрузки страницы.');
  }

  function handleAccountSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    const normalizedNickname = newNickname.trim();
    if (normalizedNickname.length === 0) return;
    setAccounts((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        game: newGame,
        nickname: normalizedNickname,
        region: details.region.split(' ')[0] ?? 'EU',
        status: 'pending',
        accent: '#ffb547',
      },
    ]);
    setNewNickname('');
    setShowAccountForm(false);
    showMessage('Прототип: аккаунт добавлен локально, проверка провайдера не запускалась.');
  }

  function handlePasswordSubmit(event: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    event.preventDefault();
    if (passwords.next.length < 10) {
      showMessage('Новый пароль должен содержать не менее 10 символов.');
      return;
    }
    if (passwords.next !== passwords.confirm) {
      showMessage('Новые пароли не совпадают.');
      return;
    }
    setPasswords(initialPasswords);
    showMessage('Прототип: пароль не отправлялся на сервер и не был изменён.');
  }

  function renderActiveTab(): ReactNode {
    if (activeTab === 'profile') {
      return (
        <ProfileDetailsTab
          details={details}
          onChange={(field, value) => {
            setDetails((current) => ({ ...current, [field]: value }));
          }}
          onSubmit={handleProfileSubmit}
        />
      );
    }

    if (activeTab === 'accounts') {
      return (
        <ConnectedAccountsTab
          accounts={accounts}
          newGame={newGame}
          newNickname={newNickname}
          showAccountForm={showAccountForm}
          onAccountChange={(id, nickname) => {
            setAccounts((current) =>
              current.map((account) => (account.id === id ? { ...account, nickname } : account)),
            );
          }}
          onAccountRemove={(account) => {
            setAccounts((current) => current.filter((item) => item.id !== account.id));
            showMessage(`${account.game}: аккаунт удалён из локального предпросмотра.`);
          }}
          onAccountSubmit={handleAccountSubmit}
          onFormToggle={() => {
            setShowAccountForm((visible) => !visible);
          }}
          onNewGameChange={setNewGame}
          onNewNicknameChange={setNewNickname}
        />
      );
    }

    if (activeTab === 'notifications') {
      return (
        <NotificationsTab
          email={details.email}
          preferences={notifications}
          onChange={(key, checked) => {
            setNotifications((current) => ({ ...current, [key]: checked }));
          }}
          onSave={() => {
            showMessage('Прототип: настройки уведомлений сохранены локально.');
          }}
        />
      );
    }

    if (activeTab === 'privacy') {
      return (
        <PrivacyTab
          displayName={details.displayName}
          initials={profileInitials}
          preferences={privacy}
          username={details.username}
          onChange={(key, checked) => {
            setPrivacy((current) => ({ ...current, [key]: checked }));
          }}
          onSave={() => {
            showMessage('Прототип: настройки приватности сохранены локально.');
          }}
        />
      );
    }

    return (
      <SecurityTab
        deleteConfirm={deleteConfirm}
        passwords={passwords}
        sessions={sessions}
        twoFactor={twoFactor}
        onDeleteCancel={() => {
          setDeleteConfirm(false);
        }}
        onDeleteConfirm={() => {
          showMessage('Демо-режим: аккаунт не был удалён.');
          setDeleteConfirm(false);
        }}
        onDeleteRequest={() => {
          setDeleteConfirm(true);
        }}
        onEndOtherSessions={() => {
          setSessions((current) => current.filter((session) => session.current));
          showMessage('Прототип: остальные сессии скрыты из локального списка.');
        }}
        onEndSession={(sessionId) => {
          setSessions((current) => current.filter((session) => session.id !== sessionId));
          showMessage('Прототип: сессия скрыта из локального списка.');
        }}
        onPasswordChange={(field, value) => {
          setPasswords((current) => ({ ...current, [field]: value }));
        }}
        onPasswordSubmit={handlePasswordSubmit}
        onTwoFactorToggle={() => {
          setTwoFactor((enabled) => !enabled);
          showMessage(
            twoFactor
              ? 'Прототип: 2FA отключена только в локальном предпросмотре.'
              : 'Прототип: 2FA включена только в локальном предпросмотре.',
          );
        }}
      />
    );
  }

  return (
    <>
      <SaveToast
        message={message}
        onClose={() => {
          setMessage('');
        }}
      />
      <ProfilePageHeader />
      <ProfilePrototypeNotice />
      <ProfileSummary
        avatar={avatar}
        displayName={details.displayName}
        initials={profileInitials}
        region={details.region}
        username={details.username}
        onAvatarChange={handleAvatarChange}
      />
      <ProfileTabs activeTab={activeTab} onTabChange={openTab} />
      {renderActiveTab()}
    </>
  );
}
