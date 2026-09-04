export type TournamentStatus = 'REGISTRATION_OPEN' | 'PUBLISHED' | 'LIVE' | 'COMPLETED';
export type MatchStatus = 'SCHEDULED' | 'READY' | 'LIVE' | 'COMPLETED';

export interface Player {
  nickname: string;
  role: 'Капитан' | 'Игрок' | 'Запасной';
  country: string;
  verified: boolean;
}

export interface Team {
  id: string;
  name: string;
  tag: string;
  seed: number;
  accent: string;
  region: string;
  record: string;
  members: Player[];
}

export interface MatchSlot {
  teamId?: string;
  label?: string;
  score?: number;
}

export interface BracketMatch {
  id: string;
  code: string;
  status: MatchStatus;
  scheduledAt: string;
  bestOf: number;
  first: MatchSlot;
  second: MatchSlot;
  destination?: string;
}

export interface BracketRound {
  id: string;
  name: string;
  matches: BracketMatch[];
}

export interface BracketStage {
  id: string;
  name: string;
  rounds: BracketRound[];
}

export interface TournamentRule {
  title: string;
  text: string;
}

export interface Placement {
  place: number;
  teamId: string;
  prize: string;
}

export interface Tournament {
  slug: string;
  name: string;
  game: string;
  gameShort: string;
  description: string;
  status: TournamentStatus;
  format: string;
  region: string;
  platform: string;
  teamSize: number;
  participantLimit: number;
  startAt: string;
  endAt: string;
  registrationEndsAt: string;
  sortDate: string;
  prizePool: string;
  prizeLabel: string;
  organizer: string;
  organizerVerified: boolean;
  accent: 'cyan' | 'violet' | 'amber' | 'green';
  tags: string[];
  streamUrl?: string;
  teams: Team[];
  bracket: BracketStage[];
  rules: TournamentRule[];
  placements: Placement[];
  stats: {
    matchesPlayed: number;
    totalMatches: number;
    viewers: string;
    averageDuration: string;
  };
}

const playerNames = [
  'frostbyte',
  'mira',
  'lunaris',
  'koda',
  'vector',
  'ember',
  'sable',
  'orbit',
  'nova',
  'raven',
  'pulse',
  'shiro',
  'aero',
  'flux',
  'lynx',
  'echo',
];

function roster(prefix: number, size: number): Player[] {
  return Array.from({ length: size + 1 }, (_, index) => ({
    nickname: playerNames[(prefix + index) % playerNames.length] ?? `player-${String(index + 1)}`,
    role: index === 0 ? 'Капитан' : index === size ? 'Запасной' : 'Игрок',
    country: ['RU', 'KZ', 'BY', 'AM', 'GE'][(prefix + index) % 5] ?? 'RU',
    verified: index !== size,
  }));
}

function team(
  id: string,
  name: string,
  tag: string,
  seed: number,
  accent: string,
  rosterOffset: number,
  size = 5,
  record = '0–0',
): Team {
  return {
    id,
    name,
    tag,
    seed,
    accent,
    region: seed % 3 === 0 ? 'CIS' : 'EU',
    record,
    members: roster(rosterOffset, size),
  };
}

const nexusTeams = [
  team('aurora-five', 'Aurora Five', 'A5', 1, '#5ee7f4', 0, 5, '3–0'),
  team('crimson-guard', 'Crimson Guard', 'CRG', 2, '#ff6678', 2, 5, '3–1'),
  team('vertex-core', 'Vertex Core', 'VTX', 3, '#a78bfa', 4, 5, '2–1'),
  team('nomad-protocol', 'Nomad Protocol', 'NMD', 4, '#ffba69', 6, 5, '2–2'),
  team('polar-division', 'Polar Division', 'PLR', 5, '#70a5ff', 8, 5, '1–2'),
  team('zero-signal', 'Zero Signal', 'ZERO', 6, '#6ee7a8', 10, 5, '1–2'),
  team('helios-unit', 'Helios Unit', 'HLX', 7, '#ffd166', 12, 5, '0–2'),
  team('night-shift', 'Night Shift', 'NS', 8, '#f18aff', 14, 5, '0–2'),
];

