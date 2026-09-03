# ARENA GRID — дизайн-система, качество и поставка MVP

Статус документа: нормативная спецификация для MVP. Если реализация расходится с этим документом, расхождение должно быть явно зафиксировано в ADR или исправлено до релиза.

## 1. Принципы продукта и интерфейса

ARENA GRID — рабочая панель проведения любительских и полупрофессиональных киберспортивных турниров. Визуальный язык напоминает эфирную аппаратную: высокая информационная плотность, ясная иерархия, живые статусы и аккуратные акценты. Интерфейс не должен выглядеть как казино, магазин игровых предметов или промолендинг внутри рабочих сценариев.

Основные UX-принципы:

- **Следующее действие всегда видно.** На странице турнира, в match room и Organizer Cockpit пользователь видит главный текущий шаг, срок и причину недоступности действия.
- **Статус объясняет последствия.** Цвет никогда не является единственным носителем смысла: статус содержит текст, иконку и при необходимости подсказку.
- **Сложные операции подтверждаемы и восстанавливаемы.** Публикация, фиксация составов, запуск сетки, дисквалификация и решение спора показывают последствия до подтверждения; повтор запроса безопасен.
- **Публичное — быстро и доступно, рабочее — компактно.** Каталог и страницы турниров хорошо индексируются и читаются без входа; кабинеты оптимизированы для частых операций.
- **Mobile-first для игрока, desktop-first для оператора.** Регистрация, check-in и отправка результата полностью доступны с телефона. Массовое управление участниками и матчами удобно на широком экране, но не блокируется на мобильном.
- **Минимум персональных данных.** В UI не запрашиваются дата рождения, адрес, документы и другие данные, если конкретное правило турнира этого не требует. Для несовершеннолетних не используются ставки, азартные механики и давящие dark patterns.

## 2. Design tokens

Токены являются единственным источником визуальных значений. Компоненты используют семантические CSS variables, а не необработанные hex-значения. Базовая тёмная тема обязательна; светлая тема не входит в MVP.

### 2.1 Цвета

| Токен | Значение | Назначение |
| --- | --- | --- |
| `--color-bg` | `#080B12` | фон приложения |
| `--color-surface` | `#111622` | карточки, панели, навигация |
| `--color-surface-elevated` | `#171E2C` | popover, dialog, выделенные панели |
| `--color-surface-interactive` | `#202838` | hover/selected на нейтральных элементах |
| `--color-border` | `#293244` | стандартные границы |
| `--color-border-strong` | `#3A465C` | разделители и активные границы |
| `--color-primary` | `#35E6FF` | основное действие, ссылка, focus accent |
| `--color-primary-hover` | `#74EFFF` | hover основного действия |
| `--color-primary-pressed` | `#13BDD5` | pressed основного действия |
| `--color-on-primary` | `#031014` | текст на primary |
| `--color-secondary` | `#8B5CF6` | вторичный акцент и этапы сетки |
| `--color-success` | `#39D98A` | завершение, подтверждение, доступность |
| `--color-warning` | `#FFB547` | срок, ожидание, потенциальная проблема |
| `--color-error` | `#FF5C70` | ошибка, конфликт, опасное действие |
| `--color-info` | `#67A7FF` | нейтральное системное сообщение |
| `--color-text-primary` | `#F5F7FB` | основной текст |
| `--color-text-secondary` | `#AAB4C3` | вторичный текст; уточнён относительно исходного `#98A2B3` для устойчивого контраста на поверхностях |
| `--color-text-muted` | `#7F8A9D` | только крупные несущественные подписи; не использовать для основного текста |
| `--color-overlay` | `rgb(0 0 0 / 72%)` | overlay dialog/drawer |

Правила применения:

- `#98A2B3` допустим как исходный брендовый secondary, но для текста по `#111622` основным токеном принят `#AAB4C3`; итоговые пары проверяются автоматическим axe и ручным аудитом на WCAG 2.2 AA.
- Glow разрешён только вокруг primary CTA и индикатора `LIVE`: `0 0 24px rgb(53 230 255 / 20%)`. Он не заменяет границу или focus ring.
- Градиент акцента: `linear-gradient(135deg, #35E6FF 0%, #8B5CF6 100%)`; только hero, выбранный крупный KPI или брендовая подложка, не таблицы и формы.
- Success, warning и error никогда не используются как единственное различие. Добавляются label/иконка (`Успешно`, `Требует внимания`, `Ошибка`).
- Постеры игр — оригинальные абстрактные композиции, без официальных персонажей, логотипов издателей и нелицензированных артов.

### 2.2 Типографика

- Заголовки: `Space Grotesk`, fallback `Inter, system-ui, sans-serif`.
- Интерфейс и длинный текст: `Inter`, fallback `system-ui, sans-serif`.
- Счёт, время, seed и статистика: `font-variant-numeric: tabular-nums`.
- Минимальный основной размер на mobile — 14 px; длинный текст — 16 px.

