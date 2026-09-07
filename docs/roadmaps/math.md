# Roadmap: math

| Field | Value |
|-------|-------|
| **Module** | `math` |
| **Frontend Path** | `features/math/` |
| **Backend Controllers** | `MathController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

Subject module for `math` curriculum. Trainee-focused content via `roleGuard('trainee')`.

| Component | File | LOC (TS) | Notes |
|-----------|------|----------|-------|
| MathTopicListComponent | `pages/math-topic-list.component.ts` | ~50 | Topic browser |
| MathLessonListComponent | `pages/math-lesson-list.component.ts` | ~60 | Lessons by topic |
| MathLessonDetailComponent | `pages/math-lesson-detail.component.ts` | ~120 | Lesson detail |
| MathPracticeComponent | `pages/math-practice.component.ts` | ~150 | Practice exercises |
| MathScholarsComponent | `pages/math-scholars.component.ts` | ~40 | Mathematician list |
| MathScholarDetailComponent | `pages/math-scholar-detail.component.ts` | ~80 | Scholar bio |
| MathProgressComponent | `pages/math-progress.component.ts` | ~100 | Progress tracking |

**Routes**:
- `/math` — 7 routes, `authGuard` only (NO `roleGuard`)
  - `/math/topics` — `MathTopicListComponent`
  - `/math/topics/:topicId/lessons` — `MathLessonListComponent`
  - `/math/lessons/:lessonId` — `MathLessonDetailComponent`
  - `/math/lessons/:lessonId/practice` — `MathPracticeComponent`
  - `/math/scholars` — `MathScholarsComponent`
  - `/math/scholars/:scholarId` — `MathScholarDetailComponent`
  - `/math/progress` — `MathProgressComponent`

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
| `MathController` | `/math` | GET, POST, GET (by id) |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getMathContent` | `getMathContent(): Observable<any[]>` | `any[]` |
| `getMathById` | `getMathById(id: string): Observable<any>` | `any` |
| `submitMathQuiz` | `submitMathQuiz(id: string, answers: any): Observable<QuizResult>` | `QuizResult` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | No unit tests for subject pages | 🟡 Medium | Regressions undetected | Medium |
| 2 | No integration tests for subject API | 🟡 Medium | API contract drift | Medium |
| 3 | No negative-access verification for roleGuard | 🟢 Low | Role guard untested | Low |
| 4 | No loading/error states in pages | 🟢 Low | Poor UX | Low |
| 5 | **CRITICAL**: Routes use `authGuard` only — NO `roleGuard('trainee')` on any route | 🔴 Critical | Any authenticated user can access math content | Low |

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
- **Files**: `features/math/**/*.spec.ts`
- **Acceptance**: 80%+ code coverage for page components

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| MAT-UT-1 | Math page loads with content | Displays content list |
| MAT-UT-2 | Math page handles empty state | Shows "no content" message |
| MAT-UT-3 | Service fetches correct API endpoint | HTTP request to proper prefix |
| MAT-UT-4 | Service handles 401 error | Redirects to login |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| MAT-RT-1 | Unauthenticated user navigates to `/math` | Redirect to `/auth/login` |
| MAT-RT-2 | Admin user navigates to `/math` | Component loads (authGuard only) |
| MAT-RT-3 | Trainee user navigates to `/math` | Content loads |

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
| `coach` | Coach views student math progress | Progress data unavailable |
| `evaluator` | Evaluator views student math assessments | Assessment history incomplete |
| `parent` | Parent views child math progress | Progress data unavailable |

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
- [ ] Manual QA: Math page renders with content
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
