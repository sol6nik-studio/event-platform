import { Bell, Save } from 'lucide-react';
import { notificationOptions } from './profile-data';
import type { NotificationPreferences } from './profile-types';
import { Toggle } from './toggle';

export function NotificationsTab({
  email,
  preferences,
  onChange,
  onSave,
}: {
  email: string;
  preferences: NotificationPreferences;
  onChange: (key: keyof NotificationPreferences, checked: boolean) => void;
  onSave: () => void;
}) {
  return (
    <div
      className="settingsStack"
      id="profile-panel-notifications"
      role="tabpanel"
      aria-labelledby="profile-tab-notifications"
    >
      <section className="settingsPanel panel">
        <div className="settingsPanelHead">
          <div>
            <h2>События</h2>
            <p>Выберите, о чём платформа должна напоминать.</p>
          </div>
          <Bell size={20} />
        </div>
        <div className="preferenceRows">
          {notificationOptions.map((option) => (
            <div className="preferenceRow" key={option.key}>
              <span>
                <strong>{option.title}</strong>
                <small>{option.description}</small>
              </span>
              <Toggle
                label={option.title}
                checked={preferences[option.key]}
                onChange={(checked) => {
                  onChange(option.key, checked);
                }}
              />
            </div>
          ))}
        </div>
      </section>
      <section className="settingsPanel panel">
        <div className="settingsPanelHead">
          <div>
            <h2>Каналы доставки</h2>
            <p>In-app уведомления включены всегда для критичных событий.</p>
          </div>
        </div>
        <div className="preferenceRows">
          <div className="preferenceRow">
            <span>
              <strong>Email</strong>
              <small>{email}</small>
            </span>
            <Toggle
              label="Email уведомления"
              checked={preferences.email}
              onChange={(checked) => {
                onChange('email', checked);
              }}
            />
          </div>
          <div className="preferenceRow">
            <span>
              <strong>Push-уведомления</strong>
              <small>Telegram Mini App и браузер</small>
            </span>
            <Toggle
              label="Push-уведомления"
              checked={preferences.push}
              onChange={(checked) => {
                onChange('push', checked);
              }}
            />
          </div>
        </div>
      </section>
      <div className="settingsActions">
        <span>Критичные изменения матча останутся в ленте уведомлений.</span>
        <button className="button buttonPrimary" type="button" onClick={onSave}>
          <Save size={16} /> Сохранить
        </button>
      </div>
    </div>
  );
}
