# Roadmap: survey

| Field | Value |
|-------|-------|
| **Module** | `survey` |
| **Frontend Path** | `features/survey/` |
| **Backend Controllers** | *(See `surveys-shared.md` for full reconciliation)* |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

Service-survey management module. Uses `serviceSurveyGuard` — NOT `authGuard`.

| Component | File | LOC (TS) | Notes |
|-----------|------|----------|-------|
| SurveyRespondComponent | `survey-respond.component.ts` | — | Form-style survey responses |
| SurveyManageComponent | `survey-manage.component.ts` | — | Survey template management |
| SurveyAnalyticsComponent | `survey-analytics.component.ts` | — | Response analytics |
| SurveyFinancialComponent | `survey-financial.component.ts` | — | Financial survey section |
| SurveyService | `survey.service.ts` | — | Data fetching |

**Routes** (5 routes, all `serviceSurveyGuard`):
- `/survey/respond` — `SurveyRespondComponent`
- `/survey/manage` — `SurveyManageComponent`
- `/survey/analytics` — `SurveyAnalyticsComponent`
- `/survey/financial` — `SurveyFinancialComponent`

**API Calls**: (see `surveys-shared.md` for shared component details)
- Survey CRUD via shared `survey-taker.component` + `survey-list.component`

**Key finding**: `serviceSurveyGuard` protects only `parent`, `branch_manager`, `headquarters`, `manager` roles — trainees cannot access.

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
| `submitSurvey` | `submitSurvey(id: string, responses: any): Observable<SurveyResult>` | `SurveyResult` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | No unit tests for 4 page components | 🟡 Medium | Regressions undetected | Medium |
| 2 | `serviceSurveyGuard` role list is opaque — trainees excluded by design? | 🟡 Medium | May block valid users | Low |
| 3 | No integration tests for survey submission | 🟡 Medium | API contract drift | Medium |
| 4 | Routes redirect to `respond` on empty path — verify UX | 🟢 Low | Potential confusion | Low |

**Security Audit**:
- [x] Top-level route uses `serviceSurveyGuard` (not `authGuard`)
- [ ] `serviceSurveyGuard` role list documented and verified
- [ ] Data isolation verified (user can only see own survey responses)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Document `serviceSurveyGuard` accepted roles | `core/guards/service-survey.guard.ts` | — | Documentation | 0.5h |
| 2 | Write unit tests for 4 page components | `*.spec.ts` | — | Testing | 2h |
| 3 | Add loading states to survey pages | `*.component.ts` | — | Frontend | 1h |
| 4 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 2-3 | QA | 1h |

**Step Details**:

### Step 1: Document serviceSurveyGuard
- **Goal**: Clarify which roles can access `/survey` routes
- **Files**: `core/guards/service-survey.guard.ts`
- **Acceptance**: Comment or README entry listing: parent, branch_manager, headquarters, manager

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| SV-UT-1 | SurveyRespondComponent renders form | Form fields visible |
| SV-UT-2 | SurveyManageComponent handles create | Calls `submitSurvey()` |
| SV-UT-3 | SurveyAnalyticsComponent renders chart | Analytics graph displayed |
| SV-UT-4 | SurveyFinancialComponent shows data | Financial section renders |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| SV-RT-1 | Unauthenticated user navigates to `/survey` | Redirect to `/auth/login` |
| SV-RT-2 | Trainee user navigates to `/survey` | Redirect to `/dashboard` |
| SV-RT-3 | Parent user navigates to `/survey` | Survey respond loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` |
| (b) | Authenticated, trainee (excluded role) | Redirect to `/dashboard` |
| (c) | Authenticated, parent (allowed role) | Guard returns `true` |
| (d) | Case-insensitive check | `hasRole()` passes regardless of case |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

**Test Infrastructure**: MUST reuse `features/shared/testing-utils.ts`. MUST NOT create new mock factories.

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `core/guards/service-survey.guard` | Special guard for parent+HQ+manager | Yes |
| `core/models/lesson-planner` | Survey type definitions | Yes |
| `shared/surveys` | Shared survey-taker/list components | Yes |
| `surveys` | Surveys route (shared component) | Yes |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `surveys` | Shared survey components | Survey taking broken |
| `parent` | Parent survey access | Cannot respond to surveys |

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
- frontend/src/app/features/surveys/**/* (separate route)
- frontend/src/app/features/shared/surveys/**/* (shared components)
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] `serviceSurveyGuard` role list documented
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: survey respond page loads for parent
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
