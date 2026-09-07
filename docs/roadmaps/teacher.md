# Roadmap: teacher

| Field | Value |
|-------|-------|
| **Module** | `teacher` |
| **Frontend Path** | `features/teacher/` |
| **Backend Controllers** | `TeacherController` |
| **Last Reviewed** | 2026-08-11 |
| **Status** | Draft |

---

## 1. Current State

| Component | File | LOC (TS) | LOC (HTML) | LOC (SCSS) | Notes |
|-----------|------|----------|------------|------------|-------|
| TeacherComponent | `teacher.component.ts` | 78 | 2207 | 1775 | Shell with 4 tabs |
| TeacherDashboardSectionComponent | `teacher/teacher-dashboard-section/teacher-dashboard-section.component.ts` | — | — | — | Dashboard overview |
| TeacherCoursesSectionComponent | `teacher/teacher-courses-section/teacher-courses-section.component.ts` | — | — | — | Course list |
| TeacherGradingsSectionComponent | `teacher/teacher-gradings-section/teacher-gradings-section.component.ts` | — | — | — | Grading interface |
| TeacherPendingSectionComponent | `teacher/teacher-pending-section/teacher-pending-section.component.ts` | — | — | — | Pending approvals |

**Routes** (2 routes, `roleGuard('teacher')`):
- `/teacher` — `TeacherPageComponent` (wraps `TeacherComponent`)
- `/teacher/spiritual` — `TeacherSpiritualPageComponent` (via `SpiritualShellComponent`)

**API Calls**:
- `getCourses(teacherId)` — assigned courses
- `getStudents(courseId)` — students in course
- `getAssignments(courseId)` — course assignments
- `gradeSubmission(assignmentId, grade)` — record grade
- `getPendingSubmissions()` — pending grading queue

**Critical finding**: `teacher` role is **NOT** in `Otuh2RoleSeeder.RequiredRoles` — fixed in this session.
**Critical finding**: `ITeacherService` double-registration confirmed already removed in Wave 0.

---

## 2. Available APIs

### Backend Controllers

| Controller | Route Prefix | Methods |
|------------|-------------|---------|
| `TeacherController` | `/api/teachers` | GET, GET (courses), GET (students), PUT (grade) |

### Frontend API Interface

| Method | Signature | Return Type |
|--------|-----------|-------------|
| `getCoursesByTeacher` | `getCoursesByTeacher(teacherId: string): Observable<Course[]>` | `Course[]` |
| `getStudentsByCourse` | `getStudentsByCourse(courseId: string): Observable<Student[]>` | `Student[]` |
| `getAssignmentsByCourse` | `getAssignmentsByCourse(courseId: string): Observable<Assignment[]>` | `Assignment[]` |
| `gradeSubmission` | `gradeSubmission(id: string, grade: number): Observable<Submission>` | `Submission` |

---

## 3. Gap Analysis

| # | Gap | Severity | Impact | Fix Complexity |
|---|-----|----------|--------|----------------|
| 1 | `teacher` role NOT in `Otuh2RoleSeeder.RequiredRoles` | 🔴 Critical | Role never seeded in OTUH2 — teacher logins fail | **FIXED** this session |
| 2 | No dev accounts for teacher role | 🟡 Medium | Cannot test teacher flow in dev | Low — add to DevTokenService |
| 3 | `TeacherController` uses class-level `[Authorize]` — no role restriction | 🟡 Medium | Any authenticated user can access | Medium |
| 4 | Only 1 spec file (teacher.component.spec.ts), 4 sub-sections untested | 🟡 Medium | Regressions in gradings/courses tabs undetected | Medium |
| 5 | `teacher.component.spec.ts` is 2998 bytes — unknown coverage depth | 🟢 Low | Coverage gap | Low |

**Security Audit**:
- [x] Top-level route has role-specific guard (`roleGuard('teacher')`)
- [ ] Backend endpoints have `[Authorize(Roles="teacher")]` — **class-level `[Authorize]` only, no role restriction**
- [ ] Data isolation verified (teacher can only see own courses/students)
- [ ] Negative-access matrix covers all 5 cells

---

## 4. Development Steps

| Step | Description | Files | Depends On | Category | Est. Effort |
|------|-------------|-------|------------|----------|-------------|
| 1 | Add `teacher` to `RequiredRoles` in Otuh2RoleSeeder | `Otuh2RoleSeeder.cs` | — | Backend | **DONE** |
| 2 | Add teacher dev account to DevTokenService | `AuthController.cs` | — | Backend | 0.5h |
| 3 | Add `[Authorize(Roles="teacher")]` to TeacherController | `TeacherController.cs` | — | Backend | 1h |
| 4 | Write unit tests for 4 teacher section components | `*.spec.ts` | — | Testing | 2h |
| 5 | Verify negative-access matrix | `features/shared/testing-utils.ts` | Steps 2-4 | QA | 1h |

