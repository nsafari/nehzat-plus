# Pilot QA Report

**Generated:** 2026-08-11
**Pilot files:** coach.md, evaluator.md
**Template:** _template.md

---

## QA Results

| # | Check | coach.md | evaluator.md | Notes |
|---|-------|----------|--------------|-------|
| 1 | Header starts with `# Roadmap:` pattern | FAIL | FAIL | Both use `# <Role> Role - Development Roadmap` instead of `# Roadmap: <Role>` |
| 2 | Contains ALL 8 section headers matching template | FAIL | FAIL | Section names diverge from template (see Template Drift below) |
| 3 | Lists real file paths and LOC counts | PASS | PASS | Both reference features/ paths and backend controllers |
| 4 | Negative-access test matrix (5 cells) | FAIL | FAIL | No formal negative-access matrix in Section 5 of either file |
| 5 | evaluator.md flags missing [Authorize] as #1 gap | N/A | PASS | CRITICAL gap properly flagged in Section 3 + Phase A |
| 6 | coach.md flags missing top-level role guard | PASS | N/A | roleGuard("coach") reference present but not explicitly flagged as missing in Section 3 |
| 7 | References features/shared/testing-utils.ts | FAIL | FAIL | Neither pilot mentions testing-utils.ts |
| 8 | Cross-reference to assessment-panel.md resolves | PASS | PASS | File exists at docs/roadmaps/assessment-panel.md |

---

## Template Drift Analysis

### Section name mapping

| Template Section | Pilot Section | Match? |
|-----------------|---------------|--------|
| `## 1. Current State` | `## 1. Role Overview` | NO - pilot adds extra section |
| `## 2. Available APIs` | `## 2. Current State` | NO - pilot skips Available APIs entirely |
| `## 3. Gap Analysis` | `## 3. Gaps and Risks` | NO - different name, similar content |
| `## 4. Development Steps` | `## 4. Development Roadmap` | NO - different name, similar content |
| `## 5. Required Tests` | `## 5. Dependencies` | NO - pilot skips Required Tests entirely |
| `## 6. Dependencies & Prerequisites` | `## 6. Interference Boundary` | NO - pilot skips Dependencies section |
| `## 7. Interference Boundary` | `## 7. Acceptance Criteria` | NO - pilot skips Interference Boundary |
| `## 8. Definition of Done` | `## 8. Changelog` | NO - pilot uses Changelog instead of DoD |

### Decision: Keep pilot format or align to template?

**Recommendation: ALIGN PILOTS TO TEMPLATE**

Reasons:
1. Consistency across all 36+ roadmaps is critical for cross-team navigation
2. The template was designed by Prometheus with specific sections (Available APIs, Required Tests, Definition of Done) that pilots omit
3. Negative-access matrix (template Section 5) is a security requirement - cannot skip
4. Definition of Done (template Section 8) is the QA gate - replacing with Changelog loses accountability

### Required amendments to pilot files

| # | Amendment | Priority |
|---|-----------|----------|
| 1 | Rename header to `# Roadmap: Coach` / `# Roadmap: Evaluator` | HIGH |
| 2 | Add `## 1. Current State` (merge Role Overview into it) | HIGH |
| 3 | Add `## 2. Available APIs` with backend controller methods + frontend interface methods | HIGH |
| 4 | Rename `## 3. Gaps and Risks` to `## 3. Gap Analysis` | MEDIUM |
| 5 | Rename `## 4. Development Roadmap` to `## 4. Development Steps` | MEDIUM |
| 6 | Add `## 5. Required Tests` with negative-access matrix (5 cells) + unit tests | HIGH |
| 7 | Rename `## 5. Dependencies` to `## 6. Dependencies & Prerequisites` | MEDIUM |
| 8 | Add `## 7. Interference Boundary` with globally locked + module-specific locked files | HIGH |
| 9 | Replace `## 8. Changelog` with `## 8. Definition of Done` (checklist) | HIGH |
| 10 | Add `features/shared/testing-utils.ts` reference in test sections | MEDIUM |

---

## Summary

| Metric | Value |
|--------|-------|
| Total checks | 8 |
| PASS | 3 |
| FAIL | 5 |
| Template drift items | 10 |
| Recommended action | Rewrite both pilots to align with template |

**Verdict: FAIL** — Pilots must be rewritten to match template structure before proceeding to Wave 2.

---

## Recommended Next Steps

1. **Rewrite coach.md** — align to template 8-section structure, add Available APIs, Required Tests (with negative-access matrix), Interference Boundary (global + module-specific), Definition of Done
2. **Rewrite evaluator.md** — same alignment + keep CRITICAL auth warning
3. **Re-run QA** after rewrite to verify all 8 checks PASS
4. **Proceed to Wave 2** only after pilot QA passes
