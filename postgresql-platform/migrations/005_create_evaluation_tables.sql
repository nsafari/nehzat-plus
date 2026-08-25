-- =============================================
-- Nehzat Digital Platform — PostgreSQL Schema
-- Migration 005: Evaluation & Analytics Tables
-- =============================================

-- =============================================
-- 10. TEACHER_EVALUATIONS (ارزیابی مربیان)
-- =============================================
CREATE TABLE teacher_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    evaluator_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    -- Evaluation period
    evaluation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    evaluation_type VARCHAR(50) NOT NULL,            -- monthly/quarterly/annual
    period_start DATE,
    period_end DATE,
    -- 5-dimension model (0-100 each)
    knowledge_score INT CHECK (knowledge_score >= 0 AND knowledge_score <= 100),       -- 30%
    teaching_skill_score INT CHECK (teaching_skill_score >= 0 AND teaching_skill_score <= 100), -- 25%
    ethics_score INT CHECK (ethics_score >= 0 AND ethics_score <= 100),                 -- 20%
    classroom_management_score INT CHECK (classroom_management_score >= 0 AND classroom_management_score <= 100), -- 15%
    professional_development_score INT CHECK (professional_development_score >= 0 AND professional_development_score <= 100), -- 10%
    -- Weighted total (calculated)
    total_score DECIMAL(5,2) GENERATED ALWAYS AS (
        (knowledge_score * 0.30) +
        (teaching_skill_score * 0.25) +
        (ethics_score * 0.20) +
        (classroom_management_score * 0.15) +
        (professional_development_score * 0.10)
    ) STORED,
    -- Status
    status evaluation_status DEFAULT 'draft',
    -- Feedback
    strengths TEXT,
    areas_for_improvement TEXT,
    recommendations TEXT,
    action_plan TEXT,
    -- Sign-off
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_eval_teacher ON teacher_evaluations(teacher_id);
CREATE INDEX idx_eval_evaluator ON teacher_evaluations(evaluator_id);
CREATE INDEX idx_eval_date ON teacher_evaluations(evaluation_date);
CREATE INDEX idx_eval_type ON teacher_evaluations(evaluation_type);
CREATE INDEX idx_eval_status ON teacher_evaluations(status);
CREATE INDEX idx_eval_period ON teacher_evaluations(period_start, period_end);

-- =============================================
-- 11. KPI_SNAPSHOTS (شاخص‌های کلیدی عملکرد)
-- =============================================
CREATE TABLE kpi_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
    kpi_category VARCHAR(50) NOT NULL,              -- context/input/process/product
    kpi_code VARCHAR(20) NOT NULL,                  -- CI-01, PR-01, PD-01, etc.
    kpi_name VARCHAR(200) NOT NULL,
    -- Values
    target_value DECIMAL(10,2),
    actual_value DECIMAL(10,2),
    unit VARCHAR(50),                               -- percentage/count/hours
    -- Context
    scope VARCHAR(50),                              -- branch/school/network
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_kpi_branch ON kpi_snapshots(branch_id);
CREATE INDEX idx_kpi_date ON kpi_snapshots(snapshot_date);
CREATE INDEX idx_kpi_category ON kpi_snapshots(kpi_category);
CREATE INDEX idx_kpi_code ON kpi_snapshots(kpi_code);
CREATE INDEX idx_kpi_period ON kpi_snapshots(branch_id, snapshot_date);

-- =============================================
-- 12. BEHAVIORAL_INCIDENTS (رویدادهای رفتاری)
-- =============================================
CREATE TABLE behavioral_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    reported_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    -- Incident details
    incident_date DATE NOT NULL DEFAULT CURRENT_DATE,
    incident_time TIME,
    incident_type VARCHAR(100) NOT NULL,            -- نوع رویداد
    severity VARCHAR(20) DEFAULT 'low',             -- low/medium/high/critical
    -- Description
    description TEXT NOT NULL,
    location VARCHAR(200),                          -- محل وقوع
    witnesses TEXT,
    -- Follow-up
    action_taken TEXT,
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    follow_up_notes TEXT,
    -- Resolution
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_behavior_student ON behavioral_incidents(student_id);
CREATE INDEX idx_behavior_branch ON behavioral_incidents(branch_id);
CREATE INDEX idx_behavior_date ON behavioral_incidents(incident_date);
CREATE INDEX idx_behavior_type ON behavioral_incidents(incident_type);
CREATE INDEX idx_behavior_severity ON behavioral_incidents(severity);
CREATE INDEX idx_behavior_unresolved ON behavioral_incidents(follow_up_required, follow_up_date)
    WHERE resolved = FALSE;

-- =============================================
-- 13. TEACHER_LEAVES (مرخصی مربیان)
-- =============================================
CREATE TABLE teacher_leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE RESTRICT,
    -- Leave details
    leave_type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INT GENERATED ALWAYS AS (
        (end_date - start_date) + 1
    ) STORED,
    reason TEXT,
    -- Coverage
    substitute_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    coverage_notes TEXT,
    -- Approval
    status VARCHAR(20) DEFAULT 'pending',           -- pending/approved/rejected
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_leave_teacher ON teacher_leaves(teacher_id);
CREATE INDEX idx_leave_branch ON teacher_leaves(branch_id);
CREATE INDEX idx_leave_dates ON teacher_leaves(start_date, end_date);
CREATE INDEX idx_leave_status ON teacher_leaves(status);
CREATE INDEX idx_leave_type ON teacher_leaves(leave_type);
CREATE INDEX idx_leave_pending ON teacher_leaves(teacher_id, status)
    WHERE status = 'pending';
