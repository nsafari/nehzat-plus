# Assessment Panel - Shared Component Roadmap

> **Status:** active (used, not hardened)
> **Generated:** 2026-08-11
> **Scope:** `frontend/src/app/features/shared/assessment-panel/`
> **Consumers:** dashboard, evaluator, coach (via shared)

---

## 1. Component Inventory

| Field | Value |
|-------|-------|
| **Path** | `features/shared/assessment-panel/assessment-panel.component.ts` |
| **Lines** | ~531 LOC |
| **Selector** | `app-assessment-panel` |
| **ChangeDetection** | OnPush (verify) |
| **Standalone** | Yes (Angular 21) |
| **Services Injected** | `AssessmentService`, `AuthService` |

---

## 2. Current State

### What it does
- Renders assessment creation forms (rubric-based, criteria scoring)
- Displays historical assessment data with filtering (date, student, course)
- Emits `assessmentSubmitted` event to parent
- Supports single-student (dashboard self-view) and multi-student (evaluator panel) modes

### Strengths
- Self-contained with clear `@Input()`/`@Output()` contract
- Reusable across roles (dashboard, evaluator, coach)
- Uses `--lp-*` CSS custom properties consistently
- No external UI library dependencies

### Gaps and Risks

| # | Gap | Severity |
|---|-----|----------|
| 1 | **Evaluator auth gap:** Zero `[Authorize(Roles="evaluator")]` on assessment endpoints | CRITICAL |
| 2 | **No unit tests:** 531 LOC, zero coverage | HIGH |
| 3 | **Role checks:** Manual string compare instead of `hasRole()` in some paths | MEDIUM |
| 4 | **Mock divergence:** Mock assessment responses may not match production DTO | MEDIUM |
| 5 | **Empty state:** No skeleton/placeholder for zero-assessment students | LOW |

---

## 3. Responsibilities (RACI)

| Concern | Owner |
|---------|-------|
| Render assessment form | This component |
| Validate rubric data | Client-side + API enforcement |
| Emit submission event | This component |
| Persist assessment | `AssessmentService` (backend) |
| Filter/search | This component (client-side) |
| Authorization | Backend `[Authorize]` gates |

---

## 4. Dependencies

### Inbound (consumers)

| Consumer | Usage |
|----------|-------|
| `dashboard.component.ts` | Student self-view of own assessments |
| `evaluator.component.ts` | Evaluator overrides / bulk assessment |
| `coach.component.ts` | Indirect via embedded evaluator view |

### Outbound (services)

| Service | Calls |
|---------|-------|
| `AssessmentService` | `getAssessments()`, `createAssessment()`, `updateAssessment()`, `deleteAssessment()` |
| `AuthService` | `hasRole()`, `getCurrentUser()` |

### Shared modules
- `shared/persian-date-input` - date selection
- `shared/spiritual-shell` - layout wrapper (if embedded)

---

## 5. Development Roadmap

### Phase A: Security Hardening (CRITICAL - do first)

| ID | Task | Acceptance |
|----|------|------------|
| A.1 | Add `[Authorize(Roles = "evaluator,admin")]` to `AdminAssessmentsController` create/update/delete | Unauthenticated -> 401; students -> 403 |
| A.2 | Add `[Authorize(Roles = "evaluator,admin,coach")]` to read endpoints | Coaches can read; students cannot read others |
| A.3 | Verify `OidcSyncMiddleware` creates local User row before any assessment write | First-time assessor can submit without 500 |
| A.4 | Audit all assessment API calls - ensure no student can assess another | Integration test: student A cannot POST assessment for student B |

### Phase B: Component Hardening

| ID | Task | Acceptance |
|----|------|------------|
| B.1 | Replace manual role comparisons with `authService.hasRole()` calls | No `=== evaluator` string literals remain |
| B.2 | Add null guards for assessment history (empty state UI) | Zero assessments -> friendly Persian message |
| B.3 | Add loading skeleton while fetching assessments | Skeleton visible for >200ms fetch time |
| B.4 | Implement optimistic UI for assessment submission | UI updates immediately; rolls back on error |
| B.5 | Add Persian date picker via `persian-date-input` | Dates display in Jalali calendar |

### Phase C: Testing

| ID | Task | Acceptance |
|----|------|------------|
| C.1 | Unit test: component renders with mock AssessmentService | `ng test` passes, >80% line coverage |
| C.2 | Unit test: role-based visibility logic | Evaluator sees all students; student sees only self |
| C.3 | Unit test: assessment submission emits correct payload | `assessmentSubmitted` event fires with valid DTO |
| C.4 | Integration test: evaluator can create assessment via API | E2E: evaluator login -> submit -> appears in history |
| C.5 | Integration test: student cannot access evaluator endpoints | E2E: student login -> POST to assessment API -> 403 |

### Phase D: Mock API Reconciliation

| ID | Task | Acceptance |
|----|------|------------|
| D.1 | Compare mock assessment DTOs with production `AssessmentDto` | Field-by-field parity document |
| D.2 | Fix mismatches in `MockLessonPlannerApiService` | Mock responses match production shape |
| D.3 | Add runtime type-checking in dev mode to catch drift | Console warning if mock DTO missing fields |

---

## 6. Interference Boundary (Locked Files)

| File | Reason |
|------|--------|
| `features/dashboard/dashboard.component.ts` | Consumer - change via its own roadmap |
| `features/evaluator/evaluator.component.ts` | Consumer - change via its own roadmap |
| `backend/.../Domain/Entities/Assessment.cs` | Entity - change via backend roadmap |
| `backend/.../Application/DTOs/AssessmentDto.cs` | DTO - change via backend roadmap |

---

## 7. Acceptance Criteria

- [ ] All assessment endpoints require `[Authorize(Roles="evaluator,admin")]` minimum
- [ ] Component has >80% unit test coverage
- [ ] No manual role string comparisons remain
- [ ] Mock DTOs match production DTOs field-for-field
- [ ] Empty state, loading state, and error state all have Persian UI
- [ ] E2E: evaluator can create, read, update, delete assessments
- [ ] E2E: student cannot access another student s assessments

---

## 8. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-08-11 | Initial roadmap generated | Sisyphus |
