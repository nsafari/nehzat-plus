-- ============================================
-- نهضت تربیتی حضرت سیدالشهدا علیه السلام
-- PostgreSQL Schema — نسخه ۱.۰
-- طراحی شده برای داشبورد مربی/مدیر + ارزیابی غیرمستقیم + پرونده دانش‌آموز
-- ============================================

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "ltree";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'manager', 'admin', 'evaluator');
CREATE TYPE circle_level AS ENUM ('circle_1','circle_2','circle_3','circle_4','circle_5','circle_6','circle_7','circle_8','circle_9');
CREATE TYPE school_type AS ENUM ('ali_asghar','ruqayyah','qasim','sakina');
CREATE TYPE skill_level AS ENUM ('firm','balanced','dynamic');
CREATE TYPE gender AS ENUM ('male','female');
CREATE TYPE session_status AS ENUM ('scheduled','completed','cancelled','makeup');
CREATE TYPE evaluation_status AS ENUM ('pending','in_progress','completed','archived');
CREATE TYPE leave_type AS ENUM ('sick','annual','mission','other');

-- ============================================
-- جداول اصلی
-- ============================================

-- ۱. شعبه‌ها (ساختار سلسله‌مراتبی)
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    school_type school_type NOT NULL,
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'ایران',
    address TEXT,
    capacity_students INT DEFAULT 30,
    capacity_teachers INT DEFAULT 4,
    path ltree,
    parent_id UUID REFERENCES branches(id),
    is_active BOOLEAN DEFAULT true,
    established_at DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_branches_path ON branches USING GIST (path);
CREATE INDEX idx_branches_school ON branches (school_type);

-- ۲. کاربران
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    national_code VARCHAR(20) UNIQUE,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    gender gender,
    birth_date DATE,
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    last_login_at TIMESTAMPTZ,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_username_trgm ON users USING GIN (username gin_trgm_ops);

-- ۳. مربیان
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_code VARCHAR(20) UNIQUE,
    branch_id UUID NOT NULL REFERENCES branches(id),
    school_type school_type NOT NULL,
    circles circle_level[],
    specialization TEXT[],
    certification_level INT DEFAULT 1,
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    mentor_id UUID REFERENCES teachers(id),
    monthly_hours_target INT DEFAULT 60,
    hourly_rate DECIMAL(10,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_teachers_branch ON teachers (branch_id);

-- ۴. دانش‌آموزان
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    student_code VARCHAR(20) UNIQUE NOT NULL,
    branch_id UUID NOT NULL REFERENCES branches(id),
    school_type school_type NOT NULL,
    circle circle_level NOT NULL,
    skill_level skill_level NOT NULL DEFAULT 'balanced',
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(100),
    emergency_contact JSONB,
    medical_info JSONB DEFAULT '{}',
    enrollment_date DATE NOT NULL,
    graduation_date DATE,
    status VARCHAR(20) DEFAULT 'active',
    previous_quran_background TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_students_branch_circle ON students (branch_id, circle);
CREATE INDEX idx_students_skill ON students (skill_level);

-- ۵. جلسات تدریس
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES branches(id),
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    circle circle_level NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    status session_status DEFAULT 'scheduled',
    topic VARCHAR(200),
    lesson_plan JSONB,
    actual_start_at TIMESTAMPTZ,
    actual_end_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_sessions_teacher_date ON sessions (teacher_id, scheduled_at);
CREATE INDEX idx_sessions_branch_date ON sessions (branch_id, scheduled_at);

-- ۶. حضور و غیاب
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    check_in_at TIMESTAMPTZ,
    check_out_at TIMESTAMPTZ,
    note TEXT,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (session_id, student_id)
);

-- ۷. گزارش پیشرفت ماهانه (فرم ۳)
CREATE TABLE progress_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES teachers(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    circle circle_level NOT NULL,
    report_month DATE NOT NULL,
    sessions_held INT NOT NULL,
    sessions_attended INT NOT NULL,
    tajweed_topics JSONB,
    tajweed_score SMALLINT,
    hifz_surahs TEXT[],
    hifz_pages INT DEFAULT 0,
    hifz_quality SMALLINT,
    samaa_minutes_daily_avg INT,
    samaa_compliance_pct DECIMAL(5,2),
    samaa_qari VARCHAR(50),
    qiraat_sessions INT DEFAULT 0,
    qiraat_level SMALLINT,
    behavior_observations JSONB,
    behavior_score SMALLINT,
    strengths TEXT[],
    weaknesses TEXT[],
    teacher_recommendations TEXT[],
    parent_feedback TEXT,
    is_finalized BOOLEAN DEFAULT false,
    finalized_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (student_id, report_month)
);

