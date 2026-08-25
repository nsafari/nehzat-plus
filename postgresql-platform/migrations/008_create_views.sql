-- =============================================
-- Nehzat Digital Platform — PostgreSQL Schema
-- Migration 008: Useful Views & Analytics
-- =============================================

-- =============================================
-- View: Student Dashboard
-- =============================================
CREATE OR REPLACE VIEW v_student_dashboard AS
SELECT
    s.id AS student_id,
    u.username,
    u.first_name || ' ' || u.last_name AS display_name,
    b.name AS branch_name,
    s.school_type,
    s.circle_level,
    s.velocity_category,
    s.memorized_juz,
    s.total_pages_memorized,
    s.current_surah,
    -- Latest progress
    pr.tajweed_score AS latest_tajweed,
    pr.memorization_accuracy AS latest_memorization,
    pr.overall_score AS latest_overall,
    pr.report_date AS latest_report_date,
    -- Attendance stats
    (SELECT COUNT(*) FROM attendance a
     WHERE a.student_id = s.id AND a.status = 'present'
       AND a.created_at >= NOW() - INTERVAL '30 days') AS attendance_30d,
    (SELECT COUNT(*) FROM attendance a
     WHERE a.student_id = s.id
       AND a.created_at >= NOW() - INTERVAL '30 days') AS total_sessions_30d,
    -- Audio count
    (SELECT COUNT(*) FROM audio_evidence ae
     WHERE ae.student_id = s.id) AS total_recordings,
    -- Certificate count
    (SELECT COUNT(*) FROM certificates c
     WHERE c.student_id = s.id AND c.is_verified = TRUE) AS certificate_count
FROM students s
JOIN users u ON s.user_id = u.id
LEFT JOIN branches b ON s.branch_id = b.id
LEFT JOIN LATERAL (
    SELECT tajweed_score, memorization_accuracy, overall_score, report_date
    FROM progress_reports
    WHERE student_id = s.id AND deleted_at IS NULL
    ORDER BY report_date DESC
    LIMIT 1
) pr ON TRUE
WHERE s.is_active = TRUE AND s.deleted_at IS NULL;

-- =============================================
-- View: Teacher Dashboard
-- =============================================
CREATE OR REPLACE VIEW v_teacher_dashboard AS
SELECT
    t.id AS teacher_id,
    u.username,
    u.first_name || ' ' || u.last_name AS display_name,
    b.name AS branch_name,
    t.school_type,
    t.specialization,
    t.experience_years,
    -- Student count
    (SELECT COUNT(*) FROM students s
     WHERE s.branch_id = t.branch_id
       AND s.school_type = t.school_type
       AND s.is_active = TRUE AND s.deleted_at IS NULL) AS student_count,
    -- Active sessions this week
    (SELECT COUNT(*) FROM sessions sess
     WHERE sess.teacher_id = t.id
       AND sess.session_date >= CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INT
       AND sess.session_date < CURRENT_DATE - EXTRACT(DOW FROM CURRENT_DATE)::INT + 7
       AND sess.deleted_at IS NULL) AS sessions_this_week,
    -- Average student progress
    (SELECT ROUND(AVG(pr.overall_score), 1)
     FROM progress_reports pr
     JOIN students s ON pr.student_id = s.id
     WHERE pr.teacher_id = t.id
       AND pr.report_date >= NOW() - INTERVAL '30 days'
       AND pr.deleted_at IS NULL) AS avg_student_progress,
    -- Evaluation score
    (SELECT total_score FROM teacher_evaluations te
     WHERE te.teacher_id = t.id AND te.deleted_at IS NULL
     ORDER BY evaluation_date DESC LIMIT 1) AS latest_eval_score
FROM teachers t
JOIN users u ON t.user_id = u.id
LEFT JOIN branches b ON t.branch_id = b.id
WHERE t.is_active = TRUE AND t.deleted_at IS NULL;

