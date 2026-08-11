# Roadmap: admin

| Field | Value |
|-------|-------|
| **Module** | `admin` |
| **Frontend Path** | `features/admin/` |
| **Backend Controllers** | `AdminBranchesController`, `AdminBranchManagersController`, `AdminCoachesController`, `AdminCoursesController`, `AdminCurriculumController`, `AdminEvaluatorsController`, `AdminHeadquartersController`, `AdminMakatibController`, `AdminParentsController`, `AdminRingsController`, `AdminStudentsController`, `AdminStatisticsController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

Admin component has been refactored from ~2375 lines to 258 lines. 12 sub-module directories extracted.

| Component | File | LOC (TS) | Notes |
|-----------|------|----------|-------|
| AdminComponent | `admin.component.ts` | 258 | Shell-level, delegates to sub-components |
| AdminShellComponent | `admin-shell.component.ts` | ~25 | Tab navigation shell |
| AdminBranchesComponent | `admin/admin-branches/admin-branches.component.ts` | ~420 | Branch CRUD |
| AdminCoachesComponent | `admin/admin-coaches/admin-coaches.component.ts` | ~450 | Coach management |
| AdminCoursesComponent | `admin/admin-courses/admin-courses.component.ts` | ~700 | Course management (LARGE) |
| AdminBranchManagersComponent | `admin/admin-branch-managers/admin-branch-managers.component.ts` | ~540 | Branch manager CRUD |
| AdminStudentsComponent | `admin/admin-students/admin-students.component.ts` | ~480 | Student management |
| AdminParentsComponent | `admin/admin-parents/admin-parents.component.ts` | ~380 | Parent management |
| AdminEvaluatorsComponent | `admin/admin-evaluators/admin-evaluators.component.ts` | ~380 | Evaluator management |
| AdminHeadquartersComponent | `admin/admin-headquarters/admin-headquarters.component.ts` | ~260 | HQ assignment |
| AdminMakatibComponent | `admin/admin-makatib/admin-makatib.component.ts` | ~370 | Madrasah/maktab CRUD |
| AdminRingsComponent | `admin/admin-rings/admin-rings.component.ts` | ~430 | Ring/spiritual circle CRUD |
| AdminCurriculumComponent | `admin/admin-curriculum/admin-curriculum.component.ts` | ~560 | Curriculum management |
| AdminSurveysComponent | `admin/admin-surveys/admin-surveys.component.ts` | ~460 | Survey management |

**Routes**:
- `/admin` — protected by `[authGuard, adminGuard]`
- `/admin/spiritual` — spiritual page via `SpiritualShellComponent`
- `/admin/surveys` — admin survey management

**API Calls** (via `getCoaches`, `getStudents`, `getCourses`, `createStudent`, `updateStudent`, `deleteStudent`, `getBranches`, `createBranch`, etc.):
- Coach CRUD: `getCoaches()`, `createCoach()`, `updateCoach()`, `deleteCoach()`
- Student CRUD: `getStudents()`, `createStudent()`, `updateStudent()`, `deleteStudent()`
- Course CRUD: `getCourses()`, `createCourse()`, `updateCourse()`, `deleteCourse()`
- Branch CRUD: `getBranches()`, `createBranch()`, `updateBranch()`, `deleteBranch()`
- Evaluation: `getEvaluators()`, `assignEvaluator()`
- Statistics: `getBranchPerformance()`, `getCoachPerformance()`

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| `AdminBranchesController` | `/api/admin/branches` | GET, POST, PUT, DELETE |
| `AdminBranchManagersController` | `/api/admin/branch-managers` | GET, POST, PUT, DELETE |
| `AdminCoachesController` | `/api/admin/coaches` | GET, POST, PUT, DELETE |
| `AdminCoursesController` | `/api/admin/courses` | GET, POST, PUT, DELETE |
| `AdminCurriculumController` | `/api/admin/curriculum` | GET, POST, PUT, DELETE |
| `AdminEvaluatorsController` | `/api/admin/evaluators` | GET, POST, PUT, DELETE |
| `AdminHeadquartersController` | `/api/admin/headquarters` | GET, POST, PUT, DELETE |
| `AdminMakatibController` | `/api/admin/makatib` | GET, POST, PUT, DELETE |
| `AdminParentsController` | `/api/admin/parents` | GET, POST, PUT, DELETE |
| `AdminRingsController` | `/api/admin/rings` | GET, POST, PUT, DELETE |
| `AdminStudentsController` | `/api/admin/students` | GET, POST, PUT, DELETE |
| `AdminStatisticsController` | `/api/admin/statistics` | GET |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getCoaches` | `getCoaches(): Observable<Coach[]>` | `Coach[]` |
| `getStudents` | `getStudents(): Observable<Student[]>` | `Student[]` |
| `getCourses` | `getCourses(): Observable<Course[]>` | `Course[]` |
| `getBranches` | `getBranches(): Observable<Branch[]>` | `Branch[]` |
| `getEvaluators` | `getEvaluators(): Observable<User[]>` | `User[]` |
| `getBranchPerformance` | `getBranchPerformance(): Observable<BranchPerformance>` | `BranchPerformance` |
| `getCoachPerformance` | `getCoachPerformance(): Observable<CoachPerformance>` | `CoachPerformance` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | 3 admin sub-modules exceed 250 LOC ceiling (admin-courses ~700, admin-coaches ~450, admin-branch-managers ~540) | 🟡 Medium | `remove-ai-slops` required before further growth | High — decomposition |
| 2 | `adminGuard` hardcodes 4 roles — new roles require code change | 🟡 Medium | Role changes need deployment | Medium — use policy-based auth |
| 3 | No unit tests for admin sub-components (only AdminComponent has spec) | 🟡 Medium | Regressions undetected in sub-modules | Medium |
| 4 | No integration tests for backend admin endpoints | 🟡 Medium | API contract drift | Medium |
| 5 | Admin dashboard lacks role-specific data isolation | 🟢 Low | Potential data exposure risk | Low |
| 6 | `admin.component.spec.ts` coverage unknown | 🟢 Low | Coverage gap | Low |

