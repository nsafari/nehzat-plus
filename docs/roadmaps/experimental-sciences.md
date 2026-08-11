# Roadmap: experimental-sciences

| Field | Value |
|-------|-------|
| **Module** | `experimental-sciences` |
| **Frontend Path** | `features/experimental-sciences/` |
| **Backend Controllers** | `ExperimentalScienceController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

Subject module for `experimental-sciences` curriculum. Trainee-focused content.

| Component | File | LOC (TS) | Notes |
|-----------|------|----------|-------|
| TopicListComponent | `pages/topic-list/topic-list.component.ts` | ~55 | Science topics |
| LessonViewComponent | `pages/lesson-view/lesson-view.component.ts` | ~95 | Lesson theory |
| ExperimentGuideComponent | `pages/experiment-guide/experiment-guide.component.ts` | ~85 | Lab guide |
| QuizComponent | `pages/quiz/quiz.component.ts` | ~110 | Quiz interface |
| ProgressDashboardComponent | `pages/progress-dashboard/progress-dashboard.component.ts` | ~75 | Progress chart |

**Routes**:
- `/experimental-sciences` (parent, authGuard)
  - `/experimental-sciences/topics` — `roleGuard('trainee')` — `TopicListComponent`
  - `/experimental-sciences/topics/:topicId/lessons` — `roleGuard('trainee')` — `LessonViewComponent`
  - `/experimental-sciences/experiments/:lessonId` — `roleGuard('trainee')` — `ExperimentGuideComponent`
  - `/experimental-sciences/quiz/:lessonId` — `roleGuard('trainee')` — `QuizComponent`
  - `/experimental-sciences/progress` — `roleGuard('trainee')` — `ProgressDashboardComponent`

**API Calls**:
- Subject-specific CRUD (via `LessonPlannerApi` interface)
- Student progress tracking
- Quiz/exam submission and grading
- History/progress records

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| ``ExperimentalScienceController`` | `/api/experimental-sciences` | varies |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getexperimental-sciencesContent` | `getexperimental-sciencesContent(): Observable<any[]>` | `any[]` |
| `getexperimental-sciencesById` | `getexperimental-sciencesById(id: string): Observable<any>` | `any` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | No unit tests for subject pages | 🟡 Medium | Regressions undetected | Medium |
| 2 | No integration tests for subject API | 🟡 Medium | API contract drift | Medium |
| 3 | No negative-access verification for roleGuard | 🟢 Low | Role guard untested | Low |
| 4 | No loading/error states in pages | 🟢 Low | Poor UX | Low |
| 5 | No experiment simulation/integration with lab API | 🟡 Medium | Experiments are static content only | Medium |

**Security Audit**:
- [[x] Top-level route has role-specific guard]
- [ ] Backend endpoints have `[Authorize(Roles="trainee")]` — needs verification
- [ ] Data isolation verified (trainee can only see own data)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Add unit tests for subject pages | `*.spec.ts` | — | Testing | 2h |
| 2 | Add loading states to pages | `*.component.ts` | — | Frontend | 1h |
| 3 | Add error handling to service | `*.service.ts` | — | Frontend | 1h |
| 4 | Verify role-based route guard | `features/experimental-sciences/` | — | Security | 0.5h |
| 5 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 1-4 | QA | 1h |

**Step Details**:

### Step 1: Add unit tests
- **Goal**: Cover all subject pages with unit tests
- **Files**: `features/experimental-sciences/**/*.spec.ts`
- **Acceptance**: 80%+ code coverage for page components

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| EXP-UT-1 | Experimental-sciences page loads | Displays content list |
| EXP-UT-2 | Handles empty state | Shows "no content" message |
| EXP-UT-3 | Service calls API | HTTP request sent |
| EXP-UT-4 | Error handling | Shows error notification |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| EXP-RT-1 | Unauthenticated user navigates | Redirect to `/auth/login` |
| EXP-RT-2 | Wrong role user navigates | Guard returns `true` (authGuard only) |
| EXP-RT-3 | Correct role (trainee) navigates | Guard returns `true` |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role | Redirect to role-specific dashboard |
| (c) | Authenticated, correct role (trainee) | Guard returns `true` |
| (d) | Case-insensitive check | `hasRole()` passes regardless of case |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

**Test Infrastructure**: MUST reuse `features/shared/testing-utils.ts`. MUST NOT create new mock factories.

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `core/services/auth` | Route guard | Yes |
| `core/models/lesson-planner` | Type definitions | Yes |
| `core/services/lesson-planner-api` | API interface | Yes |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `coach` | Coach views student progress | Progress data unavailable |
| `dashboard` | Student self-view | Content incomplete |

---

## 7. Interference Boundary

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
- frontend/src/app/features/dashboard/**/*
- frontend/src/app/features/coach/**/*
- frontend/src/app/features/admin/**/*
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: Experimental-sciences page renders correctly
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
