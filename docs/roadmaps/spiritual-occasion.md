# Spiritual Occasion Panel - Spiritual Occasion Display Roadmap

> **Status:** active (used, not hardened)
> **Generated:** 2026-08-11
> **Scope:** `frontend/src/app/features/shared/spiritual-occasion-panel/`
> **Consumers:** dashboard (via spiritual-shell)

---

## 1. Component Inventory

| Field | Value |
|-------|-------|
| **Path** | `features/shared/spiritual-occasion-panel/spiritual-occasion-panel.component.ts` |
| **Lines** | ~150 LOC (verify) |
| **Selector** | `app-spiritual-occasion-panel` |
| **Standalone** | Yes (Angular 21) |
| **Services Injected** | `SpiritualService` (verify) |

---

## 2. Current State

### What it does
- Displays upcoming and past spiritual occasions/events
- Shows occasion details (date, description, requirements)
- Integrates with `SpiritualService` for occasion data

### Strengths
- Clear event listing with date formatting
- Responsive design with `--lp-*` CSS properties
- Self-contained component

### Gaps and Risks

| # | Gap | Severity |
|---|-----|----------|
| 1 | **No unit tests:** Zero coverage | MEDIUM |
| 2 | **No error handling:** No fallback for API failures | MEDIUM |
| 3 | **No calendar integration:** Occasions not synced with calendar | LOW |

---

## 3. Development Roadmap

### Phase A: Error Handling and Loading

| ID | Task | Acceptance |
|----|------|------------|
| A.1 | Add try/catch around API calls with user-friendly error message | API failure -> Persian error message displayed |
| A.2 | Add loading skeleton while fetching occasion data | Skeleton visible for >200ms fetch time |
| A.3 | Add empty state for no occasions | Friendly message when no occasions exist |

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
| `features/shared/spiritual-path-panel/` | Sibling - independent |
| `features/shared/spiritual-history-panel/` | Sibling - independent |

---

## 5. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-08-11 | Initial roadmap generated | Sisyphus |