| Стиль | Размер / высота строки | Вес | Применение |
| --- | --- | --- | --- |
| `display` | 48/52 px desktop, 36/40 px mobile | 700 | только landing hero |
| `h1` | 36/42 px desktop, 28/34 px mobile | 700 | заголовок страницы |
| `h2` | 28/34 px desktop, 24/30 px mobile | 650 | секция |
| `h3` | 22/28 px | 650 | карточка/панель |
| `title` | 18/24 px | 600 | заголовок компонента |
| `body` | 16/24 px | 400 | основной текст |
| `body-sm` | 14/20 px | 400 | таблицы и вторичная информация |
| `label` | 13/18 px | 600 | поля, вкладки, control labels |
| `caption` | 12/16 px | 500 | метаданные, только при достаточном контрасте |
| `score` | 32/36 px | 700 | счёт матча, tabular numerals |

### 2.3 Spacing, размеры и радиусы

Используется 8-point grid с половинным шагом для компактных внутренних отступов:

- spacing: `0`, `4`, `8`, `12`, `16`, `24`, `32`, `40`, `48`, `64`, `80`, `96` px;
- touch target: минимум `44 × 44` px; рекомендуемый mobile target `48 × 48` px;
- высота полей и кнопок: `40` px compact, `48` px default, `56` px hero/mobile primary;
- радиусы: `8` px для chips/вложенных controls, `12` px для inputs и малых карточек, `16` px для крупных панелей/dialog, `999` px только для status pill/avatar;
- тени: нейтральные и редкие — `0 12px 32px rgb(0 0 0 / 28%)` для elevated overlays;
- border: 1 px по умолчанию, 2 px для focus ring или selected state.

### 2.4 Grid и контейнеры

- Desktop `≥ 1280`: 12 колонок, gutter 24 px, максимальная ширина контента 1440 px, боковые поля 32–64 px.
- Tablet `768–1279`: 8 колонок, gutter 20 px, боковые поля 24 px.
- Mobile `< 768`: 4 колонки, gutter 16 px, боковые поля 16 px.
- Organizer Studio: левый rail 248 px на desktop; может сворачиваться до 72 px. Рабочая область не уже 720 px при открытом rail; при меньшей ширине используется drawer.
- Читаемый текстовый блок ограничен приблизительно 72 символами в строке.

### 2.5 Motion и reduced motion

| Токен | Значение | Применение |
| --- | --- | --- |
| `--duration-instant` | `80ms` | press feedback |
| `--duration-fast` | `140ms` | hover, tooltip |
| `--duration-normal` | `220ms` | drawer, collapse, tab content |
| `--duration-slow` | `320ms` | route-level overlay, только при необходимости |
| `--ease-standard` | `cubic-bezier(.2,.8,.2,1)` | стандарт |
| `--ease-exit` | `cubic-bezier(.4,0,1,1)` | исчезновение |

Анимация сообщает о смене состояния, но не задерживает действие. Не используются бесконечные декоративные анимации, кроме компактного live/reconnecting indicator. При `prefers-reduced-motion: reduce` отключаются transform/parallax, smooth scroll и пульсация; длительность переходов сокращается до 1 ms. Таймеры продолжают обновлять текст без анимации.

### 2.6 Keyboard и focus

- Все действия доступны с клавиатуры в логичном DOM-порядке; визуальный порядок не меняется CSS-свойством `order` вопреки DOM.
- Focus ring: внешний контур 2 px `#35E6FF` с offset 2 px и дополнительной тёмной обводкой на ярком фоне.
- `:focus-visible` не отключается. Hover и focus имеют сопоставимые подсказки.
- Dialog удерживает фокус, закрывается по `Escape` (если действие не необратимо) и возвращает фокус инициатору.
- Tabs используют arrow keys, таблицы не превращаются в сложный ARIA grid без необходимости.
- При ошибке формы summary получает фокус и содержит ссылки на неверные поля; каждое поле связано с ошибкой через `aria-describedby`.
- Live-обновления не перехватывают фокус. Низкоприоритетные события используют `aria-live="polite"`; критический конфликт результата — явный alert.

## 3. Responsive layouts

### 3.1 Общие паттерны

- Глобальная desktop-навигация состоит из product header и контекстного sidebar для кабинета. На mobile — компактный header, нижняя навигация максимум на 4–5 основных разделов и drawer для остальных.
- Таблицы участников, матчей и аудита на mobile преобразуются в карточки с сохранением labels. Горизонтальный scroll допустим для плотных сравнительных данных, но не для основных действий.
- Filter bar каталога на desktop располагается слева или над grid; на mobile открывается bottom sheet. Активные фильтры остаются chips над результатами и полностью отражаются в URL.
- Два основных действия на mobile не ставятся рядом, если ширина каждого становится меньше 44 px или подпись переносится более чем на две строки.
- Sticky footer action используется для check-in, подтверждения результата и отправки формы; он не перекрывает ошибки и учитывает safe-area inset.
- Organizer dashboard на mobile показывает приоритетные очереди проблем, а массовые действия доступны через selection mode, не через микроскопические checkbox.

### 3.2 Bracket

Desktop:

- Single elimination показывается колонками раундов слева направо; карточки матча имеют фиксированную минимальную ширину 240 px.
- Double elimination разделяется на явно подписанные Upper bracket, Lower bracket и Grand Final. Связи не полагаются только на линии: карточка показывает исход/следующий матч (`Победитель → UB R2 M3`, `Проигравший → LB R1 M2`).
- Round robin показывается как список туров/матчей, standings и при необходимости матрица; матрица вторична и допускает горизонтальный scroll.
- Zoom не является обязательным для чтения основного содержимого; при большом bracket используется scroll с закреплёнными labels раундов и mini-map только как улучшение.

Mobile:

- Одновременно показывается **один раунд одной стадии**. Сверху расположен stage selector (`Upper`, `Lower`, `Final`) и горизонтальный, keyboard-accessible round selector (`Раунд 1`, `Раунд 2`, …).
- Свайп может дублировать кнопки «Назад/Далее», но не является единственным способом навигации. Выбранные stage/round сохраняются в query params.
- Карточки идут вертикальным списком на всю доступную ширину. Межраундовые линии не рисуются; переходы объясняются текстовыми destination labels.
- В карточке видны команды, seed, счёт, best-of, время и статус. Tap открывает match details как страницу или full-height sheet с собственной ссылкой.
- После live SSE-обновления позиция scroll не сбрасывается. Если изменился другой раунд, появляется неблокирующий badge; если текущий — обновляется соответствующая карточка с коротким highlight, отключаемым reduced-motion.
- Состояние `bracket not generated` содержит время/условие генерации для игрока и CTA `Сгенерировать сетку` только для уполномоченного организатора.

## 4. Информационная архитектура и навигация

### 4.1 Публичная зона

- Верхняя навигация: `Турниры`, `Игры`, `Рейтинги`, глобальный поиск; справа — вход или avatar menu.
- `/` направляет к каталогу и созданию турнира, показывает ближайшие турниры и live matches без перегрузки промоматериалами.
- `/tournaments` — основная точка discovery. Search/filter/sort/pagination живут в URL и сохраняются при переходе назад.
- `/tournaments/[slug]` имеет tabs `Обзор`, `Правила`, `Участники`, `Сетка`, `Матчи`, `Стрим`. Основной CTA и персональный next action находятся над tabs.
- `/teams/[slug]`, `/players/[username]`, `/games/[slug]`, `/rankings` доступны без входа в пределах публично разрешённых данных.

### 4.2 Личный кабинет

- Основная навигация: `Обзор`, `Турниры`, `Матчи`, `Команда`, `Приглашения`, `Игровые аккаунты`, `Уведомления`, `Настройки`.
- `/dashboard` агрегирует ближайшее обязательное действие, следующий матч, check-in windows и приглашения.
- Контекст команды явно показывается, если у пользователя несколько команд; переключение не меняет данные без явной обратной связи.

### 4.3 Organizer Studio

- Первый уровень: список организаций/турниров и создание турнира.
- Внутри турнира устойчивый sidebar: `Обзор`, `Регистрация`, `Участники`, `Seeding`, `Сетка`, `Матчи`, `Споры`, `Объявления`, `Аналитика`, `Настройки`.
- Breadcrumb фиксирует организацию и турнир. Статус турнира и lifecycle action видны в header на каждой странице.
- Cockpit сортирует карточки по срочности: active disputes, delayed matches, unconfirmed results, pending registrations, warnings, audit activity. Каждая метрика ведёт в уже отфильтрованный список.
- Недоступный шаг содержит причину и prerequisite, а не просто disabled button.

### 4.4 Platform Admin

- Отдельный визуально обозначенный scope `/admin`; разделы: users, organizations, tournaments, disputes, audit, system.
- Impersonation не входит в MVP. Администраторские изменения требуют reason, подтверждение и создают `AuditEvent`.
- Возврат из admin в пользовательскую зону всегда видим. PLATFORM_ADMIN не получает неявное членство в организациях.

### 4.5 Правила контекста и deep links

- Каждая сущность имеет стабильный URL; modal-only маршруты не используются для match room, dispute и критических операций.
- Back navigation возвращает фильтры и позицию списка.
- Серверная авторизация возвращает 401 для отсутствующей сессии, 403 для недостаточных прав и 404 при необходимости скрыть существование ресурса. UI показывает отдельные `Войти`, `Нет доступа`, `Не найдено`.
- Notification deep link ведёт прямо к ресурсу и отмечается прочитанным только после успешного открытия либо явного действия пользователя.

## 5. Компоненты и состояния

### 5.1 Базовые компоненты

- Button (`primary`, `secondary`, `ghost`, `danger`, loading, disabled).
- IconButton с обязательным accessible name.
- Link, Breadcrumb, Tabs, SegmentedControl, Pagination.
- Input, Textarea, Select/Combobox, Checkbox, RadioGroup, Switch, DateTimePicker, FileUpload, ScoreInput.
- FormField, FieldHint, FieldError, FormErrorSummary.
- Card, Panel, Separator, Tooltip, Popover, DropdownMenu, Dialog, AlertDialog, Drawer/BottomSheet.
- Badge/StatusPill, Avatar/TeamMark, GameBadge, Countdown, Progress/Stepper.
- Table/DataTable, MobileRecordCard, FilterBar, SortControl, SearchInput.
- Toast, InlineAlert, EmptyState, ErrorState, PermissionState, Skeleton.
- OfflineBanner, ReconnectingIndicator, LiveRegion, ConnectionStatus.