const riftTeams = [
  team('silver-comets', 'Silver Comets', 'SVC', 1, '#cbd5e1', 1),
  team('onyx-reign', 'Onyx Reign', 'ONX', 2, '#a78bfa', 3),
  team('red-canopy', 'Red Canopy', 'RCP', 3, '#fb7185', 5),
  team('cloud-temple', 'Cloud Temple', 'CLD', 4, '#60a5fa', 7),
  team('kinetic-five', 'Kinetic Five', 'KN5', 5, '#4ade80', 9),
  team('atlas-academy', 'Atlas Academy', 'ATL', 6, '#fbbf24', 11),
  team('moonlit', 'Moonlit', 'MOON', 7, '#c084fc', 13),
  team('wildcards', 'Wildcards', 'WILD', 8, '#2dd4bf', 15),
];

const strikeTeams = [
  team('tiny-titans', 'Tiny Titans', 'TT', 1, '#22d3ee', 0, 3),
  team('pixel-rush', 'Pixel Rush', 'PXR', 2, '#f472b6', 2, 3),
  team('neon-cubs', 'Neon Cubs', 'NCB', 3, '#a78bfa', 4, 3),
  team('tap-tactics', 'Tap Tactics', 'TAP', 4, '#facc15', 6, 3),
  team('supercellars', 'Supercellars', 'SCL', 5, '#4ade80', 8, 3),
  team('three-crowns', 'Three Crowns', '3CR', 6, '#fb7185', 10, 3),
  team('quick-cast', 'Quick Cast', 'QCS', 7, '#60a5fa', 12, 3),
  team('starline', 'Starline', 'STR', 8, '#e879f9', 14, 3),
];

const crownTeams = [
  team('crown-ivo', 'Ivo', 'IVO', 1, '#5ee7f4', 0, 1, '4–0'),
  team('crown-zen', 'Zenith', 'ZEN', 2, '#a78bfa', 2, 1, '3–1'),
  team('crown-mars', 'Marsel', 'MRS', 3, '#fb7185', 4, 1, '2–1'),
  team('crown-snow', 'Snow', 'SNW', 4, '#60a5fa', 6, 1, '2–1'),
  team('crown-fury', 'Fury', 'FRY', 5, '#fbbf24', 8, 1, '1–1'),
  team('crown-ice', 'Iceberg', 'ICE', 6, '#4ade80', 10, 1, '1–1'),
  team('crown-kot', 'Kotofey', 'KOT', 7, '#f472b6', 12, 1, '0–1'),
  team('crown-arch', 'Archon', 'ARC', 8, '#c084fc', 14, 1, '0–1'),
];

function slot(teamId: string, score?: number): MatchSlot {
  return { teamId, ...(score === undefined ? {} : { score }) };
}

function pending(label = 'Определится позже'): MatchSlot {
  return { label };
}

const sharedRules: TournamentRule[] = [
  {
    title: 'Честная игра',
    text: 'Запрещены сторонние программы, эксплуатация ошибок и передача аккаунта. Решение судьи фиксируется в истории матча.',
  },
  {
    title: 'Готовность к матчу',
    text: 'Команда должна подтвердить готовность за 15 минут до начала. Опоздание более чем на 10 минут может привести к техническому поражению.',
  },
  {
    title: 'Результат и спор',
    text: 'Капитан отправляет результат и подтверждение. Соперник может подтвердить счёт или открыть спор с приложенным доказательством.',
  },
];

