# Roadmap: headquarters

| Field | Value |
|-------|-------|
| **Module** | `headquarters` |
| **Frontend Path** | `features/headquarters/` |
| **Backend Controllers** | `AdminStatisticsController`, `MonthlyBookletController`, `MadrasahController`, `CompetitionsController`, `LeaguesController`, `AssessmentController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

| Component | File | LOC (TS) | LOC (HTML) | LOC (SCSS) | Notes |
|-----------|------|----------|------------|------------|-------|
| HeadquartersDashboardComponent | `headquarters-dashboard.component.ts` | ~60 | ~200 | ~85 | 4-tab dashboard (summary, branch-perf, coach-perf, madrasah-mgmt) |
| HeadquartersComponent | `headquarters.component.ts` | ~89 | ~500 | ~150 | Tab container shell |
| HeadquartersManagementPageComponent | (inline in routes) | — | — | — | Wrapper around HeadquartersComponent |
| MonthlyBookletComponent | `monthly-booklet.component.ts` | ~180 | ~230 | ~140 | Shared with parent module |

**Routes** (4 routes, all `roleGuard('headquarters')`):
- `/headquarters` — `HeadquartersDashboardComponent`
- `/headquarters/management` — `HeadquartersManagementPageComponent` (wraps `HeadquartersComponent`)
- `/headquarters/spiritual` — `HeadquartersSpiritualPageComponent` (via `SpiritualShellComponent`)
- `/headquarters/monthly-booklets` — `HeadquartersMonthlyBookletPageComponent` (wraps `MonthlyBookletComponent`)

**API Calls**:
- `getBranchPerformance()` — branch-level performance
- `getCoachPerformance()` — coach-level performance
- `getHeadquartersSummary()` — system-wide summary
- `getMadrasahList()` — list madrasah
- `createMadrasah()` — new madrasah
- `getMonthlyBooklet(studentId)` — student booklet
- Cross-calls: `getCompetitions()`, `getLeagues()`

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| `AdminStatisticsController` | `/api/admin/statistics` | GET (summary, branch-perf, coach-perf) |
| `MonthlyBookletController` | `/api/monthly-booklets` | GET, GET (by student) |
| `MadrasahController` | `/api/madrasah` | GET, POST, PUT, DELETE |
| `CompetitionsController` | `/api/competitions` | GET, POST (shared) |
| `LeaguesController` | `/api/leagues` | GET, POST (shared) |
| `AssessmentController` | `/api/assessments` | GET (analytics, results) |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getHeadquartersSummary` | `getHeadquartersSummary(): Observable<HeadquartersSummary>` | `HeadquartersSummary` |
| `getBranchPerformance` | `getBranchPerformance(): Observable<BranchPerformance[]>` | `BranchPerformance[]` |
| `getCoachPerformance` | `getCoachPerformance(): Observable<CoachPerformance[]>` | `CoachPerformance[]` |
| `getMadrasahList` | `getMadrasahList(): Observable<Madrasah[]>` | `Madrasah[]` |
| `createMadrasah` | `createMadrasah(dto: CreateMadrasahPayload): Observable<Madrasah>` | `Madrasah` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | No dev accounts for headquarters role | 🟡 Medium | Cannot test HQ flow in dev | Low |
| 2 | No unit tests for headquarters components | 🟡 Medium | Regressions undetected | Medium |
| 3 | `HeadquartersComponent` (~89 LOC) is thin — delegates to 4 tabs | 🟢 Low | Tab logic may belong in sub-components | Low |
| 4 | `MonthlyBookletComponent` duplicated in headquarters + parent | 🟡 Medium | DRY violation — shared component not extracted to `shared/` | Medium |

**Security Audit**:
- [x] Top-level route has role-specific guard (`roleGuard('headquarters')`)
- [ ] Backend endpoints have `[Authorize(Roles="...")]` — needs verification
- [ ] Data isolation verified (HQ can see all branches, branch_mgr cannot see HQ)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Add headquarters dev account | `AuthController.cs` | — | Backend | 0.5h |
| 2 | Extract MonthlyBookletComponent to shared | `features/shared/monthly-booklet/` | — | Frontend | 3h |
| 3 | Write unit tests for HeadquartersDashboardComponent | `*.spec.ts` | — | Testing | 2h |
| 4 | Write unit tests for HeadquartersComponent tabs | `*.spec.ts` | Step 2 | Testing | 1.5h |
| 5 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 3-4 | QA | 1h |

**Step Details**:

### Step 2: Extract MonthlyBookletComponent to shared
- **Goal**: Eliminate duplication between headquarters and parent modules
- **Files**: Move `frontend/src/app/features/headquarters/monthly-booklet.component.*` → `frontend/src/feat/shared/monthly-booklet/`
- **Acceptance**: Both modules import from shared path; no duplication

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| HQ-UT-1 | HeadquartersDashboardComponent renders 4 tabs | All tabs visible |
| HQ-UT-2 | HeadquartersDashboardComponent summary tab | Displays total students, branches, coaches |
| HQ-UT-3 | HeadquartersDashboardComponent switches to performance tab | Branch performance table renders |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| HQ-RT-1 | Unauthenticated user navigates to `/headquarters` | Redirect to `/auth/login` |
| HQ-RT-2 | Coach user navigates to `/headquarters` | Redirect to `/coach` |
| HQ-RT-3 | Headquarters user navigates to `/headquarters` | Dashboard loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role (trainee) | Redirect to role-specific dashboard |
| (c) | Authenticated, correct role (headquarters) | Guard returns `true` |
| (d) | Case-insensitive check | `hasRole()` passes regardless of case |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

**Test Infrastructure**: MUST reuse `features/shared/testing-utils.ts`. MUST NOT create new mock factories.

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `core/services/auth` | `roleGuard('headquarters')` | Yes |
| `core/models/lesson-planner` | Type definitions | Yes |
| `core/services/lesson-planner-api` | API interface | Yes |
| `shared/spiritual-shell` | Spiritual page wrapper | No |
| `shared/assessment-panel` | Assessment UI | Yes |
| `parent` | Shared MonthlyBookletComponent (DRY violation) | High |
| `branch-manager` | Shared Competition/League data | Yes |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `admin` | Branch/coach/madrasah management | Admin statistics stale |

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
- frontend/src/app/features/parent/**/* (parent module — shared component extraction only)
- frontend/src/app/features/admin/**/* (admin role)
- frontend/src/app/features/branch-manager/**/* (branch-manager role)
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] `headquarters` dev account returns valid JWT
- [ ] `MonthlyBookletComponent` extracted to `shared/` and imported by both modules
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: headquarters dashboard renders all 4 tabs
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
