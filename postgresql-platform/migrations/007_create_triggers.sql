-- =============================================
-- Nehzat Digital Platform — PostgreSQL Schema
-- Migration 007: Auto-Update Triggers
-- =============================================

-- =============================================
-- Apply updated_at trigger to all tables
-- =============================================

-- branches
CREATE TRIGGER update_branches_updated_at
    BEFORE UPDATE ON branches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- teachers
CREATE TRIGGER update_teachers_updated_at
    BEFORE UPDATE ON teachers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- students
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- sessions
CREATE TRIGGER update_sessions_updated_at
    BEFORE UPDATE ON sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- attendance
CREATE TRIGGER update_attendance_updated_at
    BEFORE UPDATE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- progress_reports
CREATE TRIGGER update_progress_reports_updated_at
    BEFORE UPDATE ON progress_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- audio_evidence
CREATE TRIGGER update_audio_evidence_updated_at
    BEFORE UPDATE ON audio_evidence
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- certificates
CREATE TRIGGER update_certificates_updated_at
    BEFORE UPDATE ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- teacher_evaluations
CREATE TRIGGER update_teacher_evaluations_updated_at
    BEFORE UPDATE ON teacher_evaluations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- kpi_snapshots
CREATE TRIGGER update_kpi_snapshots_updated_at
    BEFORE UPDATE ON kpi_snapshots
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- behavioral_incidents
CREATE TRIGGER update_behavioral_incidents_updated_at
    BEFORE UPDATE ON behavioral_incidents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- teacher_leaves
CREATE TRIGGER update_teacher_leaves_updated_at
    BEFORE UPDATE ON teacher_leaves
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- Auto-update session attendance count
-- =============================================
CREATE OR REPLACE FUNCTION update_session_attendance_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE sessions
        SET attendance_count = (
            SELECT COUNT(*) FROM attendance
            WHERE session_id = NEW.session_id AND status = 'present'
        )
        WHERE id = NEW.session_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE sessions
        SET attendance_count = (
            SELECT COUNT(*) FROM attendance
            WHERE session_id = OLD.session_id AND status = 'present'
        )
        WHERE id = OLD.session_id;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE sessions
        SET attendance_count = (
            SELECT COUNT(*) FROM attendance
            WHERE session_id = NEW.session_id AND status = 'present'
        )
        WHERE id = NEW.session_id;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_attendance_count
    AFTER INSERT OR UPDATE OR DELETE ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION update_session_attendance_count();

-- =============================================
-- Auto-generate certificate number
-- =============================================
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.certificate_number IS NULL THEN
        NEW.certificate_number := 'NHZ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
            LPAD(FLOOR(RANDOM() * 9999 + 1)::TEXT, 4, '0');
    END IF;
    IF NEW.verification_code IS NULL THEN
        NEW.verification_code := UPPER(
            SUBSTR(MD5(RANDOM()::TEXT), 1, 8) || '-' ||
            SUBSTR(MD5(RANDOM()::TEXT), 1, 8)
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_generate_cert_number
    BEFORE INSERT ON certificates
    FOR EACH ROW
    EXECUTE FUNCTION generate_certificate_number();

-- =============================================
-- Auto-update student memorization stats
-- =============================================
CREATE OR REPLACE FUNCTION update_student_memorization_stats()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE students
    SET
        total_pages_memorized = (
            SELECT COALESCE(SUM(pages_memorized), 0)
            FROM progress_reports
            WHERE student_id = NEW.student_id AND deleted_at IS NULL
        ),
        updated_at = NOW()
    WHERE id = NEW.student_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_student_stats
    AFTER INSERT OR UPDATE ON progress_reports
    FOR EACH ROW
    EXECUTE FUNCTION update_student_memorization_stats();

-- =============================================
-- Auto-create user on teacher/student creation
-- =============================================
CREATE OR REPLACE FUNCTION auto_create_user_for_teacher()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NULL THEN
        INSERT INTO users (username, role, branch_id, first_name, last_name)
        VALUES (
            'teacher_' || NEW.id::TEXT,
            'teacher',
            NEW.branch_id,
            '',
            ''
        )
        RETURNING id INTO NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Note: This trigger is disabled by default. Enable only if needed.
-- CREATE TRIGGER trg_auto_create_user_teacher
--     BEFORE INSERT ON teachers
--     FOR EACH ROW
--     EXECUTE FUNCTION auto_create_user_for_teacher();
