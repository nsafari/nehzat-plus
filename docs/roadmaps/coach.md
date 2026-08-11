# Roadmap: coach

| Field | Value |
|-------|-------|
| **Module** | `coach` |
| **Frontend Path** | `features/coach/` |
| **Backend Controllers** | `AdminCoachesController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

| Component | File | LOC (TS) | LOC (HTML) | LOC (SCSS) | Notes |
|-----------|------|----------|------------|------------|-------|
| CoachComponent | `features/coach/coach.component.ts` | ~120 | ~45 | ~30 | Main coach dashboard |
| CoachService | `features/coach/coach.service.ts` | ~80 | — | — | Data fetching |
| CoachRoutingModule | `features/coach/coach.routes.ts` | ~15 | — | — | Lazy-loaded |

**Routes**:
- `/coach` — lazy-loaded via `CoachRoutingModule`
- Guard: `roleGuard('coach')` (via `app.routes.ts`)

**API Calls**:
- `getCoaches()` — list all coaches
- `getCoachById(id)` — single coach details
- `createCoach(dto)` — add new coach
- `updateCoach(id, dto)` — edit coach
- `deleteCoach(id)` — remove coach

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| `AdminCoachesController` | `/api/admin/coaches` | GET (list), GET (by id), POST, PUT, DELETE |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getCoaches` | `getCoaches(): Observable<Coach[]>` | `Coach[]` |
| `getCoachById` | `getCoachById(id: string): Observable<Coach>` | `Coach` |
| `createCoach` | `createCoach(dto: CreateCoachRequest): Observable<Coach>` | `Coach` |
| `updateCoach` | `updateCoach(id: string, dto: UpdateCoachRequest): Observable<Coach>` | `Coach` |
| `deleteCoach` | `deleteCoach(id: string): Observable<void>` | `void` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | No dev accounts for coach role | 🟡 Medium | Cannot test coach flow in dev | Low — add to DevTokenService |
| 2 | No unit tests for coach components | 🟡 Medium | Regressions undetected | Medium |
| 3 | No integration tests for coach API | 🟡 Medium | API contract drift | Medium |
| 4 | coach.service.ts missing error handling | 🟢 Low | Silent failures | Low |
| 5 | No loading states in coach.component | 🟢 Low | Poor UX | Low |

**Security Audit**:
- [x] Top-level route has role-specific guard (`roleGuard('coach')`)
- [x] Backend endpoints have `[Authorize(Roles="coach")]` attribute
- [ ] Data isolation verified (coach cannot access admin data)
- [ ] Negative-access matrix covers all 5 cells (unauthenticated, wrong-role, correct-role, case-insensitive, missing-user)

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Add coach dev account to DevTokenService | `backend/.../API/Controllers/AuthController.cs` | — | Backend | 0.5h |
| 2 | Add error handling to coach.service.ts | `features/coach/coach.service.ts` | — | Frontend | 1h |
| 3 | Add loading states to coach.component | `features/coach/coach.component.ts` | Step 2 | Frontend | 1h |
| 4 | Write unit tests for coach components | `features/coach/*.spec.ts` | Steps 2-3 | Testing | 2h |
| 5 | Write integration tests for coach API | `backend/.../IntegrationTests/` | Step 1 | Testing | 2h |
| 6 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 4-5 | QA | 1h |

**Step Details**:

### Step 1: Add coach dev account
- **Goal**: Enable coach role testing in development environment
- **Files**: `backend/.../API/Controllers/AuthController.cs` (DevAccounts section)
- **Acceptance**: `POST /api/auth/dev-token` with `role: "coach"` returns valid JWT

### Step 2: Error handling in coach.service.ts
- **Goal**: Surface API errors to component layer
- **Files**: `features/coach/coach.service.ts`
- **Acceptance**: All HTTP errors caught and propagated via `catchError()`

### Step 3: Loading states
- **Goal**: Show skeleton/spinner during data fetch
- **Files**: `features/coach/coach.component.ts`
- **Acceptance**: Loading indicator visible during API calls

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| C-UT-1 | CoachComponent renders coach list | Displays coach cards |
| C-UT-2 | CoachComponent handles empty list | Shows "no coaches" message |
| C-UT-3 | CoachService calls correct API endpoint | HTTP GET `/api/admin/coaches` |
| C-UT-4 | CoachService handles 401 error | Redirects to login |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| C-RT-1 | Unauthenticated user navigates to `/coach` | Redirect to `/auth/login` |
| C-RT-2 | Admin user navigates to `/coach` | Redirect to `/admin` |
| C-RT-3 | Coach user navigates to `/coach` | Component loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role (admin) | Redirect to role-specific dashboard |
| (c) | Authenticated, correct role (coach) | Guard returns `true` |
| (d) | Case-insensitive check | `hasRole()` passes regardless of case |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

**Test Infrastructure**: MUST reuse `features/shared/testing-utils.ts`. MUST NOT create new mock factories.

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `shared/assessment-panel` | UI component | Yes |
| `shared/persian-date-input` | UI component | No |
| `core/services/auth` | Auth guard | Yes |
| `core/models/lesson-planner` | Type definitions | Yes |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `admin` | Coach management | Cannot create/edit coaches |

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
- frontend/src/app/features/admin/**/* (admin module internals)
- backend/.../Controllers/AdminCoachesController.cs (use Application layer only)
```

**Requesting Changes to Locked Files**: File an issue or PR to the module owner (see CODEOWNERS). Do NOT modify directly.

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] All Required Tests written and passing (RED → GREEN evidence)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: coach dashboard renders correctly with dev account
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