const nexusBracket: BracketStage[] = [
  {
    id: 'upper',
    name: 'Верхняя сетка',
    rounds: [
      {
        id: 'ub-r1',
        name: 'Раунд 1',
        matches: [
          {
            id: 'n-1',
            code: 'UB R1 M1',
            status: 'COMPLETED',
            scheduledAt: '28 авг, 18:00',
            bestOf: 3,
            first: slot('aurora-five', 2),
            second: slot('night-shift', 0),
            destination: 'Победитель → UB R2 M1 · проигравший → LB R1 M1',
          },
          {
            id: 'n-2',
            code: 'UB R1 M2',
            status: 'COMPLETED',
            scheduledAt: '28 авг, 18:00',
            bestOf: 3,
            first: slot('nomad-protocol', 2),
            second: slot('polar-division', 1),
            destination: 'Победитель → UB R2 M1 · проигравший → LB R1 M1',
          },
          {
            id: 'n-3',
            code: 'UB R1 M3',
            status: 'COMPLETED',
            scheduledAt: '28 авг, 20:30',
            bestOf: 3,
            first: slot('crimson-guard', 2),
            second: slot('helios-unit', 0),
            destination: 'Победитель → UB R2 M2 · проигравший → LB R1 M2',
          },
          {
            id: 'n-4',
            code: 'UB R1 M4',
            status: 'COMPLETED',
            scheduledAt: '28 авг, 20:30',
            bestOf: 3,
            first: slot('vertex-core', 2),
            second: slot('zero-signal', 1),
            destination: 'Победитель → UB R2 M2 · проигравший → LB R1 M2',
          },
        ],
      },
      {
        id: 'ub-r2',
        name: 'Полуфинал',
        matches: [
          {
            id: 'n-5',
            code: 'UB R2 M1',
            status: 'COMPLETED',
            scheduledAt: '30 авг, 18:00',
            bestOf: 3,
            first: slot('aurora-five', 2),
            second: slot('nomad-protocol', 0),
            destination: 'Победитель → UB Final · проигравший → LB R3',
          },
          {
            id: 'n-6',
            code: 'UB R2 M2',
            status: 'LIVE',
            scheduledAt: 'Сейчас · карта 2',
            bestOf: 3,
            first: slot('crimson-guard', 1),
            second: slot('vertex-core', 0),
            destination: 'Победитель → UB Final · проигравший → LB R3',
          },
        ],
      },
      {
        id: 'ub-final',
        name: 'Финал верхней',
        matches: [
          {
            id: 'n-7',
            code: 'UB FINAL',
            status: 'SCHEDULED',
            scheduledAt: '6 сен, 19:00',
            bestOf: 3,
            first: slot('aurora-five'),
            second: pending('Победитель UB R2 M2'),
            destination: 'Победитель → Grand Final · проигравший → LB Final',
          },
        ],
      },
    ],
  },
  {
    id: 'lower',
    name: 'Нижняя сетка',
    rounds: [
      {
        id: 'lb-r1',
        name: 'Раунд 1',
        matches: [
          {
            id: 'n-8',
            code: 'LB R1 M1',
            status: 'COMPLETED',
            scheduledAt: '29 авг, 18:00',
            bestOf: 3,
            first: slot('night-shift', 0),
            second: slot('polar-division', 2),
            destination: 'Победитель → LB R2 M1',
          },
          {
            id: 'n-9',
            code: 'LB R1 M2',
            status: 'COMPLETED',
            scheduledAt: '29 авг, 20:30',
            bestOf: 3,
            first: slot('helios-unit', 1),
            second: slot('zero-signal', 2),
            destination: 'Победитель → LB R2 M2',
          },
        ],
      },
      {
        id: 'lb-r2',
        name: 'Раунд 2',
        matches: [
          {
            id: 'n-10',
            code: 'LB R2 M1',
            status: 'READY',
            scheduledAt: '5 сен, 18:00',
            bestOf: 3,
            first: slot('polar-division'),
            second: slot('nomad-protocol'),
            destination: 'Победитель → LB R3',
          },
          {
            id: 'n-11',
            code: 'LB R2 M2',
            status: 'SCHEDULED',
            scheduledAt: '5 сен, 20:30',
            bestOf: 3,
            first: slot('zero-signal'),
            second: pending('Проигравший UB R2 M2'),
            destination: 'Победитель → LB R3',
          },
        ],
      },
      {
        id: 'lb-final',
        name: 'Финал нижней',
        matches: [
          {
            id: 'n-12',
            code: 'LB FINAL',
            status: 'SCHEDULED',
            scheduledAt: '7 сен, 18:00',
            bestOf: 3,
            first: pending('Победитель LB R3'),
            second: pending('Проигравший UB Final'),
            destination: 'Победитель → Grand Final',
          },
        ],
      },
    ],
  },
  {
    id: 'grand-final',
    name: 'Гранд-финал',
    rounds: [
      {
        id: 'gf',
        name: 'Финал',
        matches: [
          {
            id: 'n-13',
            code: 'GRAND FINAL',
            status: 'SCHEDULED',
            scheduledAt: '8 сен, 20:00',
            bestOf: 5,
            first: pending('Победитель верхней сетки'),
            second: pending('Победитель нижней сетки'),
          },
        ],
      },
    ],
  },
];