### 5.2 Доменные компоненты

- TournamentCard, TournamentStatusBadge, RegistrationWindow, EligibilityChecklist, NextActionCard.
- TeamCard, RosterList, RosterSlot, InvitationCard, GameAccountStatus.
- ParticipantTable, RegistrationReviewCard, CheckInPanel, SeedList, SeedingControls.
- BracketCanvas, StageSelector, RoundSelector, MatchCard, StandingsTable.
- MatchHeader, MatchRoster, LobbyInstructions, ReadinessPanel, ScoreSubmissionForm, ResultConfirmation.
- EvidenceUploader, EvidenceGallery, ResultHistory, DisputeThread, ModeratorResolutionForm.
- NotificationItem, AnnouncementCard, AuditTimeline.
- CockpitMetric, IssueQueue, QuickActions, LifecycleControl.

### 5.3 Матрица обязательных состояний

Каждый data-driven экран реализует общий state contract: `idle → loading → success | empty | error`, а mutation — `idle → submitting → success | validation_error | server_error | conflict`. Skeleton повторяет геометрию будущего контента и не мерцает при reduced motion.

| Состояние | Представление | Разрешённые действия |
| --- | --- | --- |
| Loading | skeleton для первичной загрузки, локальный spinner для mutation | отмена/навигация, без дублирования submit |
| Empty | причина отсутствия данных и релевантный CTA | создать/изменить фильтры |
| Validation error | inline error + form summary | исправить, повторить |
| Server error | correlation ID, безопасное сообщение, retry | повторить/обратиться в поддержку |
| No permission | требуемая роль или scope без раскрытия закрытых данных | вернуться/запросить доступ, если применимо |
| Offline | persistent banner, данные из cache помечены устаревшими | только безопасные локальные действия; mutation не обещает успех |
| Reconnecting | компактный live indicator, REST resync после connect | продолжать чтение |
| Registration full | лимит и наличие waitlist | вступить в waitlist или вернуться |
| Registration closed | дата закрытия и текущий статус заявки | просмотреть турнир |
| Check-in expired | срок и последствия | связаться с организатором; никаких ложных CTA |
| Opponent absent | elapsed timer и правила walkover | сообщить/запросить модератора |
| Conflicting results | обе версии результата и evidence | открыть/перейти к dispute |
| Game API unavailable | причина без технических секретов | перейти в manual result workflow |
| Match disputed | статус, модератор, timeline; score locked | добавить допустимое evidence/message |
| Disqualification | причина, автор, время и влияние на bracket | appeal/contact согласно правилам |
| Tournament paused | banner на всех связанных экранах | чтение; lifecycle mutations заблокированы политикой |
| Tournament cancelled | финальный banner, причина, отменённые матчи | чтение/экспорт |
| Bracket not generated | prerequisite и ожидаемое действие | генерация только для разрешённой роли |

Дополнительные правила:

- `409 Conflict` и ошибка версии показывают свежие серверные данные и предлагают повторить осознанно.
- После неизвестного исхода critical mutation клиент сначала получает актуальное состояние через GET, а не слепо повторяет действие с новым idempotency key.
- Успешный toast не является единственным подтверждением: обновляется сама сущность и её audit/history.
- Optimistic UI допустим для marking notification as read, но не для результата матча, продвижения по сетке, roster lock и модераторского решения.

## 6. Quality strategy

### 6.1 Test pyramid

Цель — быстрый feedback на чистой доменной логике и небольшое, но полное покрытие критических пользовательских путей.

1. **Static checks на каждый PR:** TypeScript strict, ESLint, Prettier check, dependency boundaries, Prisma validation/generation, OpenAPI/API-client drift check, environment schema validation.
2. **Unit tests (основа пирамиды):** state machines, RBAC policies, domain/application services, tournament engine, serializers/validators, UI reducers и компоненты. Тесты детерминированы; время и UUID передаются зависимостями.
3. **Integration tests:** Nest modules + реальная PostgreSQL/Redis/S3-compatible test infrastructure. Проверяются транзакции, constraints, optimistic version, outbox/jobs, repositories, auth rotation и idempotency.
4. **API e2e/contract tests:** HTTP через Fastify adapter, validation/error schema, 401/403/404, pagination/filter/sort, cookies/CSRF, OpenAPI compatibility.
5. **Component/accessibility tests:** React Testing Library, user-event, axe для ключевых форм, таблиц, dialog, bracket navigation, keyboard/focus и состояния ошибок.
6. **Browser E2E:** Playwright против собранных web/api/worker и изолированной seeded database. Минимальное число сценариев, но полный business flow.
7. **Non-functional checks:** smoke, migration rehearsal, dependency/container scan, secret scan, load test critical reads/SSE, backup restore exercise перед production launch.

