# Trail Frontend — Migration Notes

Registro de decisões tomadas durante a reescrita (branch `develop`).
Atualizar este arquivo a cada fase concluída.

---

## Arquivos Descartados

### Componentes (substituídos nas fases seguintes)

| Arquivo                          | Motivo                                                           |
| -------------------------------- | ---------------------------------------------------------------- |
| `components/Navbar.tsx`          | Substituído por `AppShell` + `Sidebar` + `Topbar`                |
| `components/LandingHero.tsx`     | Reescrito com dark theme em `components/landing/`                |
| `components/LandingFeatures.tsx` | Reescrito com dark theme                                         |
| `components/LandingStats.tsx`    | Reescrito com dark theme                                         |
| `components/Footer.tsx`          | Reescrito com dark theme                                         |
| `components/FeatureCard.tsx`     | Reescrito com dark theme                                         |
| `components/LoadingSkeleton.tsx` | Padrão de skeleton refeito via MUI `Skeleton` direto nas páginas |

### Páginas (reescritas do zero)

| Arquivo                         | Destino                                                    |
| ------------------------------- | ---------------------------------------------------------- |
| `app/page.tsx`                  | Reescrito — landing dark theme                             |
| `app/dashboard/page.tsx`        | Movido para `app/(app)/dashboard/page.tsx`                 |
| `app/dashboard/create/page.tsx` | **Removido** — criação de trilhas não está no MVP do aluno |
| `app/trails/page.tsx`           | **Removido** — ver "Rotas removidas" abaixo                |
| `app/trails/[id]/page.tsx`      | Renomeado para `app/(app)/trilha/[id]/page.tsx`            |

### Config / Infraestrutura reescrita

| Arquivo             | Motivo                                                           |
| ------------------- | ---------------------------------------------------------------- |
| `app/providers.tsx` | Reescrito — tema light descartado, dark theme com tokens Avanade |
| `app/globals.css`   | Reescrito — removidas variáveis Polaris/Shopify, reset mínimo    |

---

## Decisões de Tema

### Dark-first

O MVP usa exclusivamente dark theme (modo `dark` do MUI).
Suporte a light theme (HU de configurações de usuário) está fora do escopo do MVP e deve
ser implementado em fase posterior. **Não adicionar toggle de tema antes dessa HU ser priorizada.**

### Cor primária: `#FF6200`

Cor oficial da Avanade conforme briefing.
O protótipo Claude Design usou `#FF6B2B` (variação levemente mais quente) — decisão foi usar
a cor oficial do briefing. Derivadas:

| Token           | Valor                 | Uso                                   |
| --------------- | --------------------- | ------------------------------------- |
| `primary.main`  | `#FF6200`             | Botões CTA, links ativos, indicadores |
| `primary.light` | `#FF7A1F`             | Hover state                           |
| `primary.dark`  | `#E55A00`             | Pressed / active state                |
| `orange-soft`   | `rgba(255,98,0,0.14)` | Fundo de badges orange                |
| `orange-ring`   | `rgba(255,98,0,0.35)` | Border de badges orange               |

### Superfícies (dark navy family)

| Token              | Valor                | Uso MUI                          |
| ------------------ | -------------------- | -------------------------------- |
| `--bg-0` `#0B1220` | Sidebar background   | fora do `palette.background`     |
| `--bg-1` `#0E1524` | Página (body)        | `palette.background.default`     |
| `--bg-2` `#131B2E` | Cards                | `palette.background.paper`       |
| `--bg-3` `#1A2236` | Raised / hover cards | `tokens.bg[3]` em `lib/theme.ts` |
| `--bg-4` `#222C44` | Hover interativo     | `tokens.bg[4]` em `lib/theme.ts` |

Tokens sem equivalente MUI direto são exportados como `tokens` de `lib/theme.ts`
e usados via `sx` nos componentes.

### Tipografia

- Body: **Inter** (Google Fonts, via `next/font`)
- Display / headings editoriais: **Instrument Serif** (italic, serif)
- Código / labels mono: **JetBrains Mono**

---

## Rotas Removidas vs. Plano Original

| Rota                | Status       | Razão                                                                                                                                      |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `/trilha` (lista)   | **Removida** | Protótipo não entregou tela de lista. Menu "Minhas Trilhas" no sidebar aponta para `/dashboard`, que já exibe a lista de trilhas do aluno. |
| `/trails`           | **Removida** | Nome anglicado substituído por `/trilha/[id]`                                                                                              |
| `/dashboard/create` | **Removida** | Admin flow fora do escopo do MVP do aluno                                                                                                  |

