# Spiritual Path Panel - Spiritual Path Display Roadmap

> **Status:** active (used, not hardened)
> **Generated:** 2026-08-11
> **Scope:** `frontend/src/app/features/shared/spiritual-path-panel/`
> **Consumers:** dashboard (via spiritual-shell)

---

## 1. Component Inventory

| Field | Value |
|-------|-------|
| **Path** | `features/shared/spiritual-path-panel/spiritual-path-panel.component.ts` |
| **Lines** | ~150 LOC (verify) |
| **Selector** | `app-spiritual-path-panel` |
| **Standalone** | Yes (Angular 21) |
| **Services Injected** | `SpiritualService` (verify) |

---

## 2. Current State

### What it does
- Displays student spiritual path progress
- Shows completed and pending spiritual milestones
- Renders progress indicators and achievement badges
- Integrates with `SpiritualService` for data fetching

### Strengths
- Clear visual representation of spiritual journey
- Responsive design with `--lp-*` CSS properties
- Self-contained with minimal external dependencies

### Gaps and Risks

| # | Gap | Severity |
|---|-----|----------|
| 1 | **No unit tests:** Zero coverage | MEDIUM |
| 2 | **No error handling:** No fallback for API failures | MEDIUM |
| 3 | **No loading states:** No skeleton during data fetch | LOW |
| 4 | **Hardcoded labels:** Persian text not using i18n | LOW |

---

## 3. Development Roadmap

### Phase A: Error Handling and Loading

| ID | Task | Acceptance |
|----|------|------------|
| A.1 | Add try/catch around API calls with user-friendly error message | API failure -> Persian error message displayed |
| A.2 | Add loading skeleton while fetching path data | Skeleton visible for >200ms fetch time |
| A.3 | Add empty state for no spiritual path | Friendly message when no milestones exist |

### Phase B: Testing

| ID | Task | Acceptance |
|----|------|------------|
| B.1 | Unit test: component renders with mock SpiritualService | `ng test` passes |
| B.2 | Unit test: error state displays correctly | API error -> error message shown |
| B.3 | Unit test: empty state displays correctly | No data -> empty state shown |

---

## 4. Interference Boundary

| File | Reason |
|------|--------|
| `features/shared/spiritual-shell/` | Parent layout - change via spiritual-shell roadmap |
| `features/shared/spiritual-occasion-panel/` | Sibling - independent |
| `features/shared/spiritual-history-panel/` | Sibling - independent |

---

## 5. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-08-11 | Initial roadmap generated | Sisyphus |