Coverage — индикатор, не самоцель. Минимальные пороги для MVP: tournament-engine branches 95%, security/auth policies branches 90%, прочие backend domain services lines 85%, frontend shared/domain components lines 75%. Все исправления критических дефектов сопровождаются regression test.

### 6.2 Обязательные backend-наборы

- State transitions всех Tournament/Registration/Match/Dispute статусов, включая запрет переходов.
- RBAC: положительные и отрицательные случаи для каждой protected mutation; tenant isolation для чужой организации и назначений модератора.
- Tournament engine: single/double elimination, round robin, byes, нечётные участники, winner/loser advancement, walkover, disqualification, отмена результата, повтор события.
- Results: три источника результата, совпадение/конфликт подтверждений, evidence, moderator override и audit.
- Надёжность: два параллельных завершения матча, повторный advancement, повтор HTTP с тем же idempotency key, тот же job/event дважды, stale version, roster mutation после lock.
- Auth: Argon2 verification, access expiry, refresh rotation/reuse detection, revoke one/all sessions, cookie flags, password reset/email verification one-time tokens, brute-force throttling.
- Providers: timeout, retry/backoff, circuit open/half-open, rate limit, cache и автоматический manual fallback.
- Jobs: deterministic job IDs, retry policy, dead-letter path, exactly-once business effect поверх at-least-once delivery.

### 6.3 Обязательные Playwright-сценарии

Сценарии выполняются как связный tournament journey, но каждый тест имеет собственную подготовку через API/fixtures и может запускаться независимо:

1. Игрок регистрируется, подтверждает email и создаёт команду.
2. Капитан приглашает участника; приглашённый принимает приглашение, состав обновляется.
3. Команда выбирает подходящий турнир, проходит eligibility checks и регистрируется; создаётся roster snapshot.
4. В период check-in капитан подтверждает участие; статус становится `CHECKED_IN`.
5. Организатор фиксирует составы, выполняет seeding, генерирует bracket и запускает турнир.
6. Игрок открывает match room, вводит счёт и отправляет evidence/result.
7. Соперник видит submission и отклоняет результат с конфликтующей версией.
8. Система создаёт единственный dispute, блокирует завершение и отображает его обеим сторонам.
9. Назначенный модератор изучает evidence и выносит решение; создаётся audit event.
10. Победитель ровно один раз продвигается в следующий матч; bracket, match room и cockpit сходятся после SSE/REST resync.

Для критического пути дополнительно проверяются mobile viewport (390×844), desktop (1440×900), keyboard-only ключевых форм, offline/reconnect, отсутствие необработанных console errors и базовый axe audit.

### 6.4 QA среды и данные

- Unit tests не используют сеть и общую БД.
- Integration/API tests получают отдельную database schema или database на worker; миграции применяются с нуля.
- E2E seed имеет стабильные IDs/часы и тестовые аккаунты по ролям. Тест не зависит от внешних игровых API, email или Discord: используются mock provider и Mailpit/OAuth stub.
- Скриншоты, trace, video, server logs и correlation IDs сохраняются только для упавших E2E (или по явному флагу) и публикуются как CI artifacts с ограниченным retention.
- Тестовые evidence-файлы проверяют MIME/signature, размер, запрещённый тип и безопасную выдачу presigned URL.

## 7. Release gates

Изменение не попадает в `main`, если не выполнены применимые gates:

- обязательный review и зелёные format, lint, typecheck, unit, integration, API e2e, component tests;
- OpenAPI сгенерирован, typed client не имеет diff после regeneration;
- Prisma migration forward-only, проходит на пустой и на копии схемы предыдущей версии; destructive migration имеет отдельный expand/migrate/contract план;
- production build всех apps и Docker images успешен; images запускаются как non-root и проходят health checks;
- Playwright smoke критического пути зелёный на preview/staging; полный набор обязателен для release candidate;
- нет unresolved `critical/high` security vulnerabilities без документированного risk acceptance и срока;
- secret scan чист, env schema документирована, реальные секреты отсутствуют в image layers и client bundle;
- accessibility: нет critical/serious axe violations на ключевых страницах, keyboard и focus пройдены вручную;
- observability: новые critical paths имеют logs, metrics, traces и actionable alerts; correlation ID проходит web/API/worker;
- rollback/roll-forward инструкция и backup status проверены; on-call/owner релиза определён;
- product acceptance: демо-турнир проходит от регистрации до победителя без ручного изменения БД.

Классификация дефектов:

- **P0:** потеря/утечка данных, обход авторизации, двойное продвижение/победитель, массовая недоступность — блокирует релиз и требует немедленного rollback/mitigation.
- **P1:** сломан критический путь, неверный результат/статус, невозможен check-in или dispute resolution — блокирует релиз.
- **P2:** существует безопасный обход, затронут некритичный сценарий — допускается только с владельцем и датой исправления.
- **P3:** косметика/малое неудобство — планируется по приоритету.

