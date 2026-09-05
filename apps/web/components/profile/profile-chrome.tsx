import type { ChangeEvent, KeyboardEvent } from 'react';
import { CheckCircle2, Info, MapPin, ShieldCheck, Upload } from 'lucide-react';
import type { ProfileTab } from '../../lib/profile-tabs';
import { profileTabs } from './profile-data';

export function SaveToast({ message, onClose }: { message: string; onClose: () => void }) {
  if (message.length === 0) return null;
  return (
    <div className="saveToast" role="status">
      <CheckCircle2 size={17} />
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Закрыть сообщение">
        ×
      </button>
    </div>
  );
}

export function ProfilePageHeader() {
  return (
    <header className="profilePageHead">
      <div>
        <span className="sectionNumber">ЛИЧНЫЙ КАБИНЕТ</span>
        <h1>Настройки профиля</h1>
        <p>Управляйте публичными данными, аккаунтами и безопасностью.</p>
      </div>
      <div className="profileCompleteness">
        <span>Профиль заполнен</span>
        <strong>86%</strong>
        <div className="progressTrack">
          <span style={{ width: '86%' }} />
        </div>
      </div>
    </header>
  );
}

export function ProfilePrototypeNotice() {
  return (
    <div className="prototypeNotice" role="note">
      <Info size={17} />
      <span>
        <strong>Интерактивный прототип настроек</strong>
        Изменения на этой странице пока не отправляются в API и сбрасываются после обновления.
      </span>
    </div>
  );
}

export function ProfileSummary({
  avatar,
  displayName,
  initials,
  region,
  username,
  onAvatarChange,
}: {
  avatar: string;
  displayName: string;
  initials: string;
  region: string;
  username: string;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <section className="profileSummary panel">
      <div className="profileAvatarWrap">
        <span
          className="profileAvatar"
          style={avatar.length > 0 ? { backgroundImage: `url(${avatar})` } : undefined}
        >
          {avatar.length === 0 ? initials : null}
        </span>
        <label className="avatarUpload" title="Загрузить новый аватар">
          <Upload size={15} />
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onAvatarChange} />
        </label>
      </div>
      <div className="profileIdentity">
        <h2>{displayName}</h2>
        <span>@{username}</span>
        <div>
          <span>
            <ShieldCheck size={13} /> Капитан команды
          </span>
          <span>
            <MapPin size={13} /> {region}
          </span>
        </div>
      </div>
      <div className="profileStats">
        <div>
          <strong>24</strong>
          <span>Матча</span>
        </div>
        <div>
          <strong>62%</strong>
          <span>Побед</span>
        </div>
        <div>
          <strong>3</strong>
          <span>Приза</span>
        </div>
      </div>
    </section>
  );
}

export function ProfileTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, tabIndex: number) {
    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight') nextIndex = (tabIndex + 1) % profileTabs.length;
    if (event.key === 'ArrowLeft')
      nextIndex = (tabIndex - 1 + profileTabs.length) % profileTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = profileTabs.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    const nextTab = profileTabs[nextIndex];
    if (!nextTab) return;
    const tabButtons =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabButtons?.[nextIndex]?.focus();
    onTabChange(nextTab.id);
  }

  return (
    <div className="profileTabs" role="tablist" aria-label="Настройки профиля">
      {profileTabs.map((tab, tabIndex) => {
        const Icon = tab.icon;
        return (
          <button
            className={activeTab === tab.id ? 'isActive' : ''}
            type="button"
            role="tab"
            id={`profile-tab-${tab.id}`}
            aria-controls={`profile-panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            tabIndex={activeTab === tab.id ? 0 : -1}
            key={tab.id}
            onClick={() => {
              onTabChange(tab.id);
            }}
            onKeyDown={(event) => {
              handleKeyDown(event, tabIndex);
            }}
          >
            <Icon size={16} /> {tab.label}
          </button>
        );
      })}
    </div>
  );
}
