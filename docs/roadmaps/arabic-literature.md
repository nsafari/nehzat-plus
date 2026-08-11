# Roadmap: arabic-literature

| Field | Value |
|-------|-------|
| **Module** | `arabic-literature` |
| **Frontend Path** | `features/arabic-literature/` |
| **Backend Controllers** | `ArabicLiteratureController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

Subject module for `arabic-literature` curriculum. Trainee-focused content via `roleGuard('trainee')`.

| Component | File | LOC (TS) | Notes |
|-----------|------|----------|-------|
| CourseListComponent | `pages/course-list/course-list.component.ts` | ~50 | Course catalog |
| CourseDetailComponent | `pages/course-detail/course-detail.component.ts` | ~90 | Course detail |
| LessonViewComponent | `pages/lesson-view/lesson-view.component.ts` | ~100 | Lesson content |
| PoetListComponent | `pages/poet-list/poet-list.component.ts` | ~60 | Poet listing |
| PoetDetailComponent | `pages/poet-detail/poet-detail.component.ts` | ~90 | Poet detail |
| PoemListComponent | `pages/poem-list/poem-list.component.ts` | ~70 | Poem catalog |
| PoemDetailComponent | `pages/poem-detail/poem-detail.component.ts` | ~110 | Poem view |

**Routes**:
- `/arabic-literature` (parent, authGuard) — 7 routes, NO roleGuard
  - `/arabic-literature/courses` — `CourseListComponent`
  - `/arabic-literature/courses/:id` — `CourseDetailComponent`
  - `/arabic-literature/lessons/:id` — `LessonViewComponent`
  - `/arabic-literature/poets` — `PoetListComponent`
  - `/arabic-literature/poets/:id` — `PoetDetailComponent`
  - `/arabic-literature/poems` — `PoemListComponent`
  - `/arabic-literature/poems/:id` — `PoemDetailComponent`

**API Calls**:
- Subject-specific CRUD (via `LessonPlannerApi` interface)
- Student progress tracking per topic
- Quiz/exam submission and grading
- Recitation/performance history (where applicable)



---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| `ArabicLiteratureController` | `/arabicliterature` | GET, POST, GET (by id) |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getArabic-literatureContent` | `getArabic-literatureContent(): Observable<any[]>` | `any[]` |
| `getArabic-literatureById` | `getArabic-literatureById(id: string): Observable<any>` | `any` |
| `submitArabic-literatureQuiz` | `submitArabic-literatureQuiz(id: string, answers: any): Observable<QuizResult>` | `QuizResult` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | No unit tests for subject pages | 🟡 Medium | Regressions undetected | Medium |
| 2 | No integration tests for subject API | 🟡 Medium | API contract drift | Medium |
| 3 | No negative-access verification for roleGuard | 🟢 Low | Role guard untested | Low |
| 4 | No loading/error states in pages | 🟢 Low | Poor UX | Low |
| 5 | **CRITICAL**: Routes use `authGuard` only — NO `roleGuard('trainee')` | 🔴 Critical | Any authenticated user can access Arabic literature | Low |

**Security Audit**:
- [x] Top-level route has role-specific guard (`roleGuard('trainee')`)
- [ ] Backend endpoints have `[Authorize(Roles="trainee")]` — needs verification
- [ ] Data isolation verified (trainee can only see own progress)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Add unit tests for subject pages | `*.spec.ts` | — | Testing | 2h |
| 2 | Add loading states to pages | `*.component.ts` | — | Frontend | 1h |
| 3 | Add error handling to service | `*.service.ts` | — | Frontend | 1h |
| 4 | Write integration tests for API | `IntegrationTests/` | Step 3 | Testing | 1.5h |
| 5 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 1-4 | QA | 1h |

**Step Details**:

### Step 1: Add unit tests
- **Goal**: Cover all subject pages with unit tests
- **Files**: `features/arabic-literature/**/*.spec.ts`
- **Acceptance**: 80%+ code coverage for page components

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| ARA-UT-1 | Arabic-literature page loads with content | Displays content list |
| ARA-UT-2 | Arabic-literature page handles empty state | Shows "no content" message |
| ARA-UT-3 | Service fetches correct API endpoint | HTTP request to proper prefix |
| ARA-UT-4 | Service handles 401 error | Redirects to login |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| ARA-RT-1 | Unauthenticated user navigates to `/arabic-literature` | Redirect to `/auth/login` |
| ARA-RT-2 | Admin user navigates to `/arabic-literature` | Component loads (authGuard only) |
| ARA-RT-3 | Trainee user navigates to `/arabic-literature` | Content loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role (coach) | Redirect to role-specific dashboard |
| (c) | Authenticated, correct role (trainee) | Guard returns `true` |
| (d) | Case-insensitive check | `hasRole()` passes regardless of case |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

**Test Infrastructure**: MUST reuse `features/shared/testing-utils.ts`. MUST NOT create new mock factories.

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `core/services/auth` | `roleGuard('trainee')` | Yes |
| `core/models/lesson-planner` | Type definitions | Yes |
| `core/services/lesson-planner-api` | API interface | Yes |
| `dashboard` | Student progress data | Yes |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `coach` | Coach views student arabic-literature progress | Progress data unavailable |
| `evaluator` | Evaluator views student arabic-literature assessments | Assessment history incomplete |
| `parent` | Parent views child arabic-literature progress | Progress data unavailable |

---

## 7. Interference Boundary

These files **MUST NOT** be modified by this module's implementation.

### Globally Locked (all roadmaps)
```
MUST NOT modify:
- frontend/src/app/app.routes.ts
- frontend/src/app/core/services/lesson-planner-api.interface.ts
- frontend/src/app/core/services/http-lesson-planner-api.service.ts
- frontend/src/app/core/services/mock-lesson-planner-api.service.ts
- frontend/src/app/core/models/lesson-planner.models.ts
- frontend/src/app/features/shared/**/* (internals)
- frontend/src/app/core/guards/*
- backend/src/EducationalPlatform.Nehzat.API/Program.cs
- backend/src/EducationalPlatform.Nehzat.API/Controllers/*
- backend/src/EducationalPlatform.Nehzat.Infrastructure/Data/AppDbContext.cs
```

### Module-Specific Locked
```
MUST NOT modify:
- frontend/src/app/features/dashboard/**/* (trainee dashboard)
- frontend/src/app/features/coach/**/* (coach role)
- frontend/src/app/features/admin/**/* (admin role)
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: Arabic-literature page renders with content
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
