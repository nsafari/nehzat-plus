# Roadmap: portfolio

| Field | Value |
|-------|-------|
| **Module** | `portfolio` |
| **Frontend Path** | `features/portfolio/` |
| **Backend Controllers** | `StudentController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

Subject module for `portfolio` curriculum. Trainee-focused with roleGuard.

| Component | File | LOC (TS) | Notes |
|-----------|------|----------|-------|
| PortfolioComponent | `portfolio.component.ts` | ~30 | Student portfolio view |

**Routes**:
- `/portfolio` — `authGuard, roleGuard('trainee')` — single route — `PortfolioComponent`

**API Calls**:
- Subject-specific CRUD via `LessonPlannerApi` interface
- Student progress tracking
- Submission and grading
- History records

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| ``StudentController`` | `/api/portfolio` | varies |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getportfolioContent` | `getportfolioContent(): Observable<any[]>` | `any[]` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | No unit tests for subject pages | 🟡 Medium | Regressions undetected | Medium |
| 2 | No integration tests for subject API | 🟡 Medium | API contract drift | Medium |
| 3 | No negative-access verification for roleGuard | 🟢 Low | Role guard untested | Low |
| 4 | No loading/error states in pages | 🟢 Low | Poor UX | Low |
| 5 | Single-route portfolio view — may need expansion for full CRUD | 🟡 Medium | Limited functionality | Low |

**Security Audit**:
- [[x] Top-level route has role-specific guard]
- [ ] Backend endpoints have `[Authorize(Roles="trainee")]` — needs verification
- [ ] Data isolation verified
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Add unit tests for components | `*.spec.ts` | — | Testing | 1.5h |
| 2 | Add roleGuard if missing | `features/portfolio/` | — | Security | 0.5h |
| 3 | Add loading/error states | `*.component.ts` | — | Frontend | 1h |
| 4 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 1-3 | QA | 1h |

**Step Details**:

### Step 1: Add unit tests
- **Goal**: Cover components with unit tests
- **Files**: `features/portfolio/**/*.spec.ts`
- **Acceptance**: 80%+ code coverage

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| PORT-UT-1 | Page loads | Content displayed |
| PORT-UT-2 | Empty state | Message shown |
| PORT-UT-3 | Error handling | Error shown |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| PORT-RT-1 | Unauthenticated | Redirect to `/auth/login` |
| PORT-RT-2 | Wrong role | Redirect to role-specific dashboard |
| PORT-RT-3 | Trainee role | Component loads |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` |
| (b) | Wrong role | Redirect to dashboard |
| (c) | Correct role (trainee) | Guard returns `true` |
| (d) | Case-insensitive | `hasRole()` passes |
| (e) | Missing user | Redirect to `/auth/login` |

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `core/services/auth` | Route guard | Yes |
| `core/models/lesson-planner` | Type definitions | Yes |
| `core/services/lesson-planner-api` | API interface | Yes |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `dashboard` | Student self-view | Content incomplete |
| `coach` | Coach views progress | Data unavailable |

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
- frontend/src/app/features/dashboard/**/*
- frontend/src/app/features/coach/**/*
- frontend/src/app/features/admin/**/*
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: portfolio page renders correctly
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