## 8. Observability и SLO

### 8.1 Сигналы

- Structured JSON logs через Pino: timestamp, level, service, environment, version, correlationId, traceId, route/template, actorId (псевдоним/ID), organizationId, tournamentId, matchId, jobId, outcome, durationMs, errorCode. Пароли, токены, cookies, provider credentials, содержимое evidence и лишние PII редактируются.
- OpenTelemetry traces: web request → API → Prisma/Redis/provider → BullMQ enqueue/worker. Sampling повышается для ошибок и критических tournament/result операций.
- RED metrics для HTTP (rate/errors/duration), USE для ресурсов, queue depth/lag/retry/DLQ, DB pool/locks/slow queries, Redis latency, provider health/circuit state, SSE connections/reconnects/event lag.
- Product events через adapter: tournament viewed, eligibility checked, registration submitted/approved, check-in completed, bracket generated, result submitted/confirmed/rejected, dispute opened/resolved. Аналитика не содержит sensitive payload.
- Error tracking через adapter группирует exception по release/environment и связывает с correlation/trace ID.
- AuditEvent — бизнес-аудит, не замена operational logs; административные действия append-only и содержат actor, scope, reason, before/after безопасных полей.

### 8.2 MVP SLO и SLI

Окно оценки — rolling 30 days; плановые работы исключаются только если объявлены заранее. Значения применяются после публичного запуска и корректируются после 30 дней baseline.

| SLO | Цель | SLI |
| --- | --- | --- |
| Доступность публичного read API | 99.9% | доля валидных запросов без 5xx/timeout |
| Доступность critical mutations | 99.95% | registration/check-in/result/moderation requests с корректным terminal response |
| Latency read API | p95 < 500 ms, p99 < 1.2 s | server duration без клиентской сети |
| Latency critical mutation | p95 < 800 ms, p99 < 2 s | до durable commit/idempotent acknowledgement, без upload transfer |
| Web LCP | p75 < 2.5 s | реальные mobile visits по основным публичным страницам |
| Web INP | p75 < 200 ms | реальные visits |
| SSE freshness | p95 < 3 s | от durable event timestamp до получения клиентом |
| Job timeliness | 99% < 60 s | обычные jobs от scheduled/enqueued до successful effect; lifecycle jobs имеют отдельный deadline |
| Advancement correctness | 100% | отсутствие двойного продвижения и расходящихся bracket/match outcomes |

На correctness/security не расходуется error budget: любой подтверждённый случай — incident. При расходовании 50% availability error budget до середины окна замораживаются рискованные feature releases; при 100% — только reliability/security fixes до восстановления бюджета.

### 8.3 Alerts и runbooks

- Page: высокий sustained 5xx critical mutations, DB unavailable, auth outage, queue lag угрожает lifecycle deadline, подтверждённая рассинхронизация bracket, P0 security signal.
- Ticket/working-hours alert: растущий p95, provider circuit open, DLQ > 0, повышенный refresh reuse detection, storage errors.
- Не alertить на единичные expected 4xx или краткий provider outage с работающим manual fallback.
- Каждый alert указывает impact, dashboard, последние deployments, query/log link, владельца и runbook. Ежемесячно проверяется actionable rate.
- Synthetic smoke каждые 5 минут: public catalog/readiness; реже — безопасный auth/API canary. Полный турнирный synthetic flow запускается в staging по расписанию.

## 9. Локальная и CI-инфраструктура

### 9.1 Local development

Docker Compose поднимает `web`, `api`, `worker`, `postgres`, `redis`, `minio`, `mailpit` в общей внутренней сети. Наружу публикуются только необходимые development ports. Все сервисы имеют health checks и `depends_on` по health, а не только по старту процесса.

Ожидаемый workflow:

1. Скопировать `.env.example` в локальный env-файл; схема окружения валидирует обязательные значения при старте.
2. `pnpm install` с зафиксированной версией pnpm/Corepack и lockfile.
3. `docker compose up -d postgres redis minio mailpit` для инфраструктуры либо полный compose для container parity.
4. Применить migration и seed идемпотентными workspace-командами.
5. `pnpm dev` запускает web/api/worker через Turborepo; `pnpm build`, `pnpm lint`, `pnpm typecheck`, `pnpm test` работают из root.

Требования:

- multi-stage Dockerfiles, non-root runtime, read-only filesystem где возможно, graceful shutdown;
- API readiness проверяет критические зависимости, liveness — только процесс; worker readiness отражает Redis/queue connectivity;
- MinIO buckets создаются bootstrap job, Mailpit используется только локально;
- seed создаёт четыре заданных турнира, роли/аккаунты, команды, матчи, notification и активный dispute; credentials безопасны и явно помечены как development-only;
- миграции выполняет отдельная one-shot release job, не каждый replica API;
- timestamps хранятся в UTC, UI отображает timezone пользователя/турнира; тестовые часы управляемы;
- `.env.example` содержит только placeholders и документацию, секреты не коммитятся.

### 9.2 CI/CD pipeline

PR pipeline:

