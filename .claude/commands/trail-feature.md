---
description: Implement any feature for Trail — a Rocketseat/DIO-style Brazilian learning platform. Full-stack: Next.js 15 frontend + ASP.NET Core backend + SQL Server. Use for new pages, API endpoints, UI improvements, DB migrations, seeder updates.
---

You are a senior full-stack developer implementing a feature for **Trail** — a Brazilian developer education platform modelled after Rocketseat and DIO.

## Repositories

|          | Path                            |
| -------- | ------------------------------- |
| Frontend | `/home/mxs2/dev/trail-frontend` |
| Backend  | `/home/mxs2/dev/trail-backend`  |

Frontend proxies `/api/*` → `http://localhost:5108/*` (Next.js rewrite in `next.config.ts`), so no CORS configuration is needed.

---

## Design System

- **Primary** `#FF6200` (orange) — maps to `primary.main` in MUI
- **Violet** `#A78BFA` — mentor/secondary accent
- **Teal** `#5EEAD4` — success/student accent
- **Backgrounds**: `tokens.bg[0]` `#0B1220` · `tokens.bg[3]` `#1A2236` · `tokens.bg[4]` `#222C44`
- **Lines**: `tokens.line.default` `rgba(255,255,255,0.07)` · `tokens.line.strong` `rgba(255,255,255,0.12)`
- **Text**: `tokens.text[2]` `#8B96A8` (muted) · `tokens.text[3]` `#5B6578` (faint)
- **Orange soft/ring** — `tokens.orange.soft` / `tokens.orange.ring`
- **Violet soft/ring** — `tokens.violet.soft` / `tokens.violet.ring`
- **Typography**: `var(--f-serif)` for headings · `var(--f-mono)` for numbers/code
- Import tokens: `import { tokens } from '@/lib/tokens'`

### MUI v9 gotchas (always apply these)

- `slotProps={{ htmlInput: { maxLength: N } }}` — NOT `inputProps`
- `slotProps={{ paper: { sx: {...} } }}` — NOT `PaperProps` on Dialog
- Chip colors via `sx` directly, not `color` prop

---

## Roles & Seeded Accounts

| Role    | Email             | Password  | Frontend mapping |
| ------- | ----------------- | --------- | ---------------- |
| Manager | manager@trail.com | Senha@123 | `'admin'`        |
| Mentor  | mentor@trail.com  | Senha@123 | `'mentor'`       |
| Student | student@trail.com | Senha@123 | `'aluno'`        |

