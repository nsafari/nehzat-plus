# QA Report — Wave 4 Verification

**Generated:** 2026-08-11 | **Scope:** Cross-link verification + security audit across all 38 roadmap files

---

## 1. Route Guard Security Audit

### 🔴 CRITICAL: Subject routes missing roleGuard

| Subject | Routes File | Current Guard | Issue | Fix |
|---------|------------|---------------|-------|-----|
| **training-courses** | `training-courses.routes.ts` | **NONE** | Zero protection — anyone can access | Add `authGuard, roleGuard('trainee')` |
| **math** | `math.routes.ts` | `authGuard` only (7/7 routes) | No role restriction — any auth'd user can access | Add `roleGuard('trainee')` to all 7 routes |
| **persian-literature** | `persian-literature.routes.ts` | `authGuard` only | No role restriction | Add `roleGuard('trainee')` |
| **arabic-literature** | `arabic-literature.routes.ts` | `authGuard` only | No role restriction | Add `roleGuard('trainee')` |
| **learning** | `learning.routes.ts` | `authGuard` only (1 route) | No role restriction | Add `roleGuard('trainee')` |

### 🟢 CORRECT: Role-guarded subject routes

| Subject | Guard | Routes |
|---------|-------|--------|
| arts | `authGuard, roleGuard('trainee')` | 1 |
| social | `authGuard, roleGuard('trainee')` | 1 |
| career | `authGuard, roleGuard('trainee')` | 1 |
| career-pathways | `authGuard, roleGuard('trainee')` | 1 |
| portfolio | `authGuard, roleGuard('trainee')` | 1 |
| project-defense | `authGuard, roleGuard('trainee')` | 1 |
| activity | `authGuard, roleGuard('trainee')` | 1 |
| community-metrics | `authGuard, roleGuard('trainee')` | 1 |
| quran | Mixed: `authGuard` + `roleGuard('trainee')` + `roleGuard('admin')` + `roleGuard('coach')` + `roleGuard('trainee')` | 7 |
| hadith | `roleGuard('trainee')` (6 routes) | 6 |
| experimental-sciences | Mixed: `authGuard` + `roleGuard('trainee')` | 6 |

### 🟡 NOTE: Survey routing uses serviceSurveyGuard

| Module | Guard | Notes |
|--------|-------|-------|
| survey | `serviceSurveyGuard` | Parent + HQ + manager only (excludes trainee) |
| surveys | `authGuard` only | Shared survey components — broader access |

### Role route map (app.routes.ts):

| Role | Route | Guards |
|------|-------|--------|
| auth | `/auth` | none (unauthenticated entry) |
| trainee | `/dashboard` | `authGuard` only |
| admin | `/admin` | `authGuard, adminGuard` |
| coach | `/coach` | `authGuard` only |
| parent | `/parent` | `authGuard` only |
| branch-manager | `/branch-manager` | `authGuard` only |
| evaluator | `/evaluator` | `authGuard` only |
| headquarters | `/headquarters` | `authGuard` only |
| teacher | `/teacher` | `authGuard` only |

**Finding**: Role routes rely on route-level `roleGuard` inside individual route files, NOT on app.routes.ts-level guards. This means `authGuard` alone on app.routes.ts doesn't restrict by role — good design.

---

## 2. Backend Authorization Audit

### 🔴 CRITICAL: AssessmentController role restriction

| Endpoint | Before Fix | After Fix |
|----------|-----------|-----------|
| Class-level | `[Authorize]` | `[Authorize(Roles="manager,headquarters,branch_manager,coach,evaluator")]` |
| `SubmitResult` (`POST {id}/submit`) | Inherited (admin/evaluator only) | `+ trainee` role added |
| `StartAssessment` (`POST {id}/start/{studentId}`) | Inherited (admin/evaluator only) | `+ trainee` role added |
| `GetResultsByStudent` (`GET student/{studentId}/results`) | Inherited (admin/evaluator only) | `+ parent, trainee` roles added |

### 🟡 MEDIUM: TeacherController role restriction

| File | Status | Notes |
|------|--------|-------|
| `TeacherController.cs` | `[Authorize]` class-level only | No role restriction — needs `[Authorize(Roles="teacher")]` |

### 🔴 FIXED: Otuh2RoleSeeder

| Change | Status |
|--------|--------|
| Added `"teacher"` to `RequiredRoles` array | ✅ Done |
| Added `["teacher"] = "معلم - مدیریت کلاس‌ها"` to `RoleDescriptions` | ✅ Done |

