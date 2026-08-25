-- =============================================
-- Nehzat Digital Platform — PostgreSQL Schema
-- Migration 003: Education Tables
-- =============================================

-- =============================================
-- 3. TEACHERS (مربیان)
-- =============================================
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    school_type school_type NOT NULL,               -- مکتب مربوطه
    specialization VARCHAR(100),                     -- تخصص (قرائت، حفظ، تجوید)
    experience_years INT DEFAULT 0,
    certification_level skill_level DEFAULT 'beginner',
    max_students INT DEFAULT 20,                     -- حداکثر ظرفیت کلاس
    is_active BOOLEAN DEFAULT TRUE,
    hire_date DATE,
    contract_type VARCHAR(50),                       -- تمام‌وقت/نیمه‌وقت/داوطلبانه
    monthly_hours INT DEFAULT 0,                     -- ساعت کاری ماهانه
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_teachers_user ON teachers(user_id);
CREATE INDEX idx_teachers_branch ON teachers(branch_id);
CREATE INDEX idx_teachers_school ON teachers(school_type);
CREATE INDEX idx_teachers_active ON teachers(is_active) WHERE deleted_at IS NULL;

-- =============================================
-- 4. STUDENTS (دانش‌آموزان)
-- =============================================
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    school_type school_type NOT NULL,               -- مکتب
    circle_level circle_level NOT NULL,              -- حلقه فعلی
    gender gender NOT NULL,
    birth_date DATE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    student_code VARCHAR(50),                        -- کد دانش‌آموزی
    velocity_category VARCHAR(20) DEFAULT 'متعادل', -- محکم/متعادل/پویا
    current_surah VARCHAR(100),                      -- سوره فعلی
    memorized_juz INT DEFAULT 0,                     -- تعداد جزء حفظ شده
    total_pages_memorized INT DEFAULT 0,
    parent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    emergency_contact VARCHAR(20),
    medical_notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_students_branch ON students(branch_id);
CREATE INDEX idx_students_school ON students(school_type);
CREATE INDEX idx_students_circle ON students(circle_level);
CREATE INDEX idx_students_parent ON students(parent_id);
CREATE INDEX idx_students_velocity ON students(velocity_category);
CREATE INDEX idx_students_active ON students(is_active) WHERE deleted_at IS NULL;

-- =============================================
-- 5. SESSIONS (جلسات قرآنی)
-- =============================================
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
    circle_level circle_level NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INT GENERATED ALWAYS AS (
        EXTRACT(EPOCH FROM (end_time - start_time)) / 60
    ) STORED,
    status session_status DEFAULT 'planned',
    topic VARCHAR(200),                              -- موضوع جلسه
    notes TEXT,
    attendance_count INT DEFAULT 0,
    total_students INT DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_sessions_branch ON sessions(branch_id);
CREATE INDEX idx_sessions_teacher ON sessions(teacher_id);
CREATE INDEX idx_sessions_circle ON sessions(circle_level);
CREATE INDEX idx_sessions_date ON sessions(session_date);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_active ON sessions(is_active) WHERE deleted_at IS NULL;

-- =============================================
-- 6. ATTENDANCE (حضور و غیاب)
-- =============================================
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'present',  -- present/absent/late/excused
    arrival_time TIME,
    departure_time TIME,
    notes TEXT,
    recorded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);

CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_status ON attendance(status);

-- =============================================
-- 7. PROGRESS_REPORTS (گزارش پیشرفت)
-- =============================================
CREATE TABLE progress_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    report_type VARCHAR(50) NOT NULL,               -- daily/weekly/monthly/assessment
    -- Tajweed scores (0-100)
    tajweed_score INT CHECK (tajweed_score >= 0 AND tajweed_score <= 100),
    -- Memorization
    pages_memorized INT DEFAULT 0,
    pages_reviewed INT DEFAULT 0,
    memorization_accuracy INT CHECK (memorization_accuracy >= 0 AND memorization_accuracy <= 100),
    -- Reading fluency
    reading_speed VARCHAR(20),                       -- slow/medium/fast
    reading_fluency INT CHECK (reading_fluency >= 0 AND reading_fluency <= 100),
    -- Behavioral
    behavior_score INT CHECK (behavior_score >= 0 AND behavior_score <= 100),
    -- Overall
    overall_score INT CHECK (overall_score >= 0 AND overall_score <= 100),
    comments TEXT,
    strengths TEXT,
    areas_for_improvement TEXT,
    recommendations TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_progress_student ON progress_reports(student_id);
CREATE INDEX idx_progress_session ON progress_reports(session_id);
CREATE INDEX idx_progress_teacher ON progress_reports(teacher_id);
CREATE INDEX idx_progress_date ON progress_reports(report_date);
CREATE INDEX idx_progress_type ON progress_reports(report_type);
