import { ChevronRight, Save, Shield } from 'lucide-react';
import { privacyOptions } from './profile-data';
import type { PrivacyPreferences } from './profile-types';
import { Toggle } from './toggle';

export function PrivacyTab({
  displayName,
  initials,
  preferences,
  username,
  onChange,
  onSave,
}: {
  displayName: string;
  initials: string;
  preferences: PrivacyPreferences;
  username: string;
  onChange: (key: keyof PrivacyPreferences, checked: boolean) => void;
  onSave: () => void;
}) {
  return (
    <div
      className="settingsStack"
      id="profile-panel-privacy"
      role="tabpanel"
      aria-labelledby="profile-tab-privacy"
    >
      <section className="settingsPanel panel">
        <div className="settingsPanelHead">
          <div>
            <h2>Видимость профиля</h2>
            <p>Контролируйте, что видят другие игроки и зрители.</p>
          </div>
          <Shield size={20} />
        </div>
        <div className="preferenceRows">
          {privacyOptions.map((option) => (
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
      <section className="privacyPreview panel">
        <div>
          <span className="sectionNumber">ПРЕДПРОСМОТР</span>
          <h3>Как вас видят другие</h3>
        </div>
        <div className="miniPublicProfile">
          <span className="profileAvatar">{initials}</span>
          <div>
            <strong>{preferences.publicProfile ? displayName : 'Скрытый игрок'}</strong>
            <span>@{username}</span>
            <small>{preferences.showTeams ? 'Aurora Five · Капитан' : 'Команды скрыты'}</small>
          </div>
          <ChevronRight size={18} />
        </div>
      </section>
      <div className="settingsActions">
        <span>Приватные данные и email не публикуются ни при каких настройках.</span>
        <button className="button buttonPrimary" type="button" onClick={onSave}>
          <Save size={16} /> Сохранить
        </button>
      </div>
    </div>
  );
}
