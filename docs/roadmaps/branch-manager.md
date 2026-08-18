# Roadmap: branch-manager

| Field | Value |
|-------|-------|
| **Module** | `branch-manager` |
| **Frontend Path** | `features/branch-manager/` |
| **Backend Controllers** | `CompetitionsController`, `LeaguesController`, `AssessmentController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

| Component | File | LOC (TS) | LOC (HTML) | LOC (SCSS) | Notes |
|-----------|------|----------|------------|------------|-------|
| BranchManagerComponent | `branch-manager.component.ts` | ~238 | — | — | Main branch manager dashboard |
| CompetitionManagementComponent | `branch-manager/competition-management/competition-management.component.ts` | — | — | — | Competition CRUD |
| LeagueManagementComponent | `branch-manager/league-management/league-management.component.ts` | — | — | — | League management |
| BranchManagerSpiritualPageComponent | (inline in routes) | — | — | — | Spiritual shell page |
| BranchManagerAssessmentComponent | (inline in routes) | — | — | — | Assessment panel wrapper |

**Routes** (5 routes, all `roleGuard('branch_manager')`):
- `/branch-manager` — `BranchManagerComponent`
- `/branch-manager/assessment` — `BranchManagerAssessmentComponent` (uses `AssessmentPanelComponent`)
- `/branch-manager/spiritual` — `BranchManagerSpiritualPageComponent`
- `/branch-manager/competitions` — `CompetitionManagementComponent`
- `/branch-manager/leagues` — `LeagueManagementComponent`

**API Calls**:
- `getCompetitions()` — list competitions
- `getCompetitionById(id)` — single competition
- `createCompetition(dto)` — new competition
- `getLeagues()` — list leagues
- `createLeague(dto)` — new league
- `getBranchPerformance()` — branch stats
- `getCoachPerformance()` — coach stats

**Key Note**: Routes use `roleGuard('branch_manager')` — underscore in role name, NOT kebab-case.

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| `CompetitionsController` | `/api/competitions` | GET, POST, PUT, DELETE |
| `LeaguesController` | `/api/leagues` | GET, POST, PUT, DELETE |
| `AssessmentController` | `/api/assessments` | GET, POST (shared) |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getCompetitions` | `getCompetitions(): Observable<Competition[]>` | `Competition[]` |
| `getCompetitionById` | `getCompetitionById(id: string): Observable<Competition>` | `Competition` |
| `createCompetition` | `createCompetition(dto: CreateCompetitionRequest): Observable<Competition>` | `Competition` |
| `getLeagues` | `getLeagues(): Observable<League[]>` | `League[]` |
| `createLeague` | `createLeague(dto: CreateLeagueRequest): Observable<League>` | `League` |
| `getBranchPerformance` | `getBranchPerformance(): Observable<BranchPerformance>` | `BranchPerformance` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | No dev accounts for branch_manager role | 🟡 Medium | Cannot test branch-manager flow in dev | Low — add to DevTokenService |
| 2 | No unit tests for branch-manager components | 🟡 Medium | Regressions undetected | Medium |
| 3 | `branch-manager.component.ts` (~238 LOC) approaching ceiling | 🟢 Low | Future growth risk | Low |
| 4 | CompetitionManagement and LeagueManagement have no spec files | 🟢 Low | No test coverage | Low |
| 5 | No negative-access verification between branch_manager and headquarters | 🟢 Low | Role overlap risk | Low |

**Security Audit**:
- [x] Top-level route has role-specific guard (`roleGuard('branch_manager')`)
- [ ] Backend endpoints have `[Authorize(Roles="...")]` — needs verification
- [ ] Data isolation verified (branch_manager can only see their branch)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Add branch_manager dev account | `AuthController.cs` | — | Backend | 0.5h |
| 2 | Add `[Authorize(Roles="branch_manager,headquarters,admin")]` to CompetitionsController | `CompetitionsController.cs` | — | Backend | 1h |
| 3 | Add `[Authorize(Roles="branch_manager,headquarters,admin")]` to LeaguesController | `LeaguesController.cs` | — | Backend | 1h |
| 4 | Write unit tests for competition-management | `*.spec.ts` | — | Testing | 1.5h |
| 5 | Write unit tests for league-management | `*.spec.ts` | — | Testing | 1.5h |
| 6 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 4-5 | QA | 1h |

**Step Details**:

### Step 1: Add branch_manager dev account
- **Goal**: Enable branch_manager role testing in dev
- **Files**: `backend/.../API/Controllers/AuthController.cs`
- **Acceptance**: `POST /api/auth/dev-token` with `role: "branch_manager"` returns valid JWT

### Step 2: Role-based authorization on CompetitionsController
- **Goal**: Prevent non-admin roles from accessing competition endpoints
- **Files**: `backend/.../Controllers/CompetitionsController.cs`
- **Acceptance**: Unauthenticated → 401; trainee → 403; branch_manager/headquarters/admin → 200

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| BM-UT-1 | BranchManagerComponent renders competition list | Displays competition cards |
| BM-UT-2 | CompetitionManagementComponent handles error | Shows error notification |
| BM-UT-3 | LeagueManagementComponent renders league table | Displays league standings |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| BM-RT-1 | Unauthenticated user navigates to `/branch-manager` | Redirect to `/auth/login` |
| BM-RT-2 | Coach user navigates to `/branch-manager` | Redirect to `/coach` |
| BM-RT-3 | Branch manager user navigates to `/branch-manager` | Component loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role (coach) | Redirect to role-specific dashboard |
| (c) | Authenticated, correct role (branch_manager) | Guard returns `true` |
| (d) | Case-insensitive check | `hasRole()` passes regardless of case |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

**Test Infrastructure**: MUST reuse `features/shared/testing-utils.ts`. MUST NOT create new mock factories.

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `core/services/auth` | `roleGuard('branch_manager')` | Yes |
| `core/models/lesson-planner` | Type definitions | Yes |
| `core/services/lesson-planner-api` | API interface | Yes |
| `shared/assessment-panel` | Assessment UI widget | Yes |
| `shared/spiritual-shell` | Spiritual page wrapper | No |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `headquarters` | Competition/league data feeds | HQ dashboard shows stale data |
| `coach` | Coach performance data | Coach dashboard incomplete |

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
- frontend/src/app/features/admin/**/* (admin role)
- frontend/src/app/features/headquarters/**/* (headquarters role)
- frontend/src/app/features/coach/**/* (coach role)
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] `branch_manager` dev account returns valid JWT
- [ ] `CompetitionsController` and `LeaguesController` have `[Authorize(Roles="branch_manager,headquarters,admin")]`
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: branch-manager dashboard renders with competitions
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
