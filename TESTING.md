# Guia de Testes — Trail Frontend

Arquitetura de testes profissional e pronta para CI da plataforma de Trilhas de
Aprendizagem: testes **unitários** + **integração** (Jest + React Testing Library)
e **E2E** (Playwright, em Chromium / Firefox / WebKit). Os testes verificam
**comportamento por papéis acessíveis (roles)**, e não detalhes de implementação.

> Documento complementar ao **Plano de Testes — Squad 28** (ISO/IEC/IEEE 29119-3).
> Aqui está registrado **como** a estratégia de validação foi automatizada no
> frontend e qual o status de cada cenário (TS01–TS12).

---

## 1. Análise do repositório (antes das mudanças)

**Stack:** Next.js 16 (App Router, grupos de rota `(auth)` / `(app)`), React 18,
TypeScript 5 (strict), ESLint 9 (flat config), **MUI v9 + Emotion** (não Tailwind),
**Zustand** (persistido) para estado. Alias de path `@/* → ./*`.

### O que já existia
- UI de protótipo funcional: landing, login, cadastro, onboarding, dashboard,
  progresso, páginas de trilha e de aula.
- Uma **camada de dados mock**: [`services/api.ts`](services/api.ts) é um objeto
  local que retorna dados mock com atraso via `setTimeout` — **não faz requisições
  HTTP**.
- Store Zustand ([`store/useStore.ts`](store/useStore.ts)) com `persist`.
- Tipos de domínio em [`types/`](types/) e dados mock em [`mocks/`](mocks/).

### Infraestrutura de testes ausente
- **Nenhum runner, nenhum teste, nenhuma cobertura, nenhum E2E** — o `package.json`
  só tinha `dev/build/start/lint`.
- `hooks/index.ts` e `utils/index.ts` eram **arquivos placeholder vazios**.

### Riscos arquiteturais identificados
- **Sem camada HTTP** → o MSW (que intercepta tráfego de rede) não tem o que
  interceptar hoje. Mitigado mockando o módulo `services/api` (a fronteira real)
  e mantendo o MSW como infraestrutura pronta para o futuro (ver §6).
- **Vários fluxos dos critérios de aceite não estavam implementados**: recuperação
  de senha (apenas link decorativo), favoritos (ausentes do store), busca real (a
  busca da Topbar era explicitamente *"decorative, no logic yet"*), e nenhuma
  proteção de rota (usuários deslogados conseguiam abrir `/dashboard`).
- Os dados mock são internamente inconsistentes (ex.: o `lessonsDone` estático de
  uma trilha difere da contagem de aulas `done` em seus `modules`). Por isso os
  testes verificam comportamento **relativo** (um toggle altera a contagem em
  exatamente um) em vez de totais fixos.

---

## 2. Código de produção mínimo adicionado (Projeto de Software)

Para que os testes de exemplo exigidos exercitassem código **real** (e não dublês),
foram adicionados trechos pequenos, aditivos e prontos para produção — os
placeholders vazios foram preenchidos e a UI existente foi preservada (apenas o
link "Esqueci minha senha" do login virou um link real).

| Arquivo | Por quê | Cenário |
|---------|---------|---------|
| [`utils/index.ts`](utils/index.ts) | `getInitials`, `clampProgress`, `filterTrails` — helpers puros (a lógica de busca vive aqui) | TS06 |
| [`hooks/index.ts`](hooks/index.ts) | `useDebouncedValue` — o exemplo de hook customizado | TS06 |
| [`components/ui/ProgressCard.tsx`](components/ui/ProgressCard.tsx) | Card de progresso reutilizável e acessível (padrão duplicado no dashboard/progresso) | TS09 |
| [`components/ui/FavoriteButton.tsx`](components/ui/FavoriteButton.tsx) | Fluxo de favoritos; `aria-pressed` + rótulo dinâmico | TS07 |
| [`components/auth/RequireAuth.tsx`](components/auth/RequireAuth.tsx) | Guard de rota no client → torna "rotas protegidas" um teste real | — |
| [`app/(auth)/recuperar-senha/page.tsx`](app/(auth)/recuperar-senha/page.tsx) | Página mínima de recuperação de senha (reusa o `AuthShell`) | TS04 |
| `store` / `services/api` | `favorites` + `toggleFavorite`/`isFavorite` e `api.requestPasswordReset` (aditivo) | TS07 / TS04 |

---

## 3. Estrutura de pastas criada

```
tests/
├── unit/                            (Teste Unitário — Desenvolvedores)
│   ├── components/   PasswordField, ProgressCard, RequireAuth, Topbar (busca)
│   ├── hooks/        useDebouncedValue
│   ├── services/     api
│   └── (store/utils) useStore, utils
├── integration/                     (Teste de Integração — comunicação entre módulos)
│   ├── auth/         login, passwordRecovery
│   ├── trails/       favorites
│   └── dashboard/    dashboardLoading
├── e2e/                             (Teste de Sistema / Aceite)
│   ├── auth/         authentication, protectedRoutes
│   ├── trails/       search (catálogo + fixme do ⌘K)
│   └── responsive/   responsive (640 / 768 / 1280)
├── mocks/            handlers.ts · server.ts · browser.ts   (MSW)
├── fixtures/         trails.ts · user.ts   (reusam os mocks — sem duplicação)
├── utils/            renderWithProviders.tsx · testHelpers.ts · navigationMock.ts
├── setup/            jest.setup.ts · playwright.setup.ts
└── reports/          cobertura + relatório HTML do Playwright (ignorados no git)
```

