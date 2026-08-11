# Roadmap: evaluator

| Field | Value |
|-------|-------|
| **Module** | `evaluator` |
| **Frontend Path** | `features/evaluator/` |
| **Backend Controllers** | `AdminAssessmentsController` (shared with coach) |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

> **CRITICAL**: Evaluator role has ZERO `[Authorize]` gates in backend — anyone authenticated can hit assessment endpoints. This is the #1 security gap in the project.

---

## 1. Current State

| Component | File | LOC (TS) | LOC (HTML) | LOC (SCSS) | Notes |
|-----------|------|----------|------------|------------|-------|
| EvaluatorComponent | `features/evaluator/evaluator.component.ts` | ~150 | ~60 | ~35 | Main evaluator dashboard |
| EvaluatorService | `features/evaluator/evaluator.service.ts` | ~90 | — | — | Data fetching |
| EvaluatorRoutingModule | `features/evaluator/evaluator.routes.ts` | ~15 | — | — | Lazy-loaded |

**Routes**:
- `/evaluator` — lazy-loaded via `EvaluatorRoutingModule`
- Guard: `roleGuard('evaluator')` (via `app.routes.ts`)

**API Calls**:
- `getStudents()` — list ALL students (not just assigned)
- `getStudentById(id)` — single student details
- `getAssessments(studentId)` — assessment history for student
- `createAssessment(dto)` — record assessment for any student
- `overrideAssessment(id, dto)` — override existing assessment

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| `AdminAssessmentsController` | `/api/admin/assessments` | GET (list), GET (by id), POST, PUT, DELETE |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getStudents` | `getStudents(): Observable<Student[]>` | `Student[]` |
| `getStudentById` | `getStudentById(id: string): Observable<Student>` | `Student` |
| `getAssessments` | `getAssessments(studentId: string): Observable<Assessment[]>` | `Assessment[]` |
| `createAssessment` | `createAssessment(dto: CreateAssessmentRequest): Observable<Assessment>` | `Assessment` |
| `overrideAssessment` | `overrideAssessment(id: string, dto: OverrideAssessmentRequest): Observable<Assessment>` | `Assessment` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | **CRITICAL: Zero [Authorize] gates** on assessment endpoints | 🔴 Critical | Any authenticated user can record/override assessments | Medium — add `[Authorize]` attributes |
| 2 | No dev accounts for evaluator role | 🟡 Medium | Cannot test evaluator flow in dev | Low — add to DevTokenService |
| 3 | No audit trail for assessment overrides | 🟡 Medium | Cannot track who overrode what | Medium — add logging |
| 4 | No unit tests for evaluator components | 🟡 Medium | Regressions undetected | Medium |
| 5 | No rate limiting on assessment creation | 🟢 Low | Potential abuse | Low |

**Security Audit**:
- [ ] Top-level route has role-specific guard (`roleGuard('evaluator')`)
- [ ] Backend endpoints have `[Authorize(Roles="evaluator,admin")]` attribute — **FAILED: ZERO gates**
- [ ] Data isolation verified (evaluator cannot access admin data)
- [ ] Negative-access matrix covers all 5 cells (unauthenticated, wrong-role, correct-role, case-insensitive, missing-user)

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | **CRITICAL: Add [Authorize] to assessment endpoints** | `AdminAssessmentsController.cs` | — | Security | 1h |
| 2 | Add audit logging for assessment overrides | `AdminAssessmentsController.cs` | Step 1 | Security | 1h |
| 3 | Add evaluator dev account to DevTokenService | `AuthController.cs` | — | Backend | 0.5h |
| 4 | Add loading states to evaluator.component | `features/evaluator/evaluator.component.ts` | — | Frontend | 1h |
| 5 | Add error handling to evaluator.service.ts | `features/evaluator/evaluator.service.ts` | — | Frontend | 1h |
| 6 | Write unit tests for evaluator components | `features/evaluator/*.spec.ts` | Steps 4-5 | Testing | 2h |
| 7 | Write integration tests for evaluator API | `backend/.../IntegrationTests/` | Steps 1-3 | Testing | 2h |
| 8 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 6-7 | QA | 1h |

**Step Details**:

### Step 1: CRITICAL — Add [Authorize] to assessment endpoints
- **Goal**: Prevent unauthorized access to assessment CRUD
- **Files**: `backend/.../Controllers/AdminAssessmentsController.cs`
- **Acceptance**: Unauthenticated → 401; students → 403; only evaluator/admin can access
- **Security impact**: This is the #1 priority — any authenticated user can currently record/override assessments

### Step 2: Audit logging for overrides
- **Goal**: Track who overrode what assessment
- **Files**: `backend/.../Controllers/AdminAssessmentsController.cs`
- **Acceptance**: Override action logged with evaluator ID + timestamp + old/new values

### Step 3: Add evaluator dev account
- **Goal**: Enable evaluator role testing in development
- **Files**: `backend/.../API/Controllers/AuthController.cs` (DevAccounts section)
- **Acceptance**: `POST /api/auth/dev-token` with `role: "evaluator"` returns valid JWT

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| E-UT-1 | EvaluatorComponent renders student list | Displays student cards |
| E-UT-2 | EvaluatorComponent handles empty list | Shows "no students" message |
| E-UT-3 | EvaluatorService calls correct API endpoint | HTTP GET `/api/admin/students` |
| E-UT-4 | EvaluatorService handles 401 error | Redirects to login |
| E-UT-5 | Override assessment shows confirmation dialog | Dialog appears before API call |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| E-RT-1 | Unauthenticated user navigates to `/evaluator` | Redirect to `/auth/login` |
| E-RT-2 | Coach user navigates to `/evaluator` | Redirect to `/coach` |
| E-RT-3 | Evaluator user navigates to `/evaluator` | Component loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role (coach) | Redirect to role-specific dashboard |
| (c) | Authenticated, correct role (evaluator) | Guard returns `true` |
| (d) | Case-insensitive check | `hasRole()` passes regardless of case |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

**Test Infrastructure**: MUST reuse `features/shared/testing-utils.ts`. MUST NOT create new mock factories.

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `shared/assessment-panel` | UI component for recording assessments | Yes |
| `shared/spiritual-shell` | Layout wrapper for spiritual sections | Yes |
| `core/services/auth` | Role verification via `hasRole()` | Yes |
| `core/models/lesson-planner` | Type definitions | Yes |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `dashboard` | Student self-view (separate role) | None — independent |
| `coach` | Coach role (separate roadmap) | None — independent |

---

## 7. Interference Boundary

These files **MUST NOT** be modified by this module's implementation. All listed paths are grep-able and enforced by CODEOWNERS.

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
- frontend/src/app/features/shared/assessment-panel/**/* (use assessment-panel roadmap)
- frontend/src/app/features/dashboard/**/* (student self-view)
- frontend/src/app/features/coach/**/* (coach role)
```

**Requesting Changes to Locked Files**: File an issue or PR to the module owner (see CODEOWNERS). Do NOT modify directly.

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] **CRITICAL: Backend assessment endpoints have `[Authorize(Roles="evaluator,admin")]`**
- [ ] Assessment overrides are audit-logged with evaluator ID + timestamp
- [ ] All Required Tests written and passing (RED → GREEN evidence)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: evaluator dashboard renders correctly with dev account
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
