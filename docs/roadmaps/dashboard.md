# Roadmap: dashboard

| Field | Value |
|-------|-------|
| **Module** | `dashboard` (trainee role) |
| **Frontend Path** | `features/dashboard/` |
| **Backend Controllers** | `AssessmentController`, `StudentController`, `XpController`, `SrsController`, `DailyActivityController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

| Component | File | LOC (TS) | LOC (HTML) | LOC (SCSS) | Notes |
|-----------|------|----------|------------|------------|-------|
| DashboardComponent | `dashboard.component.ts` | ~714 | ~600 | ~380 | **Largest frontend file** (23613 bytes) |
| AssessmentTakerComponent | `dashboard/assessment-taker/assessment-taker.component.ts` | ~270 | ~210 | ~200 | Takes assessments |
| ProgressChartComponent | `dashboard/progress-chart/progress-chart.component.ts` | ~190 | ~15 | ~15 | Chart display |
| DashboardTrainingStepsComponent | `dashboard/dashboard-training-steps/dashboard-training-steps.component.ts` | ~10 | ~165 | ~75 | **Extremely thin** (300 bytes TS) |

**Routes** (2 routes, `roleGuard('trainee')`):
- `/dashboard` — `DashboardComponent` (lazy-loaded)
- `/dashboard/spiritual` — `TraineeSpiritualPageComponent` (via `SpiritualShellComponent`)

**API Calls**:
- `getDailyAssignments()` — today's assignments
- `submitAssignment()` — submit work
- `getStudentProgress()` — overall progress
- `getAssessmentHistory()` — assessment results
- `getXpBalance()` — XP balance
- `getStreakCount()` — streak info
- `startAssessment()` — start taking an assessment
- `submitAssessmentResult()` — submit assessment answers

**Key finding from PAGE_LAYER_REPORT.md**: 3 unfinished items remain from the layer report.

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| `AssessmentController` | `/api/assessments` | GET, POST (shared) |
| `StudentController` | `/api/students` | GET, GET (assignments), PUT (submission) |
| `XpController` | `/api/xp` | GET, POST |
| `SrsController` | `/api/srs` | GET, POST, PUT |
| `DailyActivityController` | `/api/daily-activities` | GET, POST |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getDailyAssignments` | `getDailyAssignments(): Observable<Assignment[]>` | `Assignment[]` |
| `submitAssignment` | `submitAssignment(dto: SubmitAssignmentRequest): Observable<SubmissionResult>` | `SubmissionResult` |
| `getStudentProgress` | `getStudentProgress(): Observable<StudentProgress>` | `StudentProgress` |
| `getAssessmentHistory` | `getAssessmentHistory(): Observable<AssessmentResult[]>` | `AssessmentResult[]` |
| `getXpBalance` | `getXpBalance(): Observable<number>` | `number` |
| `getStreakCount` | `getStreakCount(): Observable<number>` | `number` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | `DashboardComponent` (~714 LOC, 23613 bytes) — #1 largest file | 🔴 Critical | Unmaintainable, bug-prone, violates 250 LOC ceiling | High — decomposition required |
| 2 | `DashboardTrainingStepsComponent` TS file is ~10 LOC (300 bytes) — logic in template | 🟡 Medium | Un-testable, violates separation of concerns | Medium |
| 3 | No unit tests for DashboardComponent sub-features | 🟡 Medium | Regressions undetected | Medium |
| 4 | 3 unfinished items from PAGE_LAYER_REPORT.md | 🟡 Medium | Incomplete functionality | Unknown |
| 5 | No loading/error states in progress chart | 🟢 Low | Poor UX | Low |

**Security Audit**:
- [x] Top-level route has role-specific guard (`roleGuard('trainee')` — note: 'trainee' not 'student')
- [ ] Data isolation verified (trainee can only see own data)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Decompose DashboardComponent (>250 LOC) | `dashboard.component.ts` | — | Refactoring | 4h |
| 2 | Move logic from DashboardTrainingSteps template to TS | `dashboard-training-steps/*.ts` | Step 1 | Frontend | 1h |
| 3 | Add loading states to ProgressChartComponent | `progress-chart/*.ts` | Step 1 | Frontend | 1h |
| 4 | Write unit tests for decomposed sub-components | `*.spec.ts` | Steps 1-3 | Testing | 3h |
| 5 | Write integration tests for dashboard API | `IntegrationTests/` | Step 4 | Testing | 2h |
| 6 | Reconcile PAGE_LAYER_REPORT.md unfinished items | Multiple | Steps 1-5 | Investigation | 2h |
| 7 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 4-6 | QA | 1h |

**Step Details**:

### Step 1: Decompose DashboardComponent
- **Goal**: Split 714 LOC `dashboard.component.ts` into sub-components
- **Files**: `dashboard.component.ts`, new sub-components in `dashboard/`
- **Acceptance**: No file exceeds 250 LOC
- **Strategy**: Split by functional area: assignments view, progress tracking, spiritual panel, notification panel

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| D-UT-1 | DashboardComponent renders assignment list | Displays assignment cards |
| D-UT-2 | DashboardComponent shows XP balance | Displays numeric XP value |
| D-UT-3 | AssessmentTakerComponent loads assessment | Fetches via API on init |
| D-UT-4 | DashboardTrainingStepsComponent renders | Steps visible despite thin TS |
| D-UT-5 | ProgressChartComponent renders chart | SVG chart elements present |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| D-RT-1 | Unauthenticated user navigates to `/dashboard` | Redirect to `/auth/login` |
| D-RT-2 | Admin user navigates to `/dashboard` | Redirect to `/admin` |
| D-RT-3 | Trainee user navigates to `/dashboard` | Dashboard loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role (admin) | Redirect to role-specific dashboard |
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
| `shared/assessment-panel` | Assessment UI widget | Yes |
| `shared/spiritual-shell` | Spiritual page wrapper | No |
| `shared/persian-date-input` | Date picker | Yes |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `coach` | Coach views student dashboard data | Coach dashboard shows stale data |
| `evaluator` | Evaluator views student history | Assessment history incomplete |
| `parent` | Parent views student progress | Progress data unavailable |

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
- frontend/src/app/features/coach/**/*
- frontend/src/app/features/evaluator/**/*
- frontend/src/app/features/parent/**/*
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] `dashboard.component.ts` decomposed to <250 LOC per file
- [ ] `DashboardTrainingStepsComponent` has logic in TS, not template
- [ ] 3 PAGE_LAYER_REPORT.md unfinished items reconciled
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: trainee dashboard renders with assignments
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
