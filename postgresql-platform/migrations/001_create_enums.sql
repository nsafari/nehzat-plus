-- =============================================
-- Nehzat Digital Platform — PostgreSQL Schema
-- Migration 001: Enum Types
-- =============================================

-- User roles
CREATE TYPE user_role AS ENUM (
    'admin',
    'manager',
    'teacher',
    'student',
    'parent',
    'branch_manager',
    'evaluator',
    'headquarters'
);

-- Circle levels (حلقه‌ها)
CREATE TYPE circle_level AS ENUM (
    'circle_1',   -- مکتب حضرت علی اصغر (ع) / رقیه (س) - 5yo
    'circle_2',   -- مکتب حضرت علی اصغر (ع) / رقیه (س) - 6yo
    'circle_3',   -- مکتب حضرت قاسم (ع) / سکینه (س) - 7yo
    'circle_4',   -- 8yo
    'circle_5',   -- 9yo
    'circle_6',   -- 10yo
    'circle_7',   -- 11yo
    'circle_8',   -- 12yo
    'circle_9'    -- 13yo
);

-- School types (مکاتب ۴گانه)
CREATE TYPE school_type AS ENUM (
    'ali_asgar',      -- مکتب حضرت علی اصغر (ع) - Boys 5-6
    'ragheye',        -- مکتب حضرت رقیه (س) - Girls 5-6
    'ghasem',         -- مکتب حضرت قاسم (ع) - Boys 7-13
    'sakineh'         -- مکتب حضرت سکینه (س) - Girls 7-13
);

-- Skill levels
CREATE TYPE skill_level AS ENUM (
    'beginner',       -- مبتدی
    'intermediate',   -- متوسط
    'advanced',       -- پیشرفته
    'specialized'     -- تخصصی
);

-- Gender
CREATE TYPE gender AS ENUM (
    'male',
    'female'
);

-- Session status
CREATE TYPE session_status AS ENUM (
    'planned',
    'in_progress',
    'completed',
    'cancelled'
);

-- Evaluation status
CREATE TYPE evaluation_status AS ENUM (
    'draft',
    'submitted',
    'reviewed',
    'approved'
);

-- Leave type for teachers
CREATE TYPE leave_type AS ENUM (
    'sick',
    'personal',
    'official',
    'emergency'
);

-- =============================================
-- Helper function for updated_at trigger
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
