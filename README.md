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

Os testes usam **Vitest** + **React Testing Library** rodando em ambiente `jsdom` — não é necessário subir o backend nem o servidor de dev. O `next/link` é mockado e os componentes são renderizados dentro do `ThemeProvider` do MUI (ver `test/test-utils.tsx`). As páginas mockam o serviço `@/services/api` para usar dados determinísticos.

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
npx vitest run __tests__/components/Navbar.test.tsx
```

### O que é coberto

| Tipo | Arquivo | Foco |
|------|---------|------|
| Componente | `__tests__/components/FeatureCard.test.tsx` | Render de props (título, descrição, ícone) |
| Componente | `__tests__/components/Navbar.test.tsx` | Links de navegação e seus `href` |
| Componente | `__tests__/components/LandingHero.test.tsx` | CTAs, subtítulo e badge |
| Componente | `__tests__/components/LandingStats.test.tsx` | Valores e rótulos de estatísticas |
| Componente | `__tests__/components/LandingFeatures.test.tsx` | Um card por feature, título da seção |
| Componente | `__tests__/components/LoadingSkeleton.test.tsx` | Placeholders de carregamento |
| Serviço | `__tests__/services/api.test.ts` | Contrato de `getTrails`, `getTrailById`, `createTrail`, `updateTrailStatus`, `login` |
| Store | `__tests__/store/useStore.test.ts` | Ações do Zustand (`setUser`, `setTrails`, `setIsLoading`) |
| Página | `__tests__/pages/TrailsPage.test.tsx` | Render após fetch, filtro de busca, estado vazio |
| Página | `__tests__/pages/DashboardPage.test.tsx` | Métricas e listagem de trilhas |

---

## Estrutura de pastas

```
trail-frontend/
├── app/                  # Rotas e páginas (App Router)
│   ├── trails/           # Listagem e detalhe de trilhas
│   └── dashboard/        # Dashboard administrativo
├── components/           # Componentes de UI reutilizáveis
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