1. checkout, pinned Node LTS/pnpm, cache pnpm store и Turborepo с ключом lockfile/toolchain;
2. install `--frozen-lockfile`, formatting/lint/typecheck/boundary checks;
3. Prisma validate/generate, OpenAPI generation и API client drift check;
4. unit/component tests параллельно по пакетам;
5. PostgreSQL/Redis/MinIO service containers, migrations, integration/API tests;
6. production build, Docker image build, SBOM, dependency/image/secret scan;
7. preview environment, Playwright smoke + axe; artifacts только при необходимости.

Release pipeline:

1. immutable images с git SHA и provenance подписываются и продвигаются между средами без rebuild;
2. staging migration rehearsal, deploy, readiness и полный Playwright journey;
3. production migration job по expand/contract правилам;
4. rolling/canary deploy API и worker с graceful drain, затем web; smoke/synthetics;
5. автоматическая остановка rollout при нарушении health/error thresholds; rollback приложения только если schema backward-compatible, иначе roll-forward;
6. release annotation в observability, краткое наблюдение за SLO и очередями.

Конкурентные job workers обновляются независимо, но новая и предыдущая версии должны совместно понимать payload во время rollout. Payload содержит `schemaVersion`; incompatible changes вводятся двухфазно.

## 10. Поэтапный план реализации

Каждая фаза завершается typecheck, lint и релевантными тестами. Exit criteria кумулятивны: предыдущие gates продолжают выполняться. Критическая функциональность не считается завершённой, если UI использует fake action без backend endpoint.

### Фаза 1. Monorepo и конфигурация

Результат: pnpm/Turborepo workspace с `apps/web`, `apps/api`, `apps/worker` и пакетами `contracts`, `api-client`, `database`, `ui`, `config`, `logger`, `tournament-engine`; общие strict tsconfig, ESLint, Prettier, Husky/lint-staged, env schemas.

Exit criteria:

- root-команды dev/build/typecheck/lint/test разрешают workspace graph;
- package boundaries исключают import API/Prisma в чистый engine и frontend;
- минимальные приложения собираются; CI static job зелёный;
- `.env.example` документирован, invalid env завершает процесс понятной ошибкой.

### Фаза 2. Database schema и migrations

Результат: Prisma schema для всех MVP-сущностей, enums, timestamps/soft delete где нужно, constraints, indexes, version/idempotency/audit data; initial migration и realistic seed.

Exit criteria:

- миграция проходит на пустой PostgreSQL и повторяемо разворачивает схему;
- Prisma validate/generate зелёные; основные связи/unique/check constraints покрыты integration tests;
- seed создаёт четыре демо-турнира и тестовые роли, не зависит от production credentials;
- documented erase/reseed применяется только к development/test средам.

### Фаза 3. Backend foundation

Результат: NestJS + Fastify modular monolith, config, Pino, Prisma/Redis/S3 adapters, global validation/error envelope, correlation ID, Swagger, `/live` и `/ready`, API v1 routing.

Exit criteria:

- каждый модуль имеет controller/application/domain/repository/policy boundaries или явный skeleton без недействующих публичных endpoints;
- OpenAPI генерируется детерминированно; typed client создаётся из него;
- health, error mapping, pagination conventions и graceful shutdown протестированы;
- baseline rate limit и redaction работают.

### Фаза 4. Authentication и authorization

Результат: registration/login/logout/refresh rotation, email verification, reset password, session management, Discord OAuth seam; multi-role RBAC и resource policies.

Exit criteria:

- access token short-lived, refresh cookie Secure/HttpOnly/SameSite и не доступен frontend JS;
- rotation/reuse detection, revoke single/all, brute-force protection и CSRF threat decision протестированы;
- backend запрещает cross-organization и неназначенный moderator access;
- negative authorization test существует для каждой protected mutation.

### Фаза 5. Teams и organizations

Результат: organizations/memberships, teams/members, invitations, game accounts/provider verification seam, captain workflows.

Exit criteria:

- игрок создаёт команду, капитан приглашает, пользователь принимает/отклоняет; повтор безопасен;
- ownership/membership/role constraints и last-captain behavior определены и протестированы;
- provider unavailable приводит к понятному pending/manual состоянию;
- audit фиксирует administrative membership changes.

### Фаза 6. Tournaments и registrations

Результат: tournament CRUD/publish/search/filter/sort/pagination, rules/eligibility, registration review, roster snapshot, check-in windows и roster lock.

Exit criteria:

- state machines запрещают все недопустимые переходы;
- поиск и фильтры имеют стабильный contract, indexes и pagination tests;
- registration capacity/waitlist и параллельные заявки не превышают лимит;
- snapshot неизменяем, roster после lock не меняется; check-in boundary times протестированы.

### Фаза 7. Tournament engine

Результат: чистый TypeScript engine для single elimination, double elimination и round robin с event/idempotency model.

Exit criteria:

- нет зависимостей от NestJS, Prisma, clock/network/random без инъекции;
- тесты покрывают generation, byes, odd count, winner/loser advancement, walkover, DQ, result reversal и duplicate event;
- deterministic snapshot tests/fixtures объясняют bracket shape;
- extension points для Swiss/Ladder/Groups документированы без преждевременной реализации.

