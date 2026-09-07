# Spiritual History Panel - Spiritual History Display Roadmap

> **Status:** active (used, not hardened)
> **Generated:** 2026-08-11
> **Scope:** `frontend/src/app/features/shared/spiritual-history-panel/`
> **Consumers:** dashboard (via spiritual-shell)

---

## 1. Component Inventory

| Field | Value |
|-------|-------|
| **Path** | `features/shared/spiritual-history-panel/spiritual-history-panel.component.ts` |
| **Lines** | ~150 LOC (verify) |
| **Selector** | `app-spiritual-history-panel` |
| **Standalone** | Yes (Angular 21) |
| **Services Injected** | `SpiritualService` (verify) |

---

## 2. Current State

### What it does
- Displays student spiritual history timeline
- Shows completed spiritual activities with timestamps
- Provides filtering by date range and activity type
- Integrates with `SpiritualService` for history data

### Strengths
- Clear chronological timeline display
- Responsive design with `--lp-*` CSS properties
- Self-contained with filtering capabilities

### Gaps and Risks

| # | Gap | Severity |
|---|-----|----------|
| 1 | **No unit tests:** Zero coverage | MEDIUM |
| 2 | **No error handling:** No fallback for API failures | MEDIUM |
| 3 | **No pagination:** History may grow large without lazy loading | MEDIUM |
| 4 | **No export:** Cannot export history data | LOW |

---

## 3. Development Roadmap

### Phase A: Performance and Error Handling

| ID | Task | Acceptance |
|----|------|------------|
| A.1 | Add pagination or virtual scrolling for large histories | 100+ items render without lag |
| A.2 | Add try/catch around API calls with user-friendly error message | API failure -> Persian error message displayed |
| A.3 | Add loading skeleton while fetching history data | Skeleton visible for >200ms fetch time |
| A.4 | Add empty state for no history | Friendly message when no history exists |

### Phase B: Testing

| ID | Task | Acceptance |
|----|------|------------|
| B.1 | Unit test: component renders with mock SpiritualService | `ng test` passes |
| B.2 | Unit test: error state displays correctly | API error -> error message shown |
| B.3 | Unit test: filtering works correctly | Filter by date -> correct items shown |

---

## 4. Interference Boundary

| File | Reason |
|------|--------|
| `features/shared/spiritual-shell/` | Parent layout - change via spiritual-shell roadmap |
| `features/shared/spiritual-path-panel/` | Sibling - independent |
| `features/shared/spiritual-occasion-panel/` | Sibling - independent |

---

## 5. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-08-11 | Initial roadmap generated | Sisyphus |
