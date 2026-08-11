# Roadmap: <Module Name>

| Field | Value |
|-------|-------|
| **Module** | `<module>` |
| **Frontend Path** | `features/<module>/` |
| **Backend Controllers** | `<list>` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

[Describe what exists today: components, routes, API calls, LOC counts. Use tables.]

| Component | File | LOC (TS) | LOC (HTML) | LOC (SCSS) | Notes |
|-----------|------|----------|------------|------------|-------|
| | | | | | |

**Routes**:
[Enumerate routes, guards, and lazy-load structure.]

**API Calls**:
[Which LessonPlannerApi interface methods are used.]

---

## 2. Available APIs

[Enumerate backend controller methods + frontend LessonPlannerApi interface methods relevant to this module.]

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| | | |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| | | |

---

## 3. Gap Analysis

[What's missing, stubbed, broken, or has security gaps. Prioritize by severity: 🔴 Critical / 🟡 Medium / 🟢 Low.]

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| | | | | |

**Security Audit**:
- [ ] Top-level route has role-specific guard (not just bare `authGuard`)
- [ ] Backend endpoints have `[Authorize(Roles="...")]` attribute
- [ ] Data isolation verified (role N cannot access role M data)
- [ ] Negative-access matrix covers all 5 cells (unauthenticated, wrong-role, correct-role, case-insensitive, missing-user)

---

## 4. Development Steps

[Atomic, ordered steps with dependencies. Each step = one file or one atomic change.]

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | | | — | | |
| 2 | | | Step 1 | | |

**Step Details**:

### Step 1: [Title]
- **Goal**: ...
- **Files**: ...
- **Acceptance**: ...

---

## 5. Required Tests

[Unit tests, integration tests, negative-access tests.]

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| | | |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| | | |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role | Redirect to role-specific dashboard |
| (c) | Authenticated, correct role | Guard returns `true` |
| (d) | Case-insensitive check | `hasRole()` passes regardless of case |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

**Test Infrastructure**: MUST reuse `features/shared/testing-utils.ts`. MUST NOT create new mock factories.

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| | | |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|-----------|
| | | |

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
- (add module-specific locked paths here)
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
- [ ] Manual QA: role-specific dashboard renders correctly with dev account
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