### Mapa de rotas final

```
/                          → Landing (pública)
/(auth)/signin             → Login
/(auth)/signup             → Cadastro
/(auth)/onboarding         → Onboarding pós-cadastro
/(app)/dashboard           → Home do aluno (inclui lista de trilhas)
/(app)/trilha/[id]         → Detalhe da trilha + módulos
/(app)/aula/[id]           → Player de aula
/(app)/progresso           → Progresso geral
/(app)/perfil              → Perfil do aluno
/(app)/mentor              → Visão do mentor (baixa prioridade)
```

---

## Desvios do Briefing Original

| Item                 | Briefing                    | Decisão                                                                                 |
| -------------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| Cor primária         | `#FF6200`                   | Mantida (`#FF6B2B` do protótipo descartada)                                             |
| Lista de trilhas     | Tela dedicada `/trilha`     | Incorporada ao dashboard (sem tela separada)                                            |
| Segoe UI             | Font principal Avanade      | Substituída por Inter — Segoe UI não está no Google Fonts e é proprietária da Microsoft |
| Admin (criar trilha) | Presente no código original | Fora do MVP — removida                                                                  |

---

## Desvios de Tipagem (Fase 2)

Campos do protótipo que não existiam no plano original e foram incorporados à tipagem:

| Campo                        | Tipo           | Origem    | Decisão                                                                               |
| ---------------------------- | -------------- | --------- | ------------------------------------------------------------------------------------- |
| `Trail.subtitle`             | `string`       | `data.js` | Adicionado — frase descritiva curta da trilha                                         |
| `Trail.color`                | `string` (hex) | `data.js` | Adicionado — accent color individual de cada trilha                                   |
| `Trail.hoursTotal/hoursDone` | `number`       | `data.js` | Adicionado — separado de `lessonsTotal/lessonsDone`                                   |
| `TrailModule.id`             | `string`       | gerado    | Prototype não tinha IDs nos módulos; adicionados com padrão `{trailId}-m{index}`      |
| `Lesson.id`                  | `string`       | gerado    | Prototype não tinha IDs nas aulas; adicionados com padrão `{trailId}-m{mIdx}-l{lIdx}` |
| `WeeklyActivity`             | interface      | `data.js` | Movida para `types/user.ts` (é dado do usuário, não da trilha)                        |

Campos do plano original que **não existem** no protótipo e foram mantidos mesmo assim:

| Campo                 | Tipo     | Justificativa                                                                   |
| --------------------- | -------- | ------------------------------------------------------------------------------- |
| `User.avatarInitials` | `string` | Prototype usa initials no sidebar profile; campo explícito facilita componentes |
| `User.level`          | `number` | Sidebar exibe "Aluno · Nível 2"; campo necessário                               |
| `User.joinedAt`       | `string` | Necessário para cálculos de tempo ("5ª semana de estudos")                      |

---

---

## Fase 5 — Autenticação

### Arquivos criados

| Arquivo                             | Descrição                                       |
| ----------------------------------- | ----------------------------------------------- |
| `app/(auth)/signin/page.tsx`        | Página de login                                 |
| `app/(auth)/signup/page.tsx`        | Página de cadastro                              |
| `components/auth/AuthShell.tsx`     | Wrapper 50/50 split (form + painel de features) |
| `components/auth/PasswordField.tsx` | MUI TextField com toggle show/hide              |

### Arquivos alterados

| Arquivo                 | Mudança                                                |
| ----------------------- | ------------------------------------------------------ |
| `app/(auth)/layout.tsx` | Simplificado — AuthShell gerencia o layout full-screen |
| `services/api.ts`       | Adicionados `login()` e `register()` (mock com delay)  |
| `store/useStore.ts`     | Adicionado middleware `persist` do Zustand             |

### Persistência de sessão

`user` persiste em `localStorage` via `zustand/persist` (key: `trail-auth`).
Somente `user` é persistido via `partialize` — trails, currentTrail, aiRecomendacao
e isLoading são re-fetched ao montar cada página.

**Quando auth real for implementada:** substituir por httpOnly cookie server-side
e remover o middleware `persist` do store (ou mantê-lo como cache secundário).

### Fluxo de navegação

- `signin` success → `/dashboard`
- `signup` success → `/onboarding` (rota existe no mapa; página implementada na Fase 6)
- Google/GitHub: botões presentes na UI, sem implementação (OAuth fora do MVP)
- "Esqueci minha senha": link presente na UI, sem página (fora do MVP)

_Última atualização: Fase 5 — Autenticação_
