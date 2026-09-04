'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { TournamentCard } from './tournament-card';
import type { Tournament, TournamentStatus } from '../lib/mock-data';

type CatalogView = 'ALL' | TournamentStatus;

const views: { value: CatalogView; label: string }[] = [
  { value: 'ALL', label: 'Все' },
  { value: 'REGISTRATION_OPEN', label: 'Регистрация' },
  { value: 'LIVE', label: 'В эфире' },
  { value: 'PUBLISHED', label: 'Скоро' },
  { value: 'COMPLETED', label: 'Прошедшие' },
];

export function TournamentCatalog({ tournaments }: { tournaments: Tournament[] }) {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<CatalogView>('ALL');
  const [game, setGame] = useState('Все игры');
  const games = ['Все игры', ...new Set(tournaments.map((tournament) => tournament.game))];

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('ru');
    return tournaments.filter((tournament) => {
      const matchesView = view === 'ALL' || tournament.status === view;
      const matchesGame = game === 'Все игры' || tournament.game === game;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [tournament.name, tournament.game, tournament.region, tournament.organizer]
          .join(' ')
          .toLocaleLowerCase('ru')
          .includes(normalizedQuery);
      return matchesView && matchesGame && matchesQuery;
    });
  }, [game, query, tournaments, view]);

  function resetFilters() {
    setQuery('');
    setView('ALL');
    setGame('Все игры');
  }

  return (
    <>
      <div className="catalogToolbar">
        <label className="searchField">
          <Search size={18} />
          <span className="srOnly">Найти турнир</span>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
            }}
            placeholder="Название, игра или организатор"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
              }}
              aria-label="Очистить поиск"
            >
              <X size={16} />
            </button>
          )}
        </label>
        <label className="selectField">
          <SlidersHorizontal size={17} />
          <span className="srOnly">Фильтр по игре</span>
          <select
            value={game}
            onChange={(event) => {
              setGame(event.target.value);
            }}
          >
            {games.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="filterTabs" aria-label="Статус турнира">
        {views.map((item) => (
          <button
            className={view === item.value ? 'isActive' : ''}
            key={item.value}
            type="button"
            onClick={() => {
              setView(item.value);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="resultsBar">
        <span>
          Найдено: <strong>{filtered.length}</strong>
        </span>
        <span>По ближайшей дате</span>
      </div>
      {filtered.length > 0 ? (
        <div className="tournamentGrid catalogGrid">
          {filtered.map((tournament) => (
            <TournamentCard tournament={tournament} key={tournament.slug} />
          ))}
        </div>
      ) : (
        <div className="emptyState">
          <Search size={26} />
          <h2>Турниры не найдены</h2>
          <p>Попробуйте изменить запрос или сбросить выбранные фильтры.</p>
          <button className="button buttonSecondary" type="button" onClick={resetFilters}>
            Сбросить фильтры
          </button>
        </div>
      )}
    </>
  );
}