function seededBracket(prefix: string, teams: Team[], dates: string[]): BracketStage[] {
  return [
    {
      id: 'main',
      name: 'Основная сетка',
      rounds: [
        {
          id: `${prefix}-r1`,
          name: 'Четвертьфинал',
          matches: [
            {
              id: `${prefix}-1`,
              code: 'QF 1',
              status: 'SCHEDULED',
              scheduledAt: dates[0] ?? 'Скоро',
              bestOf: 3,
              first: slot(teams[0]?.id ?? ''),
              second: slot(teams[7]?.id ?? ''),
              destination: 'Победитель → SF 1',
            },
            {
              id: `${prefix}-2`,
              code: 'QF 2',
              status: 'SCHEDULED',
              scheduledAt: dates[0] ?? 'Скоро',
              bestOf: 3,
              first: slot(teams[3]?.id ?? ''),
              second: slot(teams[4]?.id ?? ''),
              destination: 'Победитель → SF 1',
            },
            {
              id: `${prefix}-3`,
              code: 'QF 3',
              status: 'SCHEDULED',
              scheduledAt: dates[1] ?? 'Скоро',
              bestOf: 3,
              first: slot(teams[1]?.id ?? ''),
              second: slot(teams[6]?.id ?? ''),
              destination: 'Победитель → SF 2',
            },
            {
              id: `${prefix}-4`,
              code: 'QF 4',
              status: 'SCHEDULED',
              scheduledAt: dates[1] ?? 'Скоро',
              bestOf: 3,
              first: slot(teams[2]?.id ?? ''),
              second: slot(teams[5]?.id ?? ''),
              destination: 'Победитель → SF 2',
            },
          ],
        },
        {
          id: `${prefix}-r2`,
          name: 'Полуфинал',
          matches: [
            {
              id: `${prefix}-5`,
              code: 'SF 1',
              status: 'SCHEDULED',
              scheduledAt: dates[2] ?? 'Скоро',
              bestOf: 3,
              first: pending('Победитель QF 1'),
              second: pending('Победитель QF 2'),
              destination: 'Победитель → Final',
            },
            {
              id: `${prefix}-6`,
              code: 'SF 2',
              status: 'SCHEDULED',
              scheduledAt: dates[2] ?? 'Скоро',
              bestOf: 3,
              first: pending('Победитель QF 3'),
              second: pending('Победитель QF 4'),
              destination: 'Победитель → Final',
            },
          ],
        },
        {
          id: `${prefix}-r3`,
          name: 'Финал',
          matches: [
            {
              id: `${prefix}-7`,
              code: 'FINAL',
              status: 'SCHEDULED',
              scheduledAt: dates[3] ?? 'Скоро',
              bestOf: 5,
              first: pending('Победитель SF 1'),
              second: pending('Победитель SF 2'),
            },
          ],
        },
      ],
    },
  ];
}

