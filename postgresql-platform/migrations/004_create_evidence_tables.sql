-- =============================================
-- Nehzat Digital Platform — PostgreSQL Schema
-- Migration 004: Evidence & Certification Tables
-- =============================================

-- =============================================
-- 8. AUDIO_EVIDENCE (شواهد صوتی)
-- =============================================
CREATE TABLE audio_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE RESTRICT,
    -- File info
    file_name VARCHAR(200) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    duration_seconds INT,
    mime_type VARCHAR(50) DEFAULT 'audio/webm',
    -- Content
    surah VARCHAR(100),                              -- سوره تلاوت شده
    ayah_range VARCHAR(50),                          -- آیات تلاوت شده
    recitation_type VARCHAR(50),                     -- ترتیل/مجلسی/حفظ
    -- Evaluation
    tajweed_score INT CHECK (tajweed_score >= 0 AND tajweed_score <= 100),
    tarteel_score INT CHECK (tarteel_score >= 0 AND tarteel_score <= 100),
    pronunciation_score INT CHECK (pronunciation_score >= 0 AND pronunciation_score <= 100),
    overall_score INT CHECK (overall_score >= 0 AND overall_score <= 100),
    teacher_feedback TEXT,
    is_public BOOLEAN DEFAULT FALSE,                 -- قابل اشتراک‌گذاری
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_audio_student ON audio_evidence(student_id);
CREATE INDEX idx_audio_session ON audio_evidence(session_id);
CREATE INDEX idx_audio_teacher ON audio_evidence(teacher_id);
CREATE INDEX idx_audio_surah ON audio_evidence(surah);
CREATE INDEX idx_audio_date ON audio_evidence(created_at);
CREATE INDEX idx_audio_public ON audio_evidence(is_public) WHERE is_public = TRUE;

-- =============================================
-- 9. CERTIFICATES (گواهینامه‌ها)
-- =============================================
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    -- Certificate details
    certificate_type VARCHAR(100) NOT NULL,          -- نوع گواهینامه
    title VARCHAR(200) NOT NULL,                     -- عنوان
    description TEXT,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiry_date DATE,
    -- Level info
    circle_level circle_level,                       -- حلقه کسب شده
    skill_level skill_level,                         -- سطح مهارت
    -- Verification
    certificate_number VARCHAR(100) UNIQUE NOT NULL, -- شماره گواهینامه
    verification_code VARCHAR(50) UNIQUE NOT NULL,   -- کد تایید
    is_verified BOOLEAN DEFAULT TRUE,
    -- File
    file_path TEXT,                                  -- فایل PDF گواهینامه
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_cert_student ON certificates(student_id);
CREATE INDEX idx_cert_branch ON certificates(branch_id);
CREATE INDEX idx_cert_type ON certificates(certificate_type);
CREATE INDEX idx_cert_number ON certificates(certificate_number);
CREATE INDEX idx_cert_verification ON certificates(verification_code);
