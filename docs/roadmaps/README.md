# Nehzat Plus — Role-Based Development Roadmaps

**Initialized:** 2026-08-11 | **Branch:** `docs/roadmaps-initial`

Master index of per-role and per-module development roadmaps. Each roadmap follows the canonical [8-section template](./_template.md) and can be executed independently and in parallel.

---

## Global Rules

### Test-Driven Development

All implementation MUST follow TDD: RED (failing test) → GREEN (minimal pass) → SURFACE (real-surface artifact) → REFACTOR (optional, tests stay green).

**Shared Test Infrastructure** (`features/shared/testing-utils.ts`):
- `mountStandalone(component, { providers: [...] })` — mount standalone component with providers
- `DEFAULT_MOCK_PROVIDERS` — pre-configured mocks for AuthService, LESSON_PLANNER_API, Router, ActivatedRoute, NotificationService
- `createMockApi<T>()` — type-safe Proxy-based mock factory

**MUST reuse** these utilities. **MUST NOT** create new mock factories per module.

### Routing Guard Discipline

| Guard | Location | Purpose |
|-------|----------|---------|
| `authGuard` | `core/guards/auth.guard.ts` | Authentication only (redirect-based OIDC) |
| `adminGuard` | `core/guards/admin.guard.ts` | Admin area (admin, manager, headquarters, branch_manager) |
| `roleGuard('role')` | `core/guards/role.guard.ts` | Single-role factory |
| `serviceSurveyGuard` | `core/guards/service-survey.guard.ts` | Service survey access (parent, branch_manager, headquarters, manager) |

### Global Interference Boundary

These files **MUST NOT** be modified by any module's implementation. All changes require coordination via the central owner.

```
frontend/src/app/app.routes.ts
frontend/src/app/core/services/lesson-planner-api.interface.ts
frontend/src/app/core/services/http-lesson-planner-api.service.ts
frontend/src/app/core/services/mock-lesson-planner-api.service.ts
frontend/src/app/core/models/lesson-planner.models.ts
frontend/src/app/features/shared/**/*
frontend/src/app/core/guards/*
backend/src/EducationalPlatform.Nehzat.API/Program.cs
backend/src/EducationalPlatform.Nehzat.API/Controllers/*
backend/src/EducationalPlatform.Nehzat.Infrastructure/Data/AppDbContext.cs
```

### Commit Strategy

- Branch: `docs/roadmaps-initial`
- One commit per development wave
- Conventional Commits: `docs(roadmaps): wave N <label>`
- No force-push, no squash across waves
- Single PR for review

---

## Role Roadmaps

| File | Module | Routes | Status |
|------|--------|--------|--------|
| [admin.md](./admin.md) | `features/admin/` + 12 sub-modules | `/admin` (adminShell → '' / 'spiritual' / 'surveys') | ✅ Complete |
| [coach.md](./coach.md) | `features/coach/` | `/coach` (coach, coach-dashboard, coach-student-detail, coach-student-detail/:id) | ✅ Complete |
| [evaluator.md](./evaluator.md) | `features/evaluator/` | `/evaluator` (form, review, analytics, queue, detail/:id) | ✅ Complete |
| [parent.md](./parent.md) | `features/parent/` | `/parent` (parent, monthly-booklet, booklets, student-detail/:studentId) | ✅ Complete |
| [branch-manager.md](./branch-manager.md) | `features/branch-manager/` | `/branch-manager` (main, competition-management, league-management, competition-management/:id, league-management/:id) | ✅ Complete |
| [headquarters.md](./headquarters.md) | `features/headquarters/` | `/headquarters` (headquarters, spiritual, monthly-booklet, headquarters-dashboard) | ✅ Complete |
| [dashboard.md](./dashboard.md) | `features/dashboard/` | `/dashboard` (dashboard, assessment-taker, assessment-taker/:id, training-steps, progress-chart/:studentId) | ✅ Complete |
| [teacher.md](./teacher.md) | `features/teacher/` | `/teacher` (dashboard, courses, gradings, pending, course-detail/:id) | ✅ Complete |

---

## Subject Roadmaps

