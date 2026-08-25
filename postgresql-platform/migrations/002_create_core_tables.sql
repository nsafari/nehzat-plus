-- =============================================
-- Nehzat Digital Platform — PostgreSQL Schema
-- Migration 002: Core Tables (branches, users)
-- =============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search

-- =============================================
-- 1. BRANCHES (شعب) - ltree hierarchy
-- =============================================
CREATE TABLE branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,                    -- نام شعبه
    name_fa VARCHAR(200) NOT NULL,                  -- نام فارسی
    branch_code VARCHAR(50) UNIQUE NOT NULL,        -- کد شعبه
    parent_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    path LTREE NOT NULL,                           -- مسیر سلسله‌مراتبی
    address TEXT,
    phone VARCHAR(20),
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(100) DEFAULT 'ایران',
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',                    -- اطلاعات تکمیلی
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ                         -- Soft delete
);

CREATE INDEX idx_branches_path ON branches USING GIST(path);
CREATE INDEX idx_branches_parent ON branches(parent_id);
CREATE INDEX idx_branches_active ON branches(is_active) WHERE deleted_at IS NULL;

-- =============================================
-- 2. USERS (کاربران)
-- =============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(200),
    phone VARCHAR(20),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(200),
    role user_role NOT NULL,
    branch_id UUID REFERENCES branches(id) ON DELETE SET NULL,
    oidc_subject VARCHAR(200),                      -- OTUH2 subject
    approval_status VARCHAR(20) DEFAULT 'pending',  -- approved/pending/rejected
    is_active BOOLEAN DEFAULT TRUE,
    avatar_url TEXT,
    language VARCHAR(10) DEFAULT 'fa',              -- fa/en/ar
    metadata JSONB DEFAULT '{}',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_branch ON users(branch_id);
CREATE INDEX idx_users_oidc ON users(oidc_subject);
CREATE INDEX idx_users_search ON users USING GIN(
    to_tsvector('simple', COALESCE(username, '') || ' ' || COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''))
);
