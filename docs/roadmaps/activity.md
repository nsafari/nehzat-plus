# Roadmap: activity

| Field | Value |
|-------|-------|
| **Module** | `activity` |
| **Frontend Path** | `features/activity/` |
| **Backend Controllers** | `DailyActivityController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

Single-route activity dashboard for trainees. Daily activity tracking via `DailyActivityController`.

| Component | File | LOC (TS) | LOC (HTML) | LOC (SCSS) | Notes |
|-----------|------|----------|------------|------------|-------|
| ActivityComponent | `activity.component.ts` | ~30 | — | — | Trainee activity dashboard |

**Routes**:
- `/activity` — `authGuard, roleGuard('trainee')` — `ActivityComponent`

**API Calls**:
- `getDailyActivities()` — fetch daily activity list
- `getActivityById(id)` — single activity detail
- `completeActivity(id)` — mark activity as done

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| `DailyActivityController` | `/api/daily-activities` | GET, POST, GET (by id), PUT |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getDailyActivities` | `getDailyActivities(): Observable<DailyActivity[]>` | `DailyActivity[]` |
| `getActivityById` | `getActivityById(id: string): Observable<DailyActivity>` | `DailyActivity` |
| `completeActivity` | `completeActivity(id: string): Observable<void>` | `void` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | `ActivityComponent` is ~30 LOC — likely stub with minimal logic | 🟡 Medium | No real functionality | Medium |
| 2 | No unit tests for ActivityComponent | 🟡 Medium | Regressions undetected | Low |
| 3 | No integration tests for DailyActivityController | 🟡 Medium | API contract drift | Medium |
| 4 | No SRS integration for activity scheduling | 🟢 Low | Activities not spaced | Medium |

**Security Audit**:
- [x] Top-level route has role-specific guard (`authGuard, roleGuard('trainee')`)
- [x] Backend controller is in globally locked list (`/api/daily-activities`)
- [ ] Data isolation verified (trainee can only see own activities)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Expand ActivityComponent to show activity list | `activity.component.ts` | — | Frontend | 2h |
| 2 | Add API service for DailyActivity calls | `core/services/` (via interface) | Step 1 | Backend | 1h |
| 3 | Write unit tests for ActivityComponent | `*.spec.ts` | Steps 1-2 | Testing | 1.5h |
| 4 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 3 | QA | 1h |

**Step Details**:

### Step 1: Expand ActivityComponent
- **Goal**: Display daily activity feed with completion status
- **Files**: `features/activity/activity.component.ts`
- **Acceptance**: Shows activity list with XP rewards, completion checkbox

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| ACT-UT-1 | ActivityComponent renders activity list | Displays activities |
| ACT-UT-2 | ActivityComponent handles empty list | Shows "no activities" message |
| ACT-UT-3 | ActivityComponent marks activity complete | Calls `completeActivity()` |
| ACT-UT-4 | ActivityComponent shows XP reward | XP value displayed per activity |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| ACT-RT-1 | Unauthenticated navigates to `/activity` | Redirect to `/auth/login` |
| ACT-RT-2 | Coach navigates to `/activity` | Redirect to `/coach` |
| ACT-RT-3 | Trainee navigates to `/activity` | Activity list loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role (coach) | Redirect to `/coach` |
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
| `core/services/lesson-planner-api` | API interface — **must add methods** | Yes |
| `dashboard` | Daily activity summary | No |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `dashboard` | Dashboard imports activity data | Dashboard shows stale data |
| `coach` | Coach views student activity | Progress incomplete |

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
- frontend/src/app/features/dashboard/**/* (trainee dashboard)
- frontend/src/app/features/coach/**/* (coach role)
- frontend/src/app/features/admin/**/* (admin role)
```

---

## 8. Definition of Done

- [ ] ActivityComponent expanded with real functionality (not a stub)
- [ ] `getDailyActivities`, `completeActivity` added to API interface + both impls
- [ ] All Development Steps completed with passing QA
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: activity list renders with completion checkbox
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