Role enum (C#): `Student=0, Mentor=1, Manager=2`

---

## Complete API Reference

### Auth — `/auth/*`

```
POST /auth/register       {name, email, password, role:0}  →  LoginResponse
POST /auth/login          {email, password}                →  LoginResponse
GET  /auth/me                                              →  UserSummaryResponse
POST /auth/refresh        {refreshToken}                   →  LoginResponse
POST /auth/logout         {refreshToken}                   →  204
GET  /auth/profile                                         →  UserSummaryResponse
PUT  /auth/profile        {name}                           →  204
GET  /auth/settings                                        →  UserSettingsResponse
PUT  /auth/settings       {twoFactorEnabled, publicProfile, emailNotifications,
                           studyReminder, aiSuggestions, weeklyReport, language,
                           dailyStudyGoal, autoplay, subtitles}  →  204
GET  /auth/activity/weekly                                 →  WeeklyActivityResponse[]
```

### Trails — `/trails/*`

```
GET    /trails                         all roles  →  TrailResponse[]
GET    /trails/{id}                    all roles  →  TrailResponse
POST   /trails         {name,description}  Manager  →  201 TrailResponse
PUT    /trails/{id}    {name,description}  Manager  →  200 TrailResponse
DELETE /trails/{id}                    Manager  →  204 / 409(has submissions)
GET    /trails/{id}/challenges         all roles  →  ChallengeResponse[]
POST   /trails/{id}/challenges  {title,description,order}  Manager  →  201 ChallengeResponse
PUT    /trails/{id}/challenges/{cid}   {title,description,order}  Manager  →  200 ChallengeResponse
DELETE /trails/{id}/challenges/{cid}   Manager  →  204 / 409(has submissions)
```

### Students & Submissions — `/students/*`, `/submissions/*`, `/metrics/*`

```
GET  /students/{id}/progress                         →  StudentProgressResponse
POST /submissions      {challengeId, deliveryUrl}    Student only  →  201 SubmissionResponse
GET  /submissions                                    Mentor|Manager  →  SubmissionResponse[]
PUT  /submissions/{id}/review  {score, feedback}     Mentor only  →  200 SubmissionResponse
GET  /metrics/overview                               Mentor|Manager  →  MetricsOverviewResponse
```

---

## Backend Architecture

```
Trail.Api/
├── Controllers/          — one controller per resource, use [Authorize(Roles="...")]
├── Application/Services/ — business logic, inject AppDbContext
├── DTOs/                 — records per endpoint (request/response)
│   ├── Auth/
│   ├── Trails/
│   ├── Common/
│   ├── Students/
│   ├── Submissions/
│   └── Metrics/
├── Domain/
│   ├── Entities/         — EF Core entities (no annotations, config in OnModelCreating)
│   └── Enums/            — UserRole, SubmissionStatus
└── Infrastructure/
    └── Data/
        ├── AppDbContext.cs   — DbSets + OnModelCreating config
        └── DbSeeder.cs       — idempotent seed data
```

### Entity shapes (abbreviated)

```csharp
Trail:           Id, Name, Description, CreatedAt, Challenges[], Enrollments[]
Challenge:       Id, TrailId, Title, Description, Order, CreatedAt, Submissions[]
Submission:      Id, StudentId, ChallengeId, DeliveryUrl, SubmittedAt,
                 Status(Submitted|Reviewed), ReviewerId?, Score?, Feedback?, ReviewedAt?
TrailEnrollment: Id, UserId, TrailId, EnrolledAt, CompletedAt?
User:            Id, Name, Email, PasswordHash, Role, CreatedAt, Settings, Activities
UserSettings:    Id, UserId, (all settings booleans + strings)
UserActivity:    Id, UserId, ActivityType, TargetType?, TargetId?, Minutes, OccurredAt
RefreshToken:    Id, UserId, TokenHash, ExpiresAt, CreatedAt, RevokedAt?
```

### Adding a migration (when you change an entity)

```sh
cd /home/mxs2/dev/trail-backend
dotnet ef migrations add <PascalCaseName> --project Trail.Api
dotnet ef database update --project Trail.Api
```

### Rebuilding the backend

```sh
kill $(lsof -ti:5108) 2>/dev/null
cd /home/mxs2/dev/trail-backend && dotnet run --project Trail.Api
```

---

## Frontend Architecture

```
app/
├── (app)/              — authenticated (RequireAuth + AppShell)
│   ├── dashboard/      — role-specific home
│   ├── trilha/         — trail list + [id]/ trail detail
│   ├── progresso/      — progress & achievements
│   ├── perfil/         — profile
│   └── configuracoes/  — settings
├── (auth)/             — public / pre-auth
│   ├── signin/ signup/ recuperar-senha/
│   ├── explorar/       — public trail discovery
│   └── onboarding/     — post-signup trail picker
├── admin/              — Manager only (RequireRole role="admin" + AppShell)
│   └── trails/         — trail CRUD + [id]/edit/
└── page.tsx            — landing page
```

### Key files

| File                              | Purpose                                                                                 |
| --------------------------------- | --------------------------------------------------------------------------------------- |
| `services/api.ts`                 | All API calls via `apiFetch`. Auth headers auto-injected. Parses ProblemDetails errors. |
| `store/useStore.ts`               | Zustand. Persists `user` + `favorites`. Ephemeral: `trails`, `currentTrail`, etc.       |
| `types/trail.ts`                  | Trail, TrailModule, Lesson, Challenge, AiRecomendacao                                   |
| `types/user.ts`                   | User (role: `'aluno' \| 'mentor' \| 'admin'`), WeeklyActivity                           |
| `components/auth/RequireAuth.tsx` | Auth guard + seeds trails from API                                                      |
| `components/auth/RequireRole.tsx` | Role-specific guard (redirects to /signin or /dashboard)                                |
| `components/layout/Sidebar.tsx`   | Nav with role-aware sections (Admin, Mentor)                                            |
| `lib/tokens.ts`                   | Design tokens                                                                           |

### `apiFetch` pattern (already handles everything)

```typescript
// In services/api.ts — use this pattern for new API methods:
async myNewMethod(data: MyRequest): Promise<MyResponse> {
  return apiFetch<MyResponse>('/endpoint', {
    method: 'POST',
    body: JSON.stringify(data),
  });
},
```

### Adding a page

1. Create `app/(app)/<name>/page.tsx` with `'use client'` if it uses hooks
2. Add nav link to `components/layout/Sidebar.tsx` MAIN_NAV or GENERAL_NAV
3. Add breadcrumb label to `ROUTE_LABELS` in `components/layout/Topbar.tsx`

### Adding an admin page

1. Create `app/admin/<name>/page.tsx` — auto-protected by `app/admin/layout.tsx`
2. Add to `ADMIN_NAV` in `Sidebar.tsx`

---

## Feature Patterns

### Adding a new trail via API (Manager flow)

1. POST `/trails` → get trail ID
2. POST `/trails/{id}/challenges` for each challenge
3. Refresh store: `api.getTrails().then(setTrails)`

### Submitting a challenge (Student flow)

```typescript
await api.createSubmission({ challengeId: 'uuid', deliveryUrl: 'https://github.com/...' });
```

### Reviewing a submission (Mentor flow)

```typescript
await api.reviewSubmission(submissionId, { score: 85, feedback: 'Boa entrega!' });
```

### Enrolling a student in a trail

Currently no endpoint — to add: create `POST /trails/{id}/enroll` → creates TrailEnrollment.

---

## Rocketseat / DIO Design Goals

When building UI, aim for:

- **Course cards**: technology stack badges (colored chips), level indicator, estimated hours, enrolled count
- **XP & level**: progress bar from current level to next, XP points earned per challenge
- **Streak**: fire icon + consecutive days counter
- **Achievements / badges**: grid of unlocked vs locked achievements
- **Leaderboard**: student ranking by completed challenges / XP
- **Trail detail**: expandable challenge list with status (pending/submitted/reviewed)
- **Certificate**: issued on 100% trail completion
- **Activity feed**: recent submissions, reviews, enrollments

---

## Current Task

$ARGUMENTS