**Step Details**:

### Step 1: Add teacher to RequiredRoles (DONE)
- **Goal**: Ensure teacher role is seeded in OTUH2
- **Files**: `backend/.../Infrastructure/Seeders/Otuh2RoleSeeder.cs`
- **Acceptance**: `"teacher"` in `RequiredRoles` array + `"معلم - مدیریت کلاس‌ها"` in `RoleDescriptions`

### Step 3: Role restriction on TeacherController
- **Goal**: Restrict all teacher endpoints to teacher role only
- **Files**: `backend/.../Controllers/TeacherController.cs`
- **Acceptance**: Class-level `[Authorize(Roles="teacher")]` added; unauthenticated → 401, other roles → 403

---

## 5. Required Tests

### Unit Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| T-UT-1 | TeacherComponent renders 4 tabs | Dashboard, Courses, Gradings, Pending visible |
| T-UT-2 | TeacherCoursesSectionComponent loads courses | Fetches via API on init |
| T-UT-3 | TeacherGradingsSectionComponent handles grade submission | Calls `gradeSubmission()` |
| T-UT-4 | TeacherPendingSectionComponent shows pending list | Displays pending assignments |
| T-UT-5 | TeacherDashboardSectionComponent renders overview | Displays stats summary |

### Integration / Route Guard Tests
| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| T-RT-1 | Unauthenticated user navigates to `/teacher` | Redirect to `/auth/login` |
| T-RT-2 | Coach user navigates to `/teacher` | Redirect to `/coach` |
| T-RT-3 | Teacher user navigates to `/teacher` | Component loads with 4 tabs |

### Negative-Access Matrix
Use `features/shared/testing-utils.ts`: `mountStandalone()` + `DEFAULT_MOCK_PROVIDERS` + `createMockApi()`.

| Cell | Condition | Expected Behavior |
|------|-----------|-------------------|
| (a) | Unauthenticated | Redirect to `/auth/login` tree |
| (b) | Authenticated, wrong role (coach) | Redirect to role-specific dashboard |
| (c) | Authenticated, correct role (teacher) | Guard returns `true` |
| (d) | Case-insensitive check | `hasRole()` passes regardless of case |
| (e) | Missing/undefined user | Redirect to `/auth/login` |

**Test Infrastructure**: MUST reuse `features/shared/testing-utils.ts`. MUST NOT create new mock factories.

---

## 6. Dependencies & Prerequisites

### Upstream (this module depends on)
| Module | Dependency Type | Critical? |
|--------|----------------|-----------|
| `core/services/auth` | `roleGuard('teacher')` | Yes |
| `core/models/lesson-planner` | Type definitions | Yes |
| `core/services/lesson-planner-api` | API interface | Yes |
| `shared/spiritual-shell` | Spiritual page wrapper | No |

### Downstream (depends on this module)
| Module | Dependency Type | Impact if broken |
|--------|----------------|------------------|
| `coach` | Coach views teacher-assigned courses | Course data unavailable |
| `admin` | Admin manages teacher accounts | Teacher CRUD broken |

---

## 7. Interference Boundary

These files **MUST NOT** be modified by this module's implementation.

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
- frontend/src/app/features/coach/**/* (coach role)
- frontend/src/app/features/admin/**/* (admin role)
- frontend/src/app/features/dashboard/**/* (trainee dashboard)
```

---

## 8. Definition of Done

- [ ] All Development Steps completed with passing QA
- [ ] `teacher` is in `Otuh2RoleSeeder.RequiredRoles` (**DONE**)
- [ ] `teacher` dev account returns valid JWT
- [ ] `TeacherController` has `[Authorize(Roles="teacher")]`
- [ ] All Required Tests written and passing (RED → GREEN)
- [ ] Negative-access matrix: all 5 cells verified
- [ ] `lsp_diagnostics` clean on all changed files
- [ ] `npm run build` succeeds (frontend changes)
- [ ] `dotnet build` succeeds (backend changes)
- [ ] Manual QA: teacher dashboard renders with 4 tabs
- [ ] No interference with globally locked files (git diff verified)
- [ ] All `MUST NOT` constraints in Interference Boundary respected
- [ ] PR opened on `docs/roadmaps-initial` branch