-- ۸. شواهد صوتی
CREATE TABLE audio_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    progress_report_id UUID REFERENCES progress_reports(id) ON DELETE SET NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    type VARCHAR(30) NOT NULL,
    surah_topic VARCHAR(100),
    duration_seconds INT,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    mime_type VARCHAR(50) DEFAULT 'audio/mpeg',
    quality_score SMALLINT,
    teacher_notes TEXT,
    is_shared_with_parents BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_audio_student_date ON audio_evidence (student_id, recorded_at DESC);

-- ۹. گواهینامه‌ها
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    level VARCHAR(50),
    issued_at DATE NOT NULL,
    expires_at DATE,
    certificate_number VARCHAR(50) UNIQUE,
    file_path VARCHAR(500),
    issued_by UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ۱۰. ارزیابی مربیان
CREATE TABLE teacher_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL REFERENCES users(id),
    cycle_start DATE NOT NULL,
    cycle_end DATE NOT NULL,
    self_assessment JSONB,
    observations JSONB,
    parent_survey JSONB,
    student_survey JSONB,
    feedback_notes TEXT,
    feedback_at TIMESTAMPTZ,
    idp JSONB,
    idp_review_at TIMESTAMPTZ,
    idp_progress JSONB,
    overall_score DECIMAL(5,2),
    overall_level INT,
    decision VARCHAR(50),
    decided_at TIMESTAMPTZ,
    decided_by UUID REFERENCES users(id),
    status evaluation_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ۱۱. عکس‌های KPI
CREATE TABLE kpi_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID REFERENCES branches(id),
    snapshot_date DATE NOT NULL,
    ci_students_total INT,
    ci_teachers_total INT,
    ci_teacher_student_ratio DECIMAL(5,2),
    ci_budget_utilization_pct DECIMAL(5,2),
    pr_session_completion_pct DECIMAL(5,2),
    pr_attendance_pct DECIMAL(5,2),
    pr_samaa_compliance_pct DECIMAL(5,2),
    pr_teaching_quality_avg DECIMAL(5,2),
    pd_tajweed_progress_pct DECIMAL(5,2),
    pd_hifz_completion_pct DECIMAL(5,2),
    pd_parent_satisfaction DECIMAL(5,2),
    pd_retention_pct DECIMAL(5,2),
    raw_data JSONB,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (branch_id, snapshot_date)
);

-- ۱۲. رخدادهای رفتاری (فرم ۶)
CREATE TABLE behavioral_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    reported_by UUID NOT NULL REFERENCES users(id),
    branch_id UUID NOT NULL REFERENCES branches(id),
    incident_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    immediate_action TEXT,
    intervention_plan JSONB,
    follow_ups JSONB,
    severity INT DEFAULT 1,
    status VARCHAR(20) DEFAULT 'open',
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ۱۳. مرخصی مربیان (فرم ۷)
CREATE TABLE teacher_leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    leave_type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    substitute_teacher_id UUID REFERENCES teachers(id),
    handover_notes TEXT,
    makeup_plan JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END $$;

-- اعمال trigger به همه جداول با ستون updated_at
DO $$ DECLARE
    t record;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.columns
             WHERE column_name = 'updated_at' AND table_schema = 'public'
    LOOP
        EXECUTE format('CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t.table_name, t.table_name);
    END LOOP;
END $$;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- مربی فقط دانش‌آموزان شعبه خود را ببیند
CREATE POLICY teacher_branch_access ON students
    FOR ALL TO teacher_role
    USING (branch_id IN (
        SELECT branch_id FROM teachers WHERE user_id = current_user_id()
    ));

-- والدین فقط فرزندان خود را ببینند
CREATE POLICY parent_own_children ON students
    FOR SELECT TO parent_role
    USING (user_id = current_user_id());

-- مدیر همه شعبه‌ها را ببیند
CREATE POLICY manager_all_branches ON students
    FOR ALL TO manager_role
    USING (true);