Configuração: [`jest.config.ts`](jest.config.ts), [`playwright.config.ts`](playwright.config.ts),
[`tests/tsconfig.json`](tests/tsconfig.json), blocos de ESLint para testes em
[`eslint.config.mjs`](eslint.config.mjs), CI em [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## 4. Scripts

```bash
npm test                # unitários + integração (Jest)
npm run test:watch      # modo watch
npm run test:coverage   # cobertura + thresholds (gate)
npm run test:e2e        # Playwright em chromium/firefox/webkit
npm run test:e2e:ui     # Playwright em modo UI
npm run lint:test       # ESLint apenas dos testes
```

Setup inicial do E2E: `npx playwright install`.

---

## 5. Cobertura dos cenários do Plano de Testes (TS01–TS12)

| ID | Cenário | Status | Onde |
|----|---------|--------|------|
| TS01 | Cadastro de usuário | ⚠️ Parcial | UI existe; teste de cadastro pode ser adicionado (mesmo padrão do login) |
| TS02 | Login com credenciais válidas | ✅ Automatizado | integração `login` + E2E `authentication` |
| TS03 | Bloqueio após 5 tentativas | ⛔ Pendente | regra de bloqueio ainda não implementada (ver §9) |
| TS04 | Recuperação de senha | ✅ Automatizado | integração `passwordRecovery` + E2E `authentication` |
| TS05 | Edição de perfil | ⛔ Pendente | funcionalidade ainda não implementada |
| TS06 | Pesquisa de trilhas | ✅ Lógica / ⚠️ UI | `utils.filterTrails` + `useDebouncedValue` (unit); UI ⌘K em `fixme` no E2E |
| TS07 | Favoritos | ✅ Automatizado | integração `favorites` (store + FavoriteButton) |
| TS08 | Marcar aula concluída | ✅ Lógica | `useStore.toggleLesson` (unit) — recomputa progresso |
| TS09 | Atualização do dashboard | ✅ Automatizado | integração `dashboardLoading` (dados + gráfico) |
| TS10 | Recomendação personalizada (IA) | ⚠️ Parcial | `api.getPersonalizedTrail` (unit); UI da IA pendente |
| TS11 | Chat IA | ⛔ Pendente | funcionalidade ainda não implementada |
| TS12 | Responsividade | ✅ Automatizado | E2E `responsive` (640 / 768 / 1280) |

Legenda: ✅ automatizado · ⚠️ parcial · ⛔ pendente de implementação do produto.

---

## 6. Estratégia de mocks

- **Mock do módulo `services/api`** (`jest.mock('@/services/api')`) nos testes de
  integração — esta é a fronteira que o protótipo usa hoje.
- **MSW** (`tests/mocks/`) entrega um contrato REST realista
  (`/api/trails`, `/api/auth/login`, `/api/auth/password-reset`, …) reutilizando as
  mesmas fixtures. **Não é iniciado** no `jest.setup.ts` ainda porque a aplicação
  não faz chamadas de rede; uma alteração documentada de um bloco ativa a
  interceptação no dia em que `services/api.ts` passar a usar `fetch`.
- **Fixtures reutilizam os mocks do projeto** (`@/mocks/*`) — fonte única de
  verdade, sem mocks duplicados.
- **`next/navigation`** é mockado uma única vez, globalmente, em `jest.setup.ts`.

---

## 7. Estratégia de cobertura

Thresholds (obrigatórios, falham o build): **statements 80 / branches 75 /
functions 80 / lines 80**.

Resultado atual nas camadas cobertas: **100 / 93 / 100 / 100** (53 testes).

O gate é restrito (`collectCoverageFrom`) às camadas de **lógica de negócio e
componentes reutilizáveis** — `utils`, `hooks`, `services`, `store`,
`components/ui`, `components/auth` — onde bugs custam caro e os testes são estáveis.
Páginas de rota grandes e majoritariamente apresentacionais (onboarding, aula,
detalhe de trilha) são **exercitadas pelos testes de integração + E2E**, mas
mantidas fora do gate para que os thresholds permaneçam significativos em vez de
diluídos por marcação. O escopo pode ser ampliado incrementalmente conforme testes
de página forem adicionados.

---

## 8. Convenções de qualidade adotadas

- ESLint: `eslint-plugin-jest`, `eslint-plugin-jest-dom`, `eslint-plugin-testing-library`
  (ex.: `no-node-access`, `prefer-user-event`, `consistent-test-it`).
- Comportamento acima de implementação; **queries por role/label**, `test-id`
  evitado.
- Padrão **AAA** (Arrange, Act, Assert), responsabilidade única, nomes descritivos,
  setup reutilizável.
- **Determinístico**: timers falsos para APIs com atraso/debounce — **sem `sleep`
  fixos**, sem esperas arbitrárias. `clearMocks` + reset de store/router entre testes.
- Fortemente tipado; **sem `any`**.

---

## 9. Melhorias futuras

1. **Ativar o MSW de verdade** quando `services/api.ts` usar `fetch` (descomentar o
   bloco no `jest.setup.ts`); o contrato + fixtures já estão prontos.
2. Implementar a **UI de busca ⌘K** e remover o `fixme` do E2E de busca
   (`filterTrails` + `useDebouncedValue` já têm testes unitários) — **TS06**.
3. Implementar e testar os critérios de aceite ainda pendentes:
   **bloqueio após 5 tentativas (TS03)**, **edição de perfil (TS05)**, **chat IA
   (TS11)** e a **UI de recomendação da IA (TS10)**, além das asserções de
   performance (**login < 3s / IA < 8s**).
4. Adicionar `@axe-core/playwright` para auditorias automáticas de acessibilidade
   por página.
5. Adotar snapshots de regressão visual para os breakpoints responsivos.
6. Ampliar o gate de cobertura para as páginas de rota à medida que os testes de
   página crescerem.