const crownBracket: BracketStage[] = [
  {
    id: 'main',
    name: 'Основная сетка',
    rounds: [
      {
        id: 'crown-r1',
        name: 'Четвертьфинал',
        matches: [
          {
            id: 'c-1',
            code: 'QF 1',
            status: 'COMPLETED',
            scheduledAt: '18 июл, 16:00',
            bestOf: 3,
            first: slot('crown-ivo', 2),
            second: slot('crown-arch', 0),
            destination: 'Победитель → SF 1',
          },
          {
            id: 'c-2',
            code: 'QF 2',
            status: 'COMPLETED',
            scheduledAt: '18 июл, 16:45',
            bestOf: 3,
            first: slot('crown-snow', 2),
            second: slot('crown-fury', 1),
            destination: 'Победитель → SF 1',
          },
          {
            id: 'c-3',
            code: 'QF 3',
            status: 'COMPLETED',
            scheduledAt: '18 июл, 17:30',
            bestOf: 3,
            first: slot('crown-zen', 2),
            second: slot('crown-kot', 0),
            destination: 'Победитель → SF 2',
          },
          {
            id: 'c-4',
            code: 'QF 4',
            status: 'COMPLETED',
            scheduledAt: '18 июл, 18:15',
            bestOf: 3,
            first: slot('crown-mars', 2),
            second: slot('crown-ice', 1),
            destination: 'Победитель → SF 2',
          },
        ],
      },
      {
        id: 'crown-r2',
        name: 'Полуфинал',
        matches: [
          {
            id: 'c-5',
            code: 'SF 1',
            status: 'COMPLETED',
            scheduledAt: '19 июл, 17:00',
            bestOf: 3,
            first: slot('crown-ivo', 2),
            second: slot('crown-snow', 0),
            destination: 'Победитель → Final',
          },
          {
            id: 'c-6',
            code: 'SF 2',
            status: 'COMPLETED',
            scheduledAt: '19 июл, 18:00',
            bestOf: 3,
            first: slot('crown-zen', 2),
            second: slot('crown-mars', 1),
            destination: 'Победитель → Final',
          },
        ],
      },
      {
        id: 'crown-r3',
        name: 'Финал',
        matches: [
          {
            id: 'c-7',
            code: 'FINAL',
            status: 'COMPLETED',
            scheduledAt: '20 июл, 20:00',
            bestOf: 5,
            first: slot('crown-ivo', 3),
            second: slot('crown-zen', 2),
          },
        ],
      },
    ],
  },
];