-- =============================================
-- View: Branch Analytics
-- =============================================
CREATE OR REPLACE VIEW v_branch_analytics AS
SELECT
    b.id AS branch_id,
    b.name AS branch_name,
    b.name_fa AS branch_name_fa,
    b.city,
    b.province,
    -- Student stats
    (SELECT COUNT(*) FROM students s
     WHERE s.branch_id = b.id AND s.is_active = TRUE AND s.deleted_at IS NULL) AS total_students,
    (SELECT COUNT(*) FROM students s
     WHERE s.branch_id = b.id AND s.is_active = TRUE AND s.deleted_at = IS NULL
       AND s.circle_level IN ('circle_1', 'circle_2')) AS young_students,
    (SELECT COUNT(*) FROM students s
     WHERE s.branch_id = b.id AND s.is_active = TRUE AND s.deleted_at = IS NULL
       AND s.circle_level IN ('circle_7', 'circle_8', 'circle_9')) AS senior_students,
    -- Teacher stats
    (SELECT COUNT(*) FROM teachers t
     WHERE t.branch_id = b.id AND t.is_active = TRUE AND t.deleted_at = IS NULL) AS total_teachers,
    -- Session stats
    (SELECT COUNT(*) FROM sessions sess
     WHERE sess.branch_id = b.id
       AND sess.session_date >= DATE_TRUNC('month', NOW())
       AND sess.deleted_at = IS NULL) AS sessions_this_month,
    (SELECT COUNT(*) FROM sessions sess
     WHERE sess.branch_id = b.id
       AND sess.status = 'completed'
       AND sess.session_date >= DATE_TRUNC('month', NOW())
       AND sess.deleted_at = IS NULL) AS completed_sessions_this_month,
    -- Performance
    (SELECT ROUND(AVG(pr.overall_score), 1)
     FROM progress_reports pr
     JOIN students s ON pr.student_id = s.id
     WHERE s.branch_id = b.id
       AND pr.report_date >= NOW() - INTERVAL '30 days'
       AND pr.deleted_at = IS NULL) AS avg_performance_30d,
    -- Attendance rate
    (SELECT ROUND(
        CASE WHEN COUNT(*) > 0 THEN
            (COUNT(*) FILTER (WHERE a.status = 'present')::DECIMAL / COUNT(*) * 100)
        ELSE 0 END, 1)
     FROM attendance a
     JOIN sessions sess ON a.session_id = sess.id
     WHERE sess.branch_id = b.id
       AND sess.session_date >= NOW() - INTERVAL '30 days') AS attendance_rate_30d
FROM branches b
WHERE b.is_active = TRUE AND b.deleted_at IS NULL;

-- =============================================
-- View: Velocity Tracking
-- =============================================
CREATE OR REPLACE VIEW v_velocity_tracking AS
SELECT
    s.id AS student_id,
    u.username,
    u.first_name || ' ' || u.last_name AS display_name,
    s.velocity_category,
    s.school_type,
    s.circle_level,
    -- Lines per day (last 14 days)
    (SELECT COALESCE(SUM(pages_memorized), 0) / 14.0
     FROM progress_reports pr
     WHERE pr.student_id = s.id
       AND pr.report_date >= NOW() - INTERVAL '14 days'
       AND pr.deleted_at IS NULL) AS lines_per_day_14d,
    -- Classification
    CASE
        WHEN (SELECT COALESCE(SUM(pages_memorized), 0) / 14.0
              FROM progress_reports pr
              WHERE pr.student_id = s.id
                AND pr.report_date >= NOW() - INTERVAL '14 days'
                AND pr.deleted_at IS NULL) >= 5 THEN 'پویا'
        WHEN (SELECT COALESCE(SUM(pages_memorized), 0) / 14.0
              FROM progress_reports pr
              WHERE pr.student_id = s.id
                AND pr.report_date >= NOW() - INTERVAL '14 days'
                AND pr.deleted_at IS NULL) >= 3 THEN 'متعادل'
        ELSE 'محکم'
    END AS calculated_velocity
FROM students s
JOIN users u ON s.user_id = u.id
WHERE s.is_active = TRUE AND s.deleted_at IS NULL;

-- =============================================
-- View: Monthly Program Dashboard
-- =============================================
CREATE OR REPLACE VIEW v_monthly_dashboard AS
SELECT
    DATE_TRUNC('month', sess.session_date) AS month,
    sess.branch_id,
    b.name AS branch_name,
    -- Session stats
    COUNT(DISTINCT sess.id) AS total_sessions,
    COUNT(DISTINCT sess.id) FILTER (WHERE sess.status = 'completed') AS completed_sessions,
    COUNT(DISTINCT sess.id) FILTER (WHERE sess.status = 'cancelled') AS cancelled_sessions,
    -- Attendance
    (SELECT COUNT(*) FROM attendance a
     JOIN sessions s2 ON a.session_id = s2.id
     WHERE s2.branch_id = sess.branch_id
       AND DATE_TRUNC('month', s2.session_date) = DATE_TRUNC('month', sess.session_date)
       AND a.status = 'present') AS total_attendance,
    (SELECT COUNT(DISTINCT a.student_id) FROM attendance a
     JOIN sessions s2 ON a.session_id = s2.id
     WHERE s2.branch_id = sess.branch_id
       AND DATE_TRUNC('month', s2.session_date) = DATE_TRUNC('month', sess.session_date)
       AND a.status = 'present') AS unique_students,
    -- Performance
    (SELECT ROUND(AVG(pr.overall_score), 1)
     FROM progress_reports pr
     JOIN students s ON pr.student_id = s.id
     WHERE s.branch_id = sess.branch_id
       AND DATE_TRUNC('month', pr.report_date) = DATE_TRUNC('month', sess.session_date)
       AND pr.deleted_at IS NULL) AS avg_performance
FROM sessions sess
LEFT JOIN branches b ON sess.branch_id = b.id
WHERE sess.deleted_at IS NULL
GROUP BY DATE_TRUNC('month', sess.session_date), sess.branch_id, b.name
ORDER BY month DESC, branch_name;
