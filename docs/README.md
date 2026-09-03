# ARENA GRID — пакет проектирования MVP

Этот каталог является исходной точкой реализации. Документы фиксируют продуктовые решения, архитектурные инварианты и критерии поставки до начала разработки кода.

| Обязательный артефакт | Где зафиксирован |
| --- | --- |
| Product summary | [PRODUCT.md](./PRODUCT.md#1-product-summary) |
| Sitemap | [PRODUCT.md](./PRODUCT.md#3-sitemap-и-информационная-архитектура) |
| User flows | [PRODUCT.md](./PRODUCT.md#4-end-to-end-user-flows) |
| ER-модель | [ARCHITECTURE.md](./ARCHITECTURE.md#5-er-модель) |
| Backend module map | [ARCHITECTURE.md](./ARCHITECTURE.md#4-backend-как-модульный-монолит) |
| API specification | [ARCHITECTURE.md](./ARCHITECTURE.md#6-rest-api-v1) |
| Авторизация | [ARCHITECTURE.md](./ARCHITECTURE.md#7-аутентификация-сессии-csrf-и-rbac) |
| Tournament state machine | [ARCHITECTURE.md](./ARCHITECTURE.md#8-state-machines) |
| Design tokens | [DESIGN_AND_DELIVERY.md](./DESIGN_AND_DELIVERY.md#2-design-tokens) |
| MVP backlog | [PRODUCT.md](./PRODUCT.md#8-приоритизированный-mvp-backlog) |
| Структура monorepo | [ARCHITECTURE.md](./ARCHITECTURE.md#3-структура-monorepo-и-зависимости) |
| План реализации | [DESIGN_AND_DELIVERY.md](./DESIGN_AND_DELIVERY.md#10-поэтапный-план-реализации) |

## Решение по поставке

MVP реализуется как модульный монолит с отдельными процессами `web`, `api` и `worker`. PostgreSQL остаётся источником истины, Redis используется для очередей, rate limiting и эфемерного realtime-состояния. Все изменения tournament aggregate проходят через NestJS API; Next.js не содержит доменной логики и не обращается к базе напрямую.

Главный release gate — воспроизводимый демонстрационный сценарий от регистрации команды и check-in до подтверждённого либо разрешённого модератором результата и транзакционного продвижения победителя.
