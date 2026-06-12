# Guia de Testes — Trail Frontend

Arquitetura de testes da plataforma de Trilhas de Aprendizagem: testes
**unitários / de componente** (Vitest + React Testing Library, em `jsdom`) e
**E2E** (Playwright, em Chromium / Firefox / WebKit). Os testes verificam
**comportamento acessível (roles/labels)**, não detalhes de implementação.

> O frontend conversa com um backend real via `fetch('/api/...')`
> (ver [`lib/api/client.ts`](lib/api/client.ts)). A CI roda apenas o frontend,
> então os testes **não dependem de um backend** — eles mockam a fronteira de
> rede (ver §4).

---

## 1. Stack

Next.js 16 (App Router, grupos de rota `(auth)` / `(app)`), React 18, TypeScript 5
(strict), ESLint 9 (flat config), **MUI v9 + Emotion**, **Zustand** (persistido).
Alias de path `@/* → ./*`.

| Camada | Ferramenta |
| ------ | ---------- |
| Unitário / componente | Vitest + React Testing Library + `jsdom` |
| E2E | Playwright (Chromium / Firefox / WebKit) |
| Cobertura | `@vitest/coverage-v8` |

---

## 2. Estrutura de pastas

```
__tests__/                          (Vitest — unitário / componente)
├── components/   LandingHero, LandingFeatures, LandingStats, LandingNavbar
├── pages/        DashboardPage, ProgressoPage
├── services/     api (mapeamento de trilhas, com fetch mockado)
└── store/        useStore (ações do Zustand)
test/             test-utils.tsx    (render com ThemeProvider do MUI)
vitest.config.ts · vitest.setup.ts  (jsdom, mocks de next/link e next/image)

tests/
├── e2e/                            (Playwright — sistema / aceite)
│   ├── auth/         authentication, protectedRoutes
│   ├── trails/       search (catálogo do dashboard)
│   └── responsive/   responsive (640 / 768 / 1280)
├── setup/           playwright.setup.ts   (seedAuth + signInViaUi + mockBackend)
├── tsconfig.json
└── reports/         cobertura + relatório HTML do Playwright (ignorados no git)
```

Configuração: [`vitest.config.ts`](vitest.config.ts), [`vitest.setup.ts`](vitest.setup.ts),
[`playwright.config.ts`](playwright.config.ts), [`tests/tsconfig.json`](tests/tsconfig.json),
CI em [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## 3. Scripts

```bash
npm test                # unitários / componente (Vitest)
npm run test:watch      # Vitest em modo watch
npm run test:coverage   # Vitest com cobertura (v8) → tests/reports/coverage
npm run test:e2e        # Playwright em chromium/firefox/webkit
npm run test:e2e:ui     # Playwright em modo UI
npm run lint:test       # ESLint apenas dos testes (tests/**)
```

Setup inicial do E2E: `npx playwright install`.

---

## 4. Estratégia de mocks

O cliente HTTP ([`lib/api/client.ts`](lib/api/client.ts)) usa o `fetch` global
contra `/api/...`. Os testes interceptam essa fronteira:

- **Vitest — serviço:** [`__tests__/services/api.test.ts`](__tests__/services/api.test.ts)
  faz stub do `fetch` global (`vi.stubGlobal`) e exercita a fachada `api` +
  o mapeamento `mapTrail`, incluindo header de auth e caminho de erro.
- **Vitest — páginas:** mockam `@/services/api` (`vi.mock`) e `next/navigation`
  (router), e alimentam o store Zustand com dados determinísticos dos
  [`mocks/`](mocks/) do projeto. `next/link` e `next/image` são mockados em
  [`vitest.setup.ts`](vitest.setup.ts).
- **E2E — backend:** `mockBackend(page)` em
  [`tests/setup/playwright.setup.ts`](tests/setup/playwright.setup.ts) intercepta
  todo `**/api/**` via `page.route` e serve fixtures determinísticas (login,
  perfil, atividade semanal, trilhas, matrícula). `seedAuth` semeia a sessão
  (store persistido + tokens) e `signInViaUi` dirige o formulário real de login.

---

## 5. Cobertura

Cobertura via `@vitest/coverage-v8`, gravada em `tests/reports/coverage`
(`text`, `lcov`, `html`) e publicada como artefato na CI. O escopo medido
(`coverage.include` em `vitest.config.ts`) abrange `services/`, `store/` e
`components/landing/`. **Sem thresholds que falhem o build** — a cobertura é
reportada como artefato, não como gate, e pode ser ampliada conforme a suíte
crescer.

---

## 6. Convenções de qualidade

- Comportamento acima de implementação; **queries por role/label**, `test-id`
  evitado.
- Padrão **AAA** (Arrange, Act, Assert), responsabilidade única, nomes descritivos,
  setup reutilizável (`test/test-utils.tsx`, `tests/setup/playwright.setup.ts`).
- **Determinístico**: sem backend real, sem `sleep` fixos. O store (singleton de
  módulo) é restaurado em `beforeEach`; mocks são limpos entre testes.
- Fortemente tipado; **sem `any`**.

---

## 7. Melhorias futuras

1. Ampliar a cobertura unitária para `utils/`, `hooks/`, `components/ui` e
   `components/auth`.
2. Adicionar testes de página para os fluxos de `(auth)` (signin/signup/onboarding)
   e para as áreas de mentor/admin (RBAC).
3. Implementar a **UI de busca ⌘K** e cobri-la no E2E de trilhas.
4. Adicionar `@axe-core/playwright` para auditorias de acessibilidade por página.
5. Adotar snapshots de regressão visual para os breakpoints responsivos.
```
