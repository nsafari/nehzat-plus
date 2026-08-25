-- =============================================
-- Nehzat Digital Platform — PostgreSQL Schema
-- Migration 006: Row-Level Security Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE behavioral_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_leaves ENABLE ROW LEVEL SECURITY;

-- =============================================
-- Helper: Get current user's role
-- =============================================
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN COALESCE(
        current_setting('app.current_user_role', TRUE)::user_role,
        'admin'::user_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION current_user_branch_id()
RETURNS UUID AS $$
BEGIN
    RETURN current_setting('app.current_user_branch_id', TRUE)::UUID;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- BRANCHES policies
-- =============================================
-- Admins and headquarters see all branches
CREATE POLICY branches_all_access ON branches
    FOR ALL
    USING (current_user_role() IN ('admin', 'headquarters'));

-- Branch managers see their own branch
CREATE POLICY branches_own_access ON branches
    FOR SELECT
    USING (
        id = current_user_branch_id()
        OR parent_id = current_user_branch_id()
    );

-- =============================================
-- USERS policies
-- =============================================
-- Admins see all users
CREATE POLICY users_all_access ON users
    FOR ALL
    USING (current_user_role() = 'admin');

-- Users can see their own profile
CREATE POLICY users_own_profile ON users
    FOR SELECT
    USING (oidc_subject = current_setting('app.current_user_subject', TRUE));

-- Teachers see students in their branch
CREATE POLICY users_teacher_view ON users
    FOR SELECT
    USING (
        current_user_role() = 'teacher'
        AND role = 'student'
        AND branch_id = current_user_branch_id()
    );

-- =============================================
-- TEACHERS policies
-- =============================================
-- Admins see all teachers
CREATE POLICY teachers_all_access ON teachers
    FOR ALL
    USING (current_user_role() = 'admin');

-- Branch managers see teachers in their branch
CREATE POLICY teachers_branch_view ON teachers
    FOR SELECT
    USING (
        current_user_role() = 'branch_manager'
        AND branch_id = current_user_branch_id()
    );

-- Teachers can view their own profile
CREATE POLICY teachers_own_profile ON teachers
    FOR SELECT
    USING (
        user_id IN (
            SELECT id FROM users
            WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
        )
    );

-- =============================================
-- STUDENTS policies
-- =============================================
-- Admins see all students
CREATE POLICY students_all_access ON students
    FOR ALL
    USING (current_user_role() = 'admin');

-- Teachers see students in their branch
CREATE POLICY students_teacher_view ON students
    FOR SELECT
    USING (
        current_user_role() = 'teacher'
        AND branch_id = current_user_branch_id()
    );

-- Parents see their own children
CREATE POLICY students_parent_view ON students
    FOR SELECT
    USING (
        parent_id IN (
            SELECT id FROM users
            WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
        )
    );

-- Students see their own profile
CREATE POLICY students_own_profile ON students
    FOR SELECT
    USING (
        user_id IN (
            SELECT id FROM users
            WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
        )
    );

-- =============================================
-- SESSIONS policies
-- =============================================
-- Admins see all sessions
CREATE POLICY sessions_all_access ON sessions
    FOR ALL
    USING (current_user_role() = 'admin');

-- Teachers see sessions in their branch
CREATE POLICY sessions_teacher_view ON sessions
    FOR SELECT
    USING (
        current_user_role() = 'teacher'
        AND branch_id = current_user_branch_id()
    );

-- Branch managers see sessions in their branch
CREATE POLICY sessions_manager_view ON sessions
    FOR SELECT
    USING (
        current_user_role() = 'branch_manager'
        AND branch_id = current_user_branch_id()
    );

-- =============================================
-- ATTENDANCE policies
-- =============================================
-- Admins see all attendance
CREATE POLICY attendance_all_access ON attendance
    FOR ALL
    USING (current_user_role() = 'admin');

-- Teachers manage attendance for their sessions
CREATE POLICY attendance_teacher_manage ON attendance
    FOR ALL
    USING (
        current_user_role() = 'teacher'
        AND session_id IN (
            SELECT id FROM sessions
            WHERE teacher_id IN (
                SELECT id FROM teachers
                WHERE user_id IN (
                    SELECT id FROM users
                    WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
                )
            )
        )
    );

-- =============================================
-- PROGRESS_REPORTS policies
-- =============================================
-- Admins see all reports
CREATE POLICY progress_all_access ON progress_reports
    FOR ALL
    USING (current_user_role() = 'admin');

-- Teachers see reports they created
CREATE POLICY progress_teacher_view ON progress_reports
    FOR SELECT
    USING (
        current_user_role() = 'teacher'
        AND teacher_id IN (
            SELECT id FROM teachers
            WHERE user_id IN (
                SELECT id FROM users
                WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
            )
        )
    );

-- Parents see reports for their children
CREATE POLICY progress_parent_view ON progress_reports
    FOR SELECT
    USING (
        student_id IN (
            SELECT id FROM students
            WHERE parent_id IN (
                SELECT id FROM users
                WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
            )
        )
    );

-- =============================================
-- AUDIO_EVIDENCE policies
-- =============================================
-- Admins see all audio
CREATE POLICY audio_all_access ON audio_evidence
    FOR ALL
    USING (current_user_role() = 'admin');

-- Teachers see audio for their students
CREATE POLICY audio_teacher_view ON audio_evidence
    FOR SELECT
    USING (
        current_user_role() = 'teacher'
        AND teacher_id IN (
            SELECT id FROM teachers
            WHERE user_id IN (
                SELECT id FROM users
                WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
            )
        )
    );

-- Students see their own audio
CREATE POLICY audio_student_view ON audio_evidence
    FOR SELECT
    USING (
        student_id IN (
            SELECT id FROM students
            WHERE user_id IN (
                SELECT id FROM users
                WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
            )
        )
    );

-- =============================================
-- CERTIFICATES policies
-- =============================================
-- Admins see all certificates
CREATE POLICY cert_all_access ON certificates
    FOR ALL
    USING (current_user_role() = 'admin');

-- Students see their own certificates
CREATE POLICY cert_student_view ON certificates
    FOR SELECT
    USING (
        student_id IN (
            SELECT id FROM students
            WHERE user_id IN (
                SELECT id FROM users
                WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
            )
        )
    );

-- Public verification (anyone can verify)
CREATE POLICY cert_public_verify ON certificates
    FOR SELECT
    USING (is_verified = TRUE);

-- =============================================
-- TEACHER_EVALUATIONS policies
-- =============================================
-- Admins see all evaluations
CREATE POLICY eval_all_access ON teacher_evaluations
    FOR ALL
    USING (current_user_role() = 'admin');

-- Teachers see their own evaluations
CREATE POLICY eval_teacher_view ON teacher_evaluations
    FOR SELECT
    USING (
        teacher_id IN (
            SELECT id FROM teachers
            WHERE user_id IN (
                SELECT id FROM users
                WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
            )
        )
    );

-- =============================================
-- KPI_SNAPSHOTS policies
-- =============================================
-- Admins and headquarters see all KPIs
CREATE POLICY kpi_all_access ON kpi_snapshots
    FOR ALL
    USING (current_user_role() IN ('admin', 'headquarters'));

-- Branch managers see KPIs for their branch
CREATE POLICY kpi_branch_view ON kpi_snapshots
    FOR SELECT
    USING (
        current_user_role() = 'branch_manager'
        AND branch_id = current_user_branch_id()
    );

-- =============================================
-- BEHAVIORAL_INCIDENTS policies
-- =============================================
-- Admins see all incidents
CREATE POLICY behavior_all_access ON behavioral_incidents
    FOR ALL
    USING (current_user_role() = 'admin');

-- Teachers see incidents for their students
CREATE POLICY behavior_teacher_view ON behavioral_incidents
    FOR SELECT
    USING (
        current_user_role() = 'teacher'
        AND branch_id = current_user_branch_id()
    );

-- Parents see incidents for their children
CREATE POLICY behavior_parent_view ON behavioral_incidents
    FOR SELECT
    USING (
        student_id IN (
            SELECT id FROM students
            WHERE parent_id IN (
                SELECT id FROM users
                WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
            )
        )
    );

-- =============================================
-- TEACHER_LEAVES policies
-- =============================================
-- Admins see all leaves
CREATE POLICY leaves_all_access ON teacher_leaves
    FOR ALL
    USING (current_user_role() = 'admin');

-- Branch managers see leaves in their branch
CREATE POLICY leaves_manager_view ON teacher_leaves
    FOR SELECT
    USING (
        current_user_role() = 'branch_manager'
        AND branch_id = current_user_branch_id()
    );

-- Teachers see their own leaves
CREATE POLICY leaves_teacher_view ON teacher_leaves
    FOR SELECT
    USING (
        teacher_id IN (
            SELECT id FROM teachers
            WHERE user_id IN (
                SELECT id FROM users
                WHERE oidc_subject = current_setting('app.current_user_subject', TRUE)
            )
        )
    );
