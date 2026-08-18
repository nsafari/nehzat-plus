# Roadmap: parent

| Field | Value |
|-------|-------|
| **Module** | `parent` |
| **Frontend Path** | `features/parent/` |
| **Backend Controllers** | `AdminParentsController`, `StudentController`, `MonthlyBookletController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

| Component | File | LOC (TS) | LOC (HTML) | LOC (SCSS) | Notes |
|-----------|------|----------|------------|------------|-------|
| ParentPanelComponent | `parent-panel.component.ts` | ~50 | ~95 | ~30 | Parent dashboard panel |
| ParentStudentDetailComponent | `parent-student-detail.component.ts` | ~190 | ~280 | ~290 | Full student detail view |
| MonthlyBookletComponent | `monthly-booklet.component.ts` | ~180 | ~230 | ~140 | Monthly booklet view |
| StudentProgressCardComponent | `student-progress-card.component.ts` | ~45 | ~65 | ~65 | Reusable progress card |

**Routes**:
- `/parent` — `roleGuard('parent')`, `ParentPanelComponent`
- `/parent/spiritual` — `roleGuard('parent')`, `ParentSpiritualPageComponent` (via `SpiritualShellComponent`)
- `/parent/monthly-booklets` — `roleGuard('parent')`, `ParentMonthlyBookletPageComponent`
- `/parent/student/:id` — `roleGuard('parent')`, `ParentStudentDetailComponent`

**API Calls**:
- `getStudents(parentId)` — fetch student list for parent
- `getStudentById(id)` — detailed student data
- `getMonthlyBooklet(studentId)` — monthly progress booklet
- `getStudentProgress(studentId, courseId)` — progress history

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| `AdminParentsController` | `/api/admin/parents` | GET, POST, PUT, DELETE |
| `StudentController` | `/api/students` | GET, GET (by id), GET (assignments) |
| `MonthlyBookletController` | `/api/monthly-booklets` | GET, GET (by student) |
| `AssessmentController` | `/api/assessments` | GET (by student), GET (results) |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getStudents` | `getStudents(): Observable<Student[]>` | `Student[]` |
| `getStudentById` | `getStudentById(id: string): Observable<Student>` | `Student` |
| `getMonthlyBooklet` | `getMonthlyBooklet(studentId: string): Observable<MonthlyBooklet>` | `MonthlyBooklet` |
| `getStudentProgress` | `getStudentProgress(studentId: string, courseId: string): Observable<ProgressResponse>` | `ProgressResponse` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | No dev accounts for parent role | 🟡 Medium | Cannot test parent flow in dev | Low — add to DevTokenService |
| 2 | No integration tests for parent-student data isolation | 🟡 Medium | Risk of parent viewing other students' data | High |
| 3 | `parent-student-detail.component.ts` (~190 LOC) is large for detail view | 🟢 Low | Maintainability | Medium |
| 4 | No performance tests for progress card rendering | 🟢 Low | Unknown slowness risk | Low |

**Security Audit**:
- [x] Top-level route has role-specific guard (`roleGuard('parent')`)
- [ ] Backend endpoints have `[Authorize(Roles="...")]` — **needs verification** (StudentController and MonthlyBookletController may lack role restriction)
- [ ] Data isolation verified (parent cannot access other students' data — CRITICAL)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Add parent dev account to DevTokenService | `AuthController.cs` | — | Backend | 0.5h |
| 2 | Add `[Authorize(Roles="parent,trainee")]` to StudentController endpoints | `StudentController.cs` | — | Backend | 1h |
| 3 | Add `[Authorize(Roles="parent,trainee")]` to MonthlyBookletController endpoints | `MonthlyBookletController.cs` | — | Backend | 1h |
| 4 | Write data isolation test | `IntegrationTests/` | Steps 2-3 | Testing | 2h |
| 5 | Decompose parent-student-detail.component.ts | `parent-student-detail.component.ts` | — | Frontend | 2h |
| 6 | Write unit tests for parent-student-detail | `*.spec.ts` | Step 5 | Testing | 1h |
| 7 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 4-6 | QA | 1h |

**Step Details**:

### Step 1: Add parent dev account
- **Goal**: Enable parent role testing in development environment
- **Files**: `backend/.../API/Controllers/AuthController.cs` (DevAccounts section)
- **Acceptance**: `POST /api/auth/dev-token` with `role: "parent"` returns valid JWT

### Step 4: Data isolation test
- **Goal**: Verify parent A cannot access parent B's student data
- **Files**: New integration test file
- **Acceptance**: Test passes — parent receives only their assigned students

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| P-UT-1 | ParentPanelComponent renders student list | Displays student cards |
| P-UT-2 | ParentPanelComponent handles empty list | Shows "no students linked" message |
| P-UT-3 | StudentProgressCardComponent renders progress | Displays percentage and XP |
| P-UT-4 | ParentStudentDetailComponent loads student data | Fetches via API on init |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| P-RT-1 | Unauthenticated user navigates to `/parent` | Redirect to `/auth/login` |
| P-RT-2 | Coach user navigates to `/parent` | Redirect to `/coach` |
| P-RT-3 | Parent user navigates to `/parent` | Component loads with student data |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role (coach) | Redirect to role-specific dashboard |
| (c) | Authenticated, correct role (parent) | Guard returns `true` |
| (d) | Case-insensitive check | `hasRole()` passes regardless of case |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

**Test Infrastructure**: MUST reuse `features/shared/testing-utils.ts`. MUST NOT create new mock factories.

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `core/services/auth` | Auth guard via `hasRole()` | Yes |
| `core/models/lesson-planner` | Type definitions | Yes |
| `core/services/lesson-planner-api` | API interface | Yes |
| `shared/spiritual-shell` | Layout wrapper | No |
| `shared/assessment-panel` | Progress visualization | Yes |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `dashboard` (trainee) | Student self-view (parent and student both see student data) | Data inconsistency |
| `coach` | Coach views student progress | Coach dashboard shows stale data |

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
- frontend/src/app/features/evaluator/**/* (evaluator role)
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] Parent dev account returns valid JWT from DevTokenService
- [ ] `StudentController` and `MonthlyBookletController` have role-specific `[Authorize]`
- [ ] Data isolation test verifies parent A cannot see parent B's students
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: parent dashboard renders with student data
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
