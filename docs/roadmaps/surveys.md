# Roadmap: surveys

| Field | Value |
|-------|-------|
| **Module** | `surveys` |
| **Frontend Path** | `features/surveys/` + `features/shared/surveys/` |
| **Backend Controllers** | *(See `surveys-shared.md` for reconciliation)* |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

Public survey listing and taking interface. Uses `authGuard` — any authenticated user can access.

| Component | File | LOC (TS) | Notes |
|-----------|------|----------|-------|
| SurveyListComponent | `shared/surveys/survey-list.component.ts` | — | Public survey listing |
| SurveyTakerComponent | `shared/surveys/survey-taker.component.ts` | — | Take survey interface |

**Routes** (2 routes, `authGuard`):
- `/surveys` — `SurveyListComponent` (from `shared/surveys/`)
- `/surveys/take/:id` — `SurveyTakerComponent` (from `shared/surveys/`)

**API Calls**:
- `getSurveys()` — list all available surveys
- `getSurveyById(id)` — survey details
- `submitSurvey(id, answers)` — record responses

**Key finding**: Routes import from `shared/surveys/` — this is the **shared component** consumed by both `survey` and `surveys` modules. See `surveys-shared.md` for full reconciliation.

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| See `surveys-shared.md` | Cross-module | See reconciliation doc |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getSurveys` | `getSurveys(): Observable<Survey[]>` | `Survey[]` |
| `getSurveyById` | `getSurveyById(id: string): Observable<Survey>` | `Survey` |
| `submitSurvey` | `submitSurvey(id: string, answers: any): Observable<SurveyResult>` | `SurveyResult` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | No unit tests for shared survey components | 🟡 Medium | Regressions undetected | Medium |
| 2 | No role-based access on `/surveys` — any authenticated user can take any survey | 🟡 Medium | Possible data exposure | Medium |
| 3 | No test for shared component importing pattern | 🟢 Low | Import breakage risk | Low |
| 4 | No loading states in SurveyTakerComponent | 🟢 Low | Poor UX | Low |

**Security Audit**:
- [x] Top-level route has `authGuard`
- [ ] Role-based access needed (should trainee see all surveys?)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Add unit tests for SurveyListComponent | `*.spec.ts` | — | Testing | 1h |
| 2 | Add unit tests for SurveyTakerComponent | `*.spec.ts` | — | Testing | 1.5h |
| 3 | Add loading states | `survey-taker.component.ts` | — | Frontend | 1h |
| 4 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 1-3 | QA | 1h |

**Step Details**:

### Step 1: Unit tests for SurveyListComponent
- **Goal**: Test survey listing renders correctly
- **Files**: `features/shared/surveys/survey-list.component.spec.ts`
- **Acceptance**: Tests cover empty state, loading, error state

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| SVS-UT-1 | SurveyListComponent renders survey cards | All surveys displayed |
| SVS-UT-2 | SurveyListComponent handles empty | Shows "no surveys" message |
| SVS-UT-3 | SurveyTakerComponent loads survey | Fetches survey by ID |
| SVS-UT-4 | SurveyTakerComponent submits answers | Calls `submitSurvey()` |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| SVS-RT-1 | Unauthenticated navigates to `/surveys` | Redirect to `/auth/login` |
| SVS-RT-2 | Trainee navigates to `/surveys` | Survey list loads |
| SVS-RT-3 | Parent navigates to `/surveys` | Survey list loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` |
| (b) | Authenticated, correct role | Guard returns `true` |
| (c) | Authenticated, wrong role | Currently passes (authGuard only) |
| (d) | Case-insensitive check | `hasRole()` passes |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `shared/surveys` | Shared survey components (SAME) | Yes |
| `core/services/auth` | Route guard | Yes |
| `survey` | Service survey module (shared components) | Yes |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `parent` | Parent survey access | Cannot view surveys |
| `branch-manager` | HQ survey access | Cannot manage surveys |

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
- frontend/src/app/features/survey/**/* (service survey module)
- frontend/src/app/features/shared/surveys/**/* (shared component location)
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] Unit tests for both shared components written and passing
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: survey list renders in `/surveys`
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
