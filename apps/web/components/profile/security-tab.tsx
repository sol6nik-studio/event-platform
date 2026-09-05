import type { SyntheticEvent } from 'react';
import {
  AlertTriangle,
  KeyRound,
  Laptop,
  LockKeyhole,
  MonitorSmartphone,
  ShieldCheck,
  Smartphone,
  Trash2,
} from 'lucide-react';
import type { PasswordFields, SessionItem } from './profile-types';

export function SecurityTab({
  deleteConfirm,
  passwords,
  sessions,
  twoFactor,
  onDeleteCancel,
  onDeleteConfirm,
  onDeleteRequest,
  onEndOtherSessions,
  onEndSession,
  onPasswordChange,
  onPasswordSubmit,
  onTwoFactorToggle,
}: {
  deleteConfirm: boolean;
  passwords: PasswordFields;
  sessions: SessionItem[];
  twoFactor: boolean;
  onDeleteCancel: () => void;
  onDeleteConfirm: () => void;
  onDeleteRequest: () => void;
  onEndOtherSessions: () => void;
  onEndSession: (sessionId: string) => void;
  onPasswordChange: (field: keyof PasswordFields, value: string) => void;
  onPasswordSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
  onTwoFactorToggle: () => void;
}) {
  const hasOtherSessions = sessions.some((session) => !session.current);

  return (
    <div
      className="settingsStack"
      id="profile-panel-security"
      role="tabpanel"
      aria-labelledby="profile-tab-security"
    >
      <form className="settingsPanel panel" onSubmit={onPasswordSubmit}>
        <div className="settingsPanelHead">
          <div>
            <h2>Изменить пароль</h2>
            <p>После сохранения все остальные сессии будут завершены.</p>
          </div>
          <LockKeyhole size={20} />
        </div>
        <div className="settingsFormGrid passwordGrid">
          <label className="fieldGroup settingsFullWidth">
            <span>Текущий пароль</span>
            <span className="inputShell">
              <LockKeyhole size={16} />
              <input
                type="password"
                value={passwords.current}
                onChange={(event) => {
                  onPasswordChange('current', event.target.value);
                }}
                autoComplete="current-password"
                required
              />
            </span>
          </label>
          <label className="fieldGroup">
            <span>Новый пароль</span>
            <span className="inputShell">
              <KeyRound size={16} />
              <input
                type="password"
                value={passwords.next}
                onChange={(event) => {
                  onPasswordChange('next', event.target.value);
                }}
                minLength={10}
                autoComplete="new-password"
                required
              />
            </span>
          </label>
          <label className="fieldGroup">
            <span>Повторите пароль</span>
            <span className="inputShell">
              <KeyRound size={16} />
              <input
                type="password"
                value={passwords.confirm}
                onChange={(event) => {
                  onPasswordChange('confirm', event.target.value);
                }}
                minLength={10}
                autoComplete="new-password"
                required
              />
            </span>
          </label>
        </div>
        <div className="inlineFormActions">
          <span>Минимум 10 символов, рекомендуется уникальный пароль.</span>
          <button className="button buttonPrimary" type="submit">
            Обновить пароль
          </button>
        </div>
      </form>

      <section className="settingsPanel panel">
        <div className="preferenceRow twoFactorRow">
          <span className="securityIcon">
            <ShieldCheck size={20} />
          </span>
          <span>
            <strong>Двухфакторная аутентификация</strong>
            <small>
              {twoFactor
                ? 'Включена. Коды подтверждения будут запрашиваться при входе.'
                : 'Защитите аккаунт одноразовыми кодами из приложения.'}
            </small>
          </span>
          <button
            className={`button ${twoFactor ? 'buttonSecondary' : 'buttonPrimary'}`}
            type="button"
            onClick={onTwoFactorToggle}
          >
            {twoFactor ? 'Отключить' : 'Настроить 2FA'}
          </button>
        </div>
      </section>

      <section className="settingsPanel panel">
        <div className="settingsPanelHead">
          <div>
            <h2>Активные сессии</h2>
            <p>Устройства, на которых выполнен вход в ваш аккаунт.</p>
          </div>
          <MonitorSmartphone size={20} />
        </div>
        <div className="sessionList">
          {sessions.map((session) => (
            <div className="sessionRow" key={session.id}>
              <span className="sessionIcon">
                {session.mobile ? <Smartphone size={18} /> : <Laptop size={18} />}
              </span>
              <span>
                <strong>{session.device}</strong>
                <small>{session.location}</small>
              </span>
              <span className="sessionTime">
                {session.current ? <b>Текущая</b> : null}
                <small>{session.lastSeen}</small>
              </span>
              {session.current ? null : (
                <button
                  type="button"
                  onClick={() => {
                    onEndSession(session.id);
                  }}
                >
                  Завершить
                </button>
              )}
            </div>
          ))}
        </div>
        {hasOtherSessions ? (
          <div className="sessionsFooter">
            <button className="button buttonSecondary" type="button" onClick={onEndOtherSessions}>
              Завершить все остальные
            </button>
          </div>
        ) : null}
      </section>

      <section className="dangerZone panel">
        <div>
          <AlertTriangle size={20} />
          <span>
            <strong>Удалить аккаунт</strong>
            <small>Профиль станет недоступен, активные заявки будут отозваны.</small>
          </span>
        </div>
        {deleteConfirm ? (
          <div className="deleteConfirm">
            <span>Подтвердите необратимое действие</span>
            <button type="button" onClick={onDeleteConfirm}>
              Да, удалить
            </button>
            <button type="button" onClick={onDeleteCancel}>
              Отмена
            </button>
          </div>
        ) : (
          <button className="dangerButton" type="button" onClick={onDeleteRequest}>
            <Trash2 size={15} /> Удалить аккаунт
          </button>
        )}
      </section>
    </div>
  );
}
