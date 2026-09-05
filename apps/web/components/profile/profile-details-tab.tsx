import type { SyntheticEvent } from 'react';
import { CircleUserRound, Mail, MapPin, Save, UserRound } from 'lucide-react';
import type { ProfileDetails } from './profile-types';

export function ProfileDetailsTab({
  details,
  onChange,
  onSubmit,
}: {
  details: ProfileDetails;
  onChange: (field: keyof ProfileDetails, value: string) => void;
  onSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
}) {
  return (
    <form
      className="settingsStack"
      id="profile-panel-profile"
      role="tabpanel"
      aria-labelledby="profile-tab-profile"
      onSubmit={onSubmit}
    >
      <section className="settingsPanel panel">
        <div className="settingsPanelHead">
          <div>
            <h2>Основная информация</h2>
            <p>Эти данные отображаются в профиле, командах и матчах.</p>
          </div>
          <CircleUserRound size={20} />
        </div>
        <div className="settingsFormGrid">
          <label className="fieldGroup">
            <span>Отображаемое имя</span>
            <span className="inputShell">
              <UserRound size={16} />
              <input
                value={details.displayName}
                onChange={(event) => {
                  onChange('displayName', event.target.value);
                }}
                minLength={2}
                maxLength={48}
                required
              />
            </span>
          </label>
          <label className="fieldGroup">
            <span>Никнейм</span>
            <span className="inputShell inputWithPrefix">
              <b>@</b>
              <input
                value={details.username}
                onChange={(event) => {
                  onChange('username', event.target.value);
                }}
                pattern="[a-zA-Z0-9_]{3,32}"
                required
              />
            </span>
          </label>
          <label className="fieldGroup settingsFullWidth">
            <span>Email</span>
            <span className="inputShell">
              <Mail size={16} />
              <input
                type="email"
                value={details.email}
                onChange={(event) => {
                  onChange('email', event.target.value);
                }}
                required
              />
              <small className="inlineVerified">Подтверждён</small>
            </span>
            <small>После смены адреса потребуется повторное подтверждение.</small>
          </label>
          <label className="fieldGroup settingsFullWidth">
            <span>О себе</span>
            <textarea
              value={details.bio}
              onChange={(event) => {
                onChange('bio', event.target.value);
              }}
              maxLength={280}
              rows={4}
            />
            <small>{details.bio.length}/280 символов</small>
          </label>
        </div>
      </section>

      <section className="settingsPanel panel">
        <div className="settingsPanelHead">
          <div>
            <h2>Регион и предпочтения</h2>
            <p>Влияют на время, язык и рекомендации турниров.</p>
          </div>
          <MapPin size={20} />
        </div>
        <div className="settingsFormGrid">
          <label className="fieldGroup">
            <span>Регион</span>
            <select
              value={details.region}
              onChange={(event) => {
                onChange('region', event.target.value);
              }}
            >
              <option>EU · CIS</option>
              <option>EU West</option>
              <option>Global</option>
              <option>Asia</option>
            </select>
          </label>
          <label className="fieldGroup">
            <span>Основная игра</span>
            <select
              value={details.mainGame}
              onChange={(event) => {
                onChange('mainGame', event.target.value);
              }}
            >
              <option>Dota 2</option>
              <option>League of Legends</option>
              <option>Brawl Stars</option>
              <option>Clash Royale</option>
            </select>
          </label>
          <label className="fieldGroup">
            <span>Язык интерфейса</span>
            <select
              value={details.language}
              onChange={(event) => {
                onChange('language', event.target.value);
              }}
            >
              <option>Русский</option>
              <option>English</option>
            </select>
          </label>
          <label className="fieldGroup">
            <span>Часовой пояс</span>
            <select
              value={details.timezone}
              onChange={(event) => {
                onChange('timezone', event.target.value);
              }}
            >
              <option>Europe/Moscow</option>
              <option>Europe/Berlin</option>
              <option>Asia/Almaty</option>
              <option>UTC</option>
            </select>
          </label>
        </div>
      </section>
      <div className="settingsActions">
        <span>Изменения применятся ко всем устройствам.</span>
        <button className="button buttonPrimary" type="submit">
          <Save size={16} /> Сохранить профиль
        </button>
      </div>
    </form>
  );
}