**Security Audit**:
- [x] Top-level route has role-specific guard (`adminGuard` checks admin/manager/HQ/branch_manager)
- [x] Backend controllers all have `[Authorize]` at class level
- [ ] Data isolation needs verification (admin should not see other branch data without explicit filter)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Decompose admin-courses.component.ts (>250 LOC) | `admin-courses/*.component.ts` | — | Refactoring | 4h |
| 2 | Decompose admin-coaches.component.ts (>250 LOC) | `admin-coaches/*.component.ts` | Step 1 | Refactoring | 3h |
| 3 | Decompose admin-branch-managers.component.ts (>250 LOC) | `admin-branch-managers/*.component.ts` | Step 2 | Refactoring | 3h |
| 4 | Convert adminGuard hardcoded roles → policy-based | `core/guards/admin.guard.ts`, `Program.cs` | Steps 1-3 | Backend | 2h |
| 5 | Write unit tests for 3 decomposed sub-modules | `*.spec.ts` | Steps 1-3 | Testing | 4h |
| 6 | Write integration tests for AdminCourses/AdminCoaches/AdminBranchManagers | `IntegrationTests/` | Step 4 | Testing | 3h |
| 7 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 5-6 | QA | 1h |

**Step Details**:

### Step 1: Decompose admin-courses
- **Goal**: Split `admin-courses.component.ts` (~700 LOC) into smaller components
- **Files**: `admin-courses.component.ts`, new sub-components in `admin-courses/`
- **Acceptance**: No file exceeds 250 LOC
- **Strategy**: Split by tab: course-list, course-form, course-detail

### Step 4: Policy-based role auth
- **Goal**: Replace hardcoded 4-role check with policy-based authorization
- **Files**: `core/guards/admin.guard.ts`, `backend/.../Program.cs`
- **Acceptance**: New admin roles added via config, not code change

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| A-UT-1 | AdminComponent renders sub-component tabs | All 12 tabs visible |
| A-UT-2 | AdminCoursesComponent handles empty list | Shows "no courses" message |
| A-UT-3 | AdminCoursesComponent calls correct API | HTTP GET `/api/admin/courses` |
| A-UT-4 | AdminCoursesComponent handles error | Displays error notification |
| A-UT-5 | AdminCoachesComponent error state | Graceful fallback UI |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| A-RT-1 | Unauthenticated user navigates to `/admin` | Redirect to `/auth/login` |
| A-RT-2 | Student user navigates to `/admin` | Redirect to `/dashboard` |
| A-RT-3 | Admin user navigates to `/admin` | Admin shell loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role (trainee) | Redirect to role-specific dashboard |
| (c) | Authenticated, correct role (admin) | Guard returns `true` |
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
| `shared/assessment-panel` | UI widget | Yes |
| `shared/spiritual-shell` | Layout wrapper | No |
| `shared/persian-date-input` | UI widget | No |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `coach` | Coach management | Cannot create/edit coaches |
| `evaluator` | Evaluator assignment | Cannot assign evaluators |
| `parent` | Student linking | Cannot view student data |
| `headquarters` | Statistics data | Dashboard shows zeros |

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
- frontend/src/app/features/coach/**/* (coach role route)
- frontend/src/app/features/evaluator/**/* (evaluator role route)
- frontend/src/app/features/parent/**/* (parent role route)
- frontend/src/app/features/dashboard/**/* (trainee dashboard route)
- backend/.../Controllers/AssessmentController.cs (shared with evaluator)
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] `admin-courses`, `admin-coaches`, `admin-branch-managers` each <250 LOC
- [ ] `adminGuard` uses policy-based role config
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: admin dashboard renders with all tabs
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