| File | Module | Routes | Status |
|------|--------|--------|--------|
| [quran.md](./quran.md) | `features/quran/` (8 pages) | 7 routes under `/quran` | ✅ Complete |
| [hadith.md](./hadith.md) | `features/hadith/` (6 pages) | 5 routes under `/hadith` | ✅ Complete |
| [persian-literature.md](./persian-literature.md) | `features/persian-literature/` | 4 pages + root-level pages | ✅ Complete |
| [arabic-literature.md](./arabic-literature.md) | `features/arabic-literature/` | course/poet/poem pages | ✅ Complete |
| [math.md](./math.md) | `features/math/` (8 pages) | math routes | ✅ Complete |
| [experimental-sciences.md](./experimental-sciences.md) | `features/experimental-sciences/` (5 pages) | 5 routes under `/experimental-sciences` | ✅ Complete |
| [arts.md](./arts.md) | `features/arts/` | 1 route `roleGuard('trainee')` | ✅ Complete |
| [social.md](./social.md) | `features/social/` | 1 route `roleGuard('trainee')` | ✅ Complete |
| [career.md](./career.md) | `features/career/` | 1 route `roleGuard('trainee')` | ✅ Complete |
| [career-pathways.md](./career-pathways.md) | `features/career-pathways/` | 1 route `roleGuard('trainee')` | ✅ Complete |
| [portfolio.md](./portfolio.md) | `features/portfolio/` | 1 route `roleGuard('trainee')` | ✅ Complete |
| [project-defense.md](./project-defense.md) | `features/project-defense/` | 1 route `roleGuard('trainee')` | ✅ Complete |
| [community-metrics.md](./community-metrics.md) | `features/community-metrics/` | 1 route `roleGuard('trainee')` | ✅ Complete |
| [training-courses.md](./training-courses.md) | `features/training-courses/` | training-courses routes | ✅ Complete |
| [learning.md](./learning.md) | `features/learning/` (4 sub-pages) | learning routes | ✅ Complete |
| [survey.md](./survey.md) | `features/survey/` (4 components + service) | 5 routes with `serviceSurveyGuard` | ✅ Complete |
| [surveys.md](./surveys.md) | `features/surveys/` → `shared/surveys/` | `/surveys` (list, take/:id) | ✅ Complete |
| [activity.md](./activity.md) | `features/activity/` | 1 route `roleGuard('trainee')` | ✅ Complete |

---

## Cross-Cutting Roadmaps

| File | Module | Purpose | Status |
|------|--------|---------|--------|
| [assessment-panel.md](./assessment-panel.md) | `features/shared/assessment-panel/` (531 LOC) | Weekly assessment generator, consumed by dashboard + evaluator | ✅ Complete |
| [spiritual-shell.md](./spiritual-shell.md) | `features/shared/spiritual-shell/` (323 LOC) | Spiritual practice container shell | ✅ Complete |
| [spiritual-path.md](./spiritual-path.md) | `features/shared/spiritual-shell/spiritual-path-panel` (143 LOC) | Spiritual path selection/ranking | ✅ Complete |
| [spiritual-occasion.md](./spiritual-occasion.md) | `features/shared/spiritual-shell/spiritual-occasion-panel` (181 LOC) | Spiritual occasion practice tracking | ✅ Complete |
| [spiritual-history.md](./spiritual-history.md) | `features/shared/spiritual-shell/spiritual-history-panel` (116 LOC) | Spiritual entry history + streak | ✅ Complete |
| [surveys-shared.md](./surveys-shared.md) | `features/shared/surveys/` + `features/survey/` | Survey component sharing + 3-way reconciliation plan | ✅ Complete |

---

## Development Waves

| Wave | Content | Files | Status |
|------|---------|-------|--------|
| **0** | Foundation: bug fixes + scaffolding + cross-cutting | 4 code fixes + `_template.md` + `README.md` + 6 cross-cutting | ✅ Complete |
| **1** | Pilot: `coach.md` + `evaluator.md` + template validation | 2 roles + QA → template rewrite | ✅ Complete |
| **2** | Core Roles: 6 role roadmaps (admin, parent, branch-manager, headquarters, dashboard, teacher) | 6 files | ✅ Complete |
| **3** | Subjects: 18 subject roadmaps (4 batches: 5+5+5+3) | 18 files | ✅ Complete |
| **4** | QA: cross-link verification + security audit + schema check | `_qa-report.md` | ✅ Complete |
| **5** | Polish: README regen + remove-ai-slops audit | README updated | ✅ Complete |
| **6** | Commit: atomic wave-level commits | 6 commits on `docs/roadmaps-initial` | ⏳ Pending |
| **7** | Review: optional external `review-work` QA | Review report | ⏳ Pending |

---

## QA Report

See [QA Report](./_qa-report.md) for full findings, including:
- 🔴 5 subject routes missing `roleGuard('trainee')` (training-courses has zero guards)
- 🟡 `TeacherController.cs` needs `[Authorize(Roles="teacher")]`

---

## Changelog

| Date | Change |
|------|--------|
| 2026-08-11 | Initialized: template, README, directory structure |
| 2026-08-11 | Wave 0: Bug fixes (dup math route, roleGuard typos, orphan learning, ITeacherService dup) + scaffolding |
| 2026-08-11 | Wave 0b: 6 cross-cutting roadmaps (assessment-panel, 4 spiritual, surveys-shared) |
| 2026-08-11 | Wave 1: Pilot roadmaps (coach, evaluator) + template validation + rewrite |
| 2026-08-11 | Wave 2: 6 role roadmaps (admin, parent, branch-manager, headquarters, dashboard, teacher) |
| 2026-08-11 | Wave 3: 18 subject roadmaps (4 batches) |
| 2026-08-11 | Wave 4: QA report — security audit, route guard verification, cross-link check |
| 2026-08-11 | Wave 5: README regen with completed status + QA report links |
| 2026-08-11 | Critical fix: AssessmentController.cs — added `[Authorize(Roles=...)]` gates (evaluator zero-gate gap) |
| 2026-08-11 | Critical fix: Otuh2RoleSeeder.cs — added `teacher` role to `RequiredRoles` + `RoleDescriptions` |
