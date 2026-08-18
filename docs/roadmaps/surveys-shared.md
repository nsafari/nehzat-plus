# Surveys Shared Components - Survey System Reconciliation Roadmap

> **Status:** active (3-way reconciliation needed)
> **Generated:** 2026-08-11
> **Scope:** survey, surveys, shared survey components

---

## 1. Survey System Inventory

### Feature Routes (from app.routes.ts)

| Route | Path | Purpose |
|-------|------|---------|
| `survey` | `features/survey/` | Individual survey taking |
| `surveys` | `features/surveys/` | Survey list/browsing |

### Shared Components

| Component | Path | Lines |
|-----------|------|-------|
| `survey-list` | `features/shared/survey-list/` | ~200 LOC (verify) |
| `survey-taker` | `features/shared/survey-taker/` | ~300 LOC (verify) |

### Backend Endpoints

| Controller | Endpoints | Auth |
|------------|-----------|------|
| `SurveysController` | GET/POST surveys, GET survey by ID | `[Authorize]` |
| `SurveyResponsesController` | POST responses, GET responses | `[Authorize]` |

---

## 2. Current State

### What exists
- `survey` route: Individual survey taking experience
- `surveys` route: Survey list/browsing interface
- `survey-list` shared component: Reusable survey listing
- `survey-taker` shared component: Reusable survey taking form

### Strengths
- Shared components reduce duplication
- Clear separation between list view and taking view
- Backend endpoints well-structured

### Gaps and Risks

| # | Gap | Severity |
|---|-----|----------|
| 1 | **Route ambiguity:** `survey` vs `surveys` routes may confuse users | MEDIUM |
| 2 | **Shared component overlap:** `survey-list` may duplicate `surveys` route logic | MEDIUM |
| 3 | **No unit tests:** Zero coverage on survey components | MEDIUM |
| 4 | **No progress saving:** Survey progress not saved if user navigates away | LOW |
| 5 | **No mobile optimization:** Survey forms not optimized for mobile | LOW |

---

## 3. Route/Component Reconciliation Plan

### Current Mapping

```
/surveys -> surveys.component.ts -> survey-list.shared component
/survey/:id -> survey.component.ts -> survey-taker.shared component
```

### Reconciliation Tasks

| ID | Task | Acceptance |
|----|------|------------|
| R.1 | Audit `surveys.component.ts` for overlap with `survey-list` shared | Document any duplicated logic |
| R.2 | Audit `survey.component.ts` for overlap with `survey-taker` shared | Document any duplicated logic |
| R.3 | Extract common logic into shared components if duplication found | No duplicated business logic |
| R.4 | Verify route guards and auth requirements | Only authorized users can access surveys |

---

## 4. Development Roadmap

### Phase A: Reconciliation (do first)

| ID | Task | Acceptance |
|----|------|------------|
| A.1 | Document current data flow for survey list view | Data flow diagram |
| A.2 | Document current data flow for survey taking view | Data flow diagram |
| A.3 | Identify and remove duplicated logic | No duplicated code |
| A.4 | Verify shared components are used correctly | Consistent behavior across routes |

### Phase B: User Experience

| ID | Task | Acceptance |
|----|------|------------|
| B.1 | Add progress saving for in-progress surveys | Progress saved every 30 seconds |
| B.2 | Add mobile-optimized survey forms | Forms usable on 320px+ screens |
| B.3 | Add confirmation dialog before submitting survey | User confirms before final submit |
| B.4 | Add Persian date formatting for survey deadlines | Jalali calendar dates displayed |

### Phase C: Testing

| ID | Task | Acceptance |
|----|------|------------|
| C.1 | Unit test: survey list renders correctly | `ng test` passes |
| C.2 | Unit test: survey taker submits correctly | Form submission works |
| C.3 | Unit test: progress saving works | Progress saved and restored |
| C.4 | Integration test: full survey flow | E2E: browse -> select -> take -> submit |

---

## 5. Interference Boundary

| File | Reason |
|------|--------|
| `features/dashboard/dashboard.component.ts` | Consumer - change via its own roadmap |
| `features/admin/admin.component.ts` | Admin survey management - separate scope |
| `backend/.../SurveysController.cs` | Backend - change via backend roadmap |

---

## 6. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-08-11 | Initial roadmap generated | Sisyphus |