### Фаза 8. Matches, results и disputes

Результат: bracket persistence, match room APIs, readiness, manual/provider/moderator results, evidence, confirmation/conflict/dispute, moderator resolution, audit.

Exit criteria:

- match completion и advancement выполняются в одной транзакции с version/unique guards;
- concurrency tests доказывают отсутствие double completion/advancement;
- критические mutations принимают idempotency key и возвращают прежний результат при replay;
- conflict создаёт один dispute; moderator decision требует scope/reason и оставляет audit trail.

### Фаза 9. Notifications и workers

Результат: BullMQ queues для email/notifications/reminders/lifecycle/provider sync/result checks/analytics/temp cleanup, retry/backoff, DLQ и scheduler strategy.

Exit criteria:

- каждый job имеет stable ID/idempotent business effect, schema version и structured logs;
- duplicate delivery/retry/DLQ integration tests зелёные;
- registration/check-in lifecycle deadlines воспроизводимы с fake clock;
- worker health, graceful drain и queue metrics доступны.

### Фаза 10. Next.js frontend

Результат: App Router shell, Server Components by default, typed API client, TanStack Query для client interactions, RHF/Zod forms, public pages и player dashboard по дизайн-токенам.

Exit criteria:

- landing, catalog, tournament detail/tabs, teams/players/games/rankings и dashboard routes реализованы;
- catalog filters хранятся в URL; loading/empty/error/offline/no-permission states доступны;
- auth cookie не читается client JS; backend errors/correlation ID корректно отображаются;
- responsive, keyboard и axe component checks зелёные.

### Фаза 11. Organizer Studio

Результат: tournament wizard, registration review, participants/lock, seeding, bracket, matches, disputes, announcements, analytics/settings и cockpit.

Exit criteria:

- организатор проводит турнир через UI без DB/CLI вмешательства;
- prerequisites/lifecycle effects видимы, destructive/admin actions требуют подтверждения/reason;
- cockpit данные ведут в отфильтрованные рабочие очереди;
- RBAC проверяется API, включая попытки изменить чужой турнир.

### Фаза 12. Admin

Результат: users, organizations, tournaments, disputes, audit и system health views для PLATFORM_ADMIN.

Exit criteria:

- admin scope визуально и технически отделён; все queries/actions имеют backend policy;
- sensitive data минимизированы/редактируются; audit filters/export учитывают access rules;
- административные mutations создают AuditEvent с reason;
- non-admin получает 403/404 согласно policy даже при прямом API вызове.

### Фаза 13. Realtime

Результат: authenticated/scoped SSE для tournament/bracket/match/notification/cockpit updates; WebSocket только для фактически реализованного chat/dispute conversation.

Exit criteria:

- event IDs, resume (`Last-Event-ID`), heartbeat и reconnect backoff реализованы;
- после reconnect всегда выполняется REST resync, duplicate/out-of-order events безопасны;
- tenant/resource authorization действует на stream endpoint;
- load test подтверждает connection budget и p95 freshness; degraded mode понятен пользователю.

### Фаза 14. Tests

Результат: завершённая пирамида тестов, обязательный Playwright journey и security/reliability/accessibility regressions.

Exit criteria:

- все 10 обязательных сценариев проходят независимо и связно на desktop/mobile;
- coverage thresholds соблюдены без бессмысленного исключения кода;
- race/idempotency/auth negative tests стабильны при многократном запуске;
- нет flaky tests: нестабильный тест исправляется или явно quarantined с owner/date и не маскирует gate.

### Фаза 15. Docker и документация

Результат: production Dockerfiles, полный local Compose, GitHub Actions release pipeline, migrations/seed/health, README, runbooks, architecture/security/operations docs.

Exit criteria:

- новый разработчик запускает seeded платформу по README и завершает demo flow;
- staging разворачивается из immutable images, full release gates зелёные;
- backup/restore, migration, rollback/roll-forward, incident и provider outage runbooks проверены;
- production readiness review подтверждает SLO dashboards/alerts, secrets, scaling limits и ownership;
- демонстрационный турнир полностью проходит от регистрации команд до единственного победителя, а решение и audit согласованы во всех API/UI представлениях.

## 11. Definition of Done для любой вертикальной функции

Функция завершена, если:

- бизнес-правило и state transitions реализованы на backend, покрыты policy и validation;
- контракт документирован в OpenAPI, typed client обновлён без ручного дублирования типов;
- UI реализует happy path и применимые обязательные состояния, responsive/keyboard/focus;
- критическая mutation транзакционна и идемпотентна, audit/notification создаются где требуется;
- unit + integration/API + применимый component/E2E regression тесты зелёные;
- logs/metrics/traces не содержат секретов и позволяют диагностировать сбой по correlation ID;
- миграция, feature rollout и обратная совместимость продуманы;
- нет критических TODO, fake actions или ручных шагов через БД для пользовательского сценария.
