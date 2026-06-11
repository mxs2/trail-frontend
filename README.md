# Trail — Frontend

Interface web do **Projeto Trail**, plataforma de gestão de trilhas de aprendizagem, desafios técnicos e fluxos de mentoria para o Programa Residência Porto Digital, com mentoria técnica da Avanade.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| UI | Material UI (MUI) 9 |
| Estado | Zustand |
| Testes | Vitest + React Testing Library |

---

## Pré-requisitos

- [Node.js](https://nodejs.org) 20+
- npm 10+

---

## Como rodar localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Subir o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

### Outros scripts

```bash
npm run build   # build de produção
npm run start   # sobe o build de produção
npm run lint    # checagem de lint (ESLint)
```

---

## Testes

Os testes usam **Vitest** + **React Testing Library** rodando em ambiente `jsdom` — não é necessário subir o backend nem o servidor de dev. O `next/link` e o `next/image` são mockados e os componentes são renderizados dentro do `ThemeProvider` do MUI (ver `test/test-utils.tsx`). O teste de serviço mocka o `fetch` global; as páginas mockam o `next/navigation` (router) e a fachada `@/services/api`, alimentando o store Zustand com dados determinísticos dos mocks.

### Rodar todos os testes

```bash
npm test
```

### Modo watch (re-executa ao salvar)

```bash
npm run test:watch
```

### Rodar um arquivo específico

```bash
npx vitest run __tests__/components/LandingNavbar.test.tsx
```

### O que é coberto

| Tipo | Arquivo | Foco |
|------|---------|------|
| Componente | `__tests__/components/LandingNavbar.test.tsx` | Links de navegação/CTAs (`/signin`, `/signup`) e logo |
| Componente | `__tests__/components/LandingHero.test.tsx` | CTA primário, título, eyebrow e métricas |
| Componente | `__tests__/components/LandingStats.test.tsx` | Passos do "Como funciona" e depoimento |
| Componente | `__tests__/components/LandingFeatures.test.tsx` | Um card por pilar e título da seção |
| Serviço | `__tests__/services/api.test.ts` | `getTrails`: mapeamento da resposta do backend, defaults, header de auth e erro |
| Store | `__tests__/store/useStore.test.ts` | Ações do Zustand (`setUser`, `setTrails`, `updateTrailProgress`, `toggleFavorite`) |
| Página | `__tests__/pages/DashboardPage.test.tsx` | Saudação, papel, trilhas e atividade semanal |
| Página | `__tests__/pages/ProgressoPage.test.tsx` | Cabeçalho, trilhas em andamento e conquistas |

---

## Estrutura de pastas

```
trail-frontend/
├── app/                  # Rotas e páginas (App Router)
│   ├── (app)/            # Área autenticada (dashboard, trilha, progresso, aula)
│   └── (auth)/           # Fluxos de acesso (signin, signup, onboarding)
├── components/           # Componentes de UI (landing, layout, auth, ui)
├── mocks/                # Dados mockados (trilhas, usuário, atividade)
├── services/             # Cliente de API (mockado nesta fase)
├── store/                # Estado global (Zustand)
├── types/                # Tipos TypeScript compartilhados
├── __tests__/            # Testes (Vitest + RTL)
├── test/                 # Helpers de teste (render com tema)
├── vitest.config.ts      # Configuração do Vitest
└── vitest.setup.ts       # Setup global dos testes
```

---

**Mentoria técnica: Avanade | Programa: Porto Digital — Residência**