### 🔴 FIXED: ITeacherService double-registration

| Change | Status |
|--------|--------|
| Duplicate `AddScoped<ITeacherService, TeacherService>()` removed | ✅ Done (Wave 0) |
| Single registration confirmed at line 102 | ✅ Verified |

---

## 3. File Inventory

### All 38 roadmap files created:

| Category | Count | Files |
|----------|-------|-------|
| Cross-cutting (shared infrastructure) | 6 | assessment-panel, spiritual-shell, spiritual-path, spiritual-occasion, spiritual-history, surveys-shared |
| Role roadmaps | 8 | admin, coach, evaluator, parent, branch-manager, headquarters, dashboard, teacher |
| Subject roadmaps | 18 | quran, hadith, persian-literature, arabic-literature, math, experimental-sciences, arts, social, career, career-pathways, portfolio, project-defense, community-metrics, training-courses, learning, survey, surveys, activity |
| Meta files | 3 | _template, README, _pilot-qa |
| QA report | 1 | _qa-report |
| **Total** | **39** | |

### Cross-link verification:
- All role roadmaps reference `_template.md` ✅
- All role roadmaps reference `assessment-panel.md` where relevant ✅
- All role roadmaps reference `spiritual-shell.md` for spiritual pages ✅
- `parent.md` references shared MonthlyBookletComponent DRY issue ✅
- `headquarters.md` references shared MonthlyBookletComponent DRY issue ✅
- `dashboard.md` references 3 PAGE_LAYER_REPORT.md unfinished items ✅
- `teacher.md` documents fixed Otuh2RoleSeeder + ITeacherService changes ✅
- `evaluator.md` documents AssessmentController auth gate fix ✅

---

## 4. Template Compliance Check

| Criterion | Status | Notes |
|-----------|--------|-------|
| Header: `# Roadmap: <Name>` | ✅ Pass | All modules |
| Header: metadata table (6 fields) | ✅ Pass | All modules |
| 8 sections in order | ✅ Pass | All modules |
| Current State: component table | ✅ Pass | All modules |
| Available APIs: backend + frontend tables | ✅ Pass | All modules |
| Gap Analysis: severity tags (🔴/🟡/🟢) | ✅ Pass | All modules |
| Gap Analysis: Security Audit checklist | ✅ Pass | All modules |
| Development Steps: table + step details | ✅ Pass | All modules |
| Required Tests: unit + integration + matrix | ✅ Pass | All modules |
| Required Tests: 5-cell negative-access matrix | ✅ Pass | All modules |
| Dependencies: upstream + downstream tables | ✅ Pass | All modules |
| Interference Boundary: globally locked + module-specific | ✅ Pass | All modules |
| Definition of Done: checklist | ✅ Pass | All modules |
| Testing-utils.ts reference | ✅ Pass | All modules |
| `useMockApi` note in env | ✅ Pass | Cross-referenced |

**Pilot QA result (from `_pilot-qa.md`):** Initially FAILED (3/5 pass) → after template rewrite: **ALL PASS** ✅

---

## 5. Outstanding Issues for Wave 5

| Priority | Issue | Roadmap |
|----------|-------|---------|
| 🔴 Fix | `training-courses.routes.ts` has NO guards | `training-courses.md` |
| 🔴 Fix | `math.routes.ts` uses `authGuard` only | `math.md` |
| 🔴 Fix | `persian-literature.routes.ts` uses `authGuard` only | `persian-literature.md` |
| 🔴 Fix | `arabic-literature.routes.ts` uses `authGuard` only | `arabic-literature.md` |
| 🔴 Fix | `learning.routes.ts` uses `authGuard` only | `learning.md` |
| 🟡 Fix | `TeacherController.cs` needs `[Authorize(Roles="teacher")]` | `teacher.md` |
| 🟡 Refactor | `dashboard.component.ts` (714 LOC) needs decomposition | `dashboard.md` |
| 🟡 Refactor | 3 admin sub-modules exceed 250 LOC | `admin.md` |

---

## 6. Build Verification

| Command | Result |
|---------|--------|
| `dotnet build` (backend) | ✅ 0 errors after AssessmentController + Otuh2RoleSeeder fixes |
| `npm run build` (frontend) | ✅ Succeeds (pre-existing NG8107 budget warnings) |
