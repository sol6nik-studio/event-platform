import type { CSSProperties, SyntheticEvent } from 'react';
import { Check, Gamepad2, Link2, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import type { GameAccount } from './profile-types';

export function ConnectedAccountsTab({
  accounts,
  newGame,
  newNickname,
  showAccountForm,
  onAccountChange,
  onAccountRemove,
  onAccountSubmit,
  onFormToggle,
  onNewGameChange,
  onNewNicknameChange,
}: {
  accounts: GameAccount[];
  newGame: string;
  newNickname: string;
  showAccountForm: boolean;
  onAccountChange: (id: string, nickname: string) => void;
  onAccountRemove: (account: GameAccount) => void;
  onAccountSubmit: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
  onFormToggle: () => void;
  onNewGameChange: (game: string) => void;
  onNewNicknameChange: (nickname: string) => void;
}) {
  return (
    <div
      className="settingsStack"
      id="profile-panel-accounts"
      role="tabpanel"
      aria-labelledby="profile-tab-accounts"
    >
      <section className="settingsPanel panel">
        <div className="settingsPanelHead">
          <div>
            <h2>Игровые аккаунты</h2>
            <p>Привяжите аккаунты для автоматической проверки участия и результатов.</p>
          </div>
          <button className="button buttonSecondary" type="button" onClick={onFormToggle}>
            <Plus size={15} /> Добавить аккаунт
          </button>
        </div>
        {showAccountForm ? (
          <form className="addAccountForm" onSubmit={onAccountSubmit}>
            <label className="fieldGroup">
              <span>Игра</span>
              <select
                value={newGame}
                onChange={(event) => {
                  onNewGameChange(event.target.value);
                }}
              >
                <option>Brawl Stars</option>
                <option>Clash Royale</option>
                <option>Dota 2</option>
                <option>League of Legends</option>
              </select>
            </label>
            <label className="fieldGroup">
              <span>Никнейм / ID</span>
              <span className="inputShell">
                <Gamepad2 size={16} />
                <input
                  value={newNickname}
                  onChange={(event) => {
                    onNewNicknameChange(event.target.value);
                  }}
                  placeholder="Игровой идентификатор"
                  required
                />
              </span>
            </label>
            <button className="button buttonPrimary" type="submit">
              <Link2 size={15} /> Подключить
            </button>
          </form>
        ) : null}
        <div className="connectedAccounts">
          {accounts.map((account) => (
            <article className="connectedAccount" key={account.id}>
              <div
                className="gameAccountMark"
                style={{ '--account-accent': account.accent } as CSSProperties}
              >
                {getGameInitials(account.game)}
              </div>
              <div className="accountDetails">
                <span>{account.game}</span>
                <input
                  value={account.nickname}
                  aria-label={`Никнейм ${account.game}`}
                  onChange={(event) => {
                    onAccountChange(account.id, event.target.value);
                  }}
                />
                <small>{account.region} · основной</small>
              </div>
              <span className={`accountStatus accountStatus-${account.status}`}>
                {account.status === 'verified' ? (
                  <>
                    <Check size={12} /> Проверен
                  </>
                ) : (
                  'На проверке'
                )}
              </span>
              <button
                className="removeAccount"
                type="button"
                aria-label={`Удалить аккаунт ${account.game}`}
                onClick={() => {
                  onAccountRemove(account);
                }}
              >
                <Trash2 size={15} />
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="accountHint panel">
        <ShieldCheck size={21} />
        <div>
          <h3>Зачем нужна проверка?</h3>
          <p>
            Проверенный аккаунт подтверждает право играть в составе и позволяет получать результаты
            от игрового провайдера.
          </p>
        </div>
      </section>
    </div>
  );
}

function getGameInitials(game: string) {
  return game
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
}