export const tournaments: Tournament[] = [
  {
    slug: 'northern-nexus-cup',
    name: 'Northern Nexus Cup',
    game: 'Dota 2',
    gameShort: 'DOTA 2',
    description:
      'Главный осенний кубок для команд из Европы и СНГ. Двойное выбывание, полные составы и прямые эфиры решающих матчей.',
    status: 'LIVE',
    format: 'Double Elimination',
    region: 'EU · CIS',
    platform: 'PC',
    teamSize: 5,
    participantLimit: 8,
    startAt: '28 августа · 18:00',
    endAt: '8 сентября · 23:00',
    registrationEndsAt: 'Регистрация завершена',
    sortDate: '2026-09-08',
    prizePool: '₽250 000',
    prizeLabel: 'Призовой фонд',
    organizer: 'Northern Nexus Events',
    organizerVerified: true,
    accent: 'cyan',
    tags: ['Проверенные составы', 'Русский эфир', 'Best of 3'],
    streamUrl: '#stream',
    teams: nexusTeams,
    bracket: nexusBracket,
    rules: sharedRules,
    placements: [],
    stats: { matchesPlayed: 9, totalMatches: 13, viewers: '1 284', averageDuration: '41 мин' },
  },
  {
    slug: 'rift-challengers',
    name: 'Rift Challengers',
    game: 'League of Legends',
    gameShort: 'LEAGUE',
    description:
      'Открытая лига для амбициозных составов: прозрачный посев, плотное расписание и финал в прямом эфире.',
    status: 'REGISTRATION_OPEN',
    format: 'Single Elimination',
    region: 'EU West',
    platform: 'PC',
    teamSize: 5,
    participantLimit: 8,
    startAt: '12 сентября · 16:00',
    endAt: '14 сентября · 22:00',
    registrationEndsAt: 'До 10 сентября · 20:00',
    sortDate: '2026-09-12',
    prizePool: '₽120 000',
    prizeLabel: 'Призовой фонд',
    organizer: 'Rift Community',
    organizerVerified: true,
    accent: 'violet',
    tags: ['8 команд', 'Капитанский драфт', 'Best of 3'],
    teams: riftTeams,
    bracket: seededBracket('rift', riftTeams, [
      '12 сен, 16:00',
      '12 сен, 19:00',
      '13 сен, 18:00',
      '14 сен, 20:00',
    ]),
    rules: sharedRules,
    placements: [],
    stats: { matchesPlayed: 0, totalMatches: 7, viewers: '—', averageDuration: '—' },
  },
  {
    slug: 'triple-strike-open',
    name: 'Triple Strike Open',
    game: 'Brawl Stars',
    gameShort: 'BRAWL STARS',
    description:
      'Быстрый мобильный турнир выходного дня. Восемь трио, динамичная сетка и один вечер до чемпиона.',
    status: 'PUBLISHED',
    format: 'Single Elimination',
    region: 'CIS',
    platform: 'Mobile',
    teamSize: 3,
    participantLimit: 8,
    startAt: '19 сентября · 12:00',
    endAt: '19 сентября · 20:00',
    registrationEndsAt: 'Откроется 7 сентября',
    sortDate: '2026-09-19',
    prizePool: '50 000 гемов',
    prizeLabel: 'Награды',
    organizer: 'Mobile Arena',
    organizerVerified: true,
    accent: 'amber',
    tags: ['Один день', 'Mobile', 'Best of 3'],
    teams: strikeTeams,
    bracket: seededBracket('strike', strikeTeams, [
      '19 сен, 12:00',
      '19 сен, 13:00',
      '19 сен, 15:30',
      '19 сен, 18:30',
    ]),
    rules: sharedRules,
    placements: [],
    stats: { matchesPlayed: 0, totalMatches: 7, viewers: '—', averageDuration: '—' },
  },
  {
    slug: 'crown-masters',
    name: 'Crown Masters',
    game: 'Clash Royale',
    gameShort: 'CLASH ROYALE',
    description:
      'Завершённый июльский мастерс: восемь сильнейших игроков, семь матчей и напряжённый финал до последней карты.',
    status: 'COMPLETED',
    format: 'Single Elimination',
    region: 'Global',
    platform: 'Mobile',
    teamSize: 1,
    participantLimit: 8,
    startAt: '18 июля · 16:00',
    endAt: '20 июля · 22:00',
    registrationEndsAt: 'Завершён 20 июля',
    sortDate: '2026-07-20',
    prizePool: '₽90 000',
    prizeLabel: 'Разыграно',
    organizer: 'Crown League',
    organizerVerified: true,
    accent: 'green',
    tags: ['Результаты подтверждены', '7 матчей', 'Запись финала'],
    streamUrl: '#stream',
    teams: crownTeams,
    bracket: crownBracket,
    rules: sharedRules,
    placements: [
      { place: 1, teamId: 'crown-ivo', prize: '₽50 000' },
      { place: 2, teamId: 'crown-zen', prize: '₽25 000' },
      { place: 3, teamId: 'crown-mars', prize: '₽15 000' },
    ],
    stats: { matchesPlayed: 7, totalMatches: 7, viewers: '4 618', averageDuration: '18 мин' },
  },
];

export const statusLabels: Record<TournamentStatus, string> = {
  REGISTRATION_OPEN: 'Регистрация открыта',
  PUBLISHED: 'Скоро регистрация',
  LIVE: 'Идёт сейчас',
  COMPLETED: 'Завершён',
};

export const matchStatusLabels: Record<MatchStatus, string> = {
  SCHEDULED: 'Запланирован',
  READY: 'Готов к старту',
  LIVE: 'В эфире',
  COMPLETED: 'Завершён',
};

export function getTournament(slug: string): Tournament | undefined {
  return tournaments.find((tournament) => tournament.slug === slug);
}

export function getTeam(tournament: Tournament, teamId?: string): Team | undefined {
  return tournament.teams.find((item) => item.id === teamId);
}

export const liveTournament = tournaments.find((tournament) => tournament.status === 'LIVE');
export const completedTournaments = tournaments.filter(
  (tournament) => tournament.status === 'COMPLETED',
);
export const upcomingTournaments = tournaments.filter((tournament) =>
  ['REGISTRATION_OPEN', 'PUBLISHED'].includes(tournament.status),
);
