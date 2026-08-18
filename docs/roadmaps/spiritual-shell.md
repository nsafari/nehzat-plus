# Spiritual Shell - Shared Layout Wrapper Roadmap

> **Status:** active (used, not hardened)
> **Generated:** 2026-08-11
> **Scope:** `frontend/src/app/features/shared/spiritual-shell/`
> **Consumers:** dashboard, spiritual-path, spiritual-occasion, spiritual-history

---

## 1. Component Inventory

| Field | Value |
|-------|-------|
| **Path** | `features/shared/spiritual-shell/spiritual-shell.component.ts` |
| **Lines** | ~200 LOC (verify) |
| **Selector** | `app-spiritual-shell` |
| **Standalone** | Yes (Angular 21) |
| **Role** | Layout wrapper for spiritual content sections |

---

## 2. Current State

### What it does
- Provides consistent layout wrapper for spiritual content sections
- Manages section navigation (path, occasion, history)
- Handles responsive behavior for spiritual sub-panels
- Integrates with CSS custom properties for theming

### Strengths
- Consistent visual wrapper across all spiritual sub-components
- Responsive layout with CSS grid/flexbox
- Uses project-standard `--lp-*` CSS custom properties
- Decoupled from business logic

### Gaps and Risks

| # | Gap | Severity |
|---|-----|----------|
| 1 | **No unit tests:** Zero coverage | MEDIUM |
| 2 | **Tight coupling:** Directly imports spiritual sub-components | MEDIUM |
| 3 | **No loading states:** No skeleton/placeholder during data fetch | LOW |
| 4 | **Accessibility:** No ARIA labels for section navigation | LOW |

---

## 3. Dependencies

### Inbound (consumers)

| Consumer | Usage |
|----------|-------|
| `dashboard.component.ts` | Student self-view spiritual section |
| `spiritual-path.component.ts` | Wrapped by this shell |
| `spiritual-occasion.component.ts` | Wrapped by this shell |
| `spiritual-history.component.ts` | Wrapped by this shell |

### Outbound (services)

| Service | Calls |
|---------|-------|
| None | Pure layout component, no service injection |

### Sibling components
- `spiritual-path-panel` - Path display within shell
- `spiritual-occasion-panel` - Occasion display within shell
- `spiritual-history-panel` - History display within shell |

---

## 4. Development Roadmap

### Phase A: Component Hardening

| ID | Task | Acceptance |
|----|------|------------|
| A.1 | Add `@Input()` for shell title and section configuration | Configurable via parent component |
| A.2 | Add loading skeleton while spiritual sub-components fetch data | Skeleton visible for >200ms fetch time |
| A.3 | Add empty state for no spiritual data | Friendly Persian message when no data exists |
| A.4 | Add ARIA labels for section navigation | Screen readers can navigate sections |

### Phase B: Testing

| ID | Task | Acceptance |
|----|------|------------|
| B.1 | Unit test: shell renders with correct sections | `ng test` passes |
| B.2 | Unit test: section navigation works | Click section -> correct panel visible |
| B.3 | Unit test: responsive layout at different breakpoints | Mobile/tablet/desktop layouts correct |

---

## 5. Interference Boundary (Locked Files)

| File | Reason |
|------|--------|
| `features/dashboard/dashboard.component.ts` | Consumer - change via its own roadmap |
| `features/shared/spiritual-path-panel/` | Sibling - change via spiritual-path roadmap |
| `features/shared/spiritual-occasion-panel/` | Sibling - change via spiritual-occasion roadmap |
| `features/shared/spiritual-history-panel/` | Sibling - change via spiritual-history roadmap |

---

## 6. Acceptance Criteria

- [ ] Shell renders all three spiritual sub-panels correctly
- [ ] Loading skeleton visible during data fetch
- [ ] Empty state shows friendly Persian message
- [ ] ARIA labels present for section navigation
- [ ] Unit test coverage >80%

---

## 7. Changelog

| Date | Change | Author |
|------|--------|--------|
| 2026-08-11 | Initial roadmap generated | Sisyphus |
