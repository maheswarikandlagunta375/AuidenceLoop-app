-- AudienceLoop Database Schema (Azure SQL Database & PostgreSQL Compatible)
-- Designed for enterprise brand isolation, high-throughput social post metrics,
-- and low-latency retrieval for RAG agents.

-- Table 1: Brand Workspaces
CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(500),
    industry VARCHAR(128) NOT NULL,
    tone TEXT NOT NULL,
    target_audience TEXT NOT NULL,
    default_platforms TEXT NOT NULL, -- JSON array of strings
    key_goals TEXT NOT NULL,         -- JSON array of strings
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table 2: Social Media Posts & Engagement Metrics
CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(64) PRIMARY KEY,
    brand_id VARCHAR(64) NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    platform VARCHAR(32) NOT NULL,    -- linkedin, twitter, instagram, threads
    content TEXT NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE NOT NULL,
    day_of_week VARCHAR(16) NOT NULL,
    hour_of_day INT NOT NULL CHECK (hour_of_day >= 0 AND hour_of_day <= 23),
    topic VARCHAR(128) NOT NULL,
    format VARCHAR(32) NOT NULL,      -- carousel, infographic, text, short_video, poll
    impressions INT NOT NULL DEFAULT 0,
    reactions INT NOT NULL DEFAULT 0,
    comments_count INT NOT NULL DEFAULT 0,
    shares INT NOT NULL DEFAULT 0,
    engagement_rate DECIMAL(6, 3) NOT NULL, -- ((reactions + comments + shares) / impressions) * 100
    sentiment_score DECIMAL(4, 3) DEFAULT 0.0,
    sentiment_label VARCHAR(16) DEFAULT 'neutral',
    tags TEXT,                        -- JSON array of strings
    source VARCHAR(32) DEFAULT 'csv_import',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Critical Index for Multi-Tenant Brand Isolation and Analytical Aggregation
CREATE INDEX IF NOT EXISTS idx_posts_brand_published ON posts(brand_id, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_brand_topic ON posts(brand_id, topic);
CREATE INDEX IF NOT EXISTS idx_posts_brand_format ON posts(brand_id, format);
CREATE INDEX IF NOT EXISTS idx_posts_brand_timing ON posts(brand_id, day_of_week, hour_of_day);

-- Table 3: Community Conversation Memory & Sentiment Tracking
CREATE TABLE IF NOT EXISTS community_comments (
    id VARCHAR(64) PRIMARY KEY,
    brand_id VARCHAR(64) NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    post_id VARCHAR(64) REFERENCES posts(id) ON DELETE SET NULL,
    post_excerpt VARCHAR(255),
    author_masked VARCHAR(128) NOT NULL, -- PII-masked user handle
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    content_sanitized TEXT NOT NULL,     -- Masked of emails/phones & prompt-injection sanitized
    sentiment VARCHAR(16) NOT NULL,      -- positive, neutral, negative
    sentiment_score DECIMAL(4, 3) NOT NULL,
    topic VARCHAR(128) NOT NULL,
    theme VARCHAR(32) NOT NULL,          -- feature_request, question, concern, praise, complaint, general
    is_addressed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comments_brand_timestamp ON community_comments(brand_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_comments_brand_sentiment ON community_comments(brand_id, sentiment);
CREATE INDEX IF NOT EXISTS idx_comments_brand_theme ON community_comments(brand_id, theme);

-- Table 4: Editorial Content Calendar
CREATE TABLE IF NOT EXISTS calendar_posts (
    id VARCHAR(64) PRIMARY KEY,
    brand_id VARCHAR(64) NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    platform VARCHAR(32) NOT NULL,
    format VARCHAR(32) NOT NULL,
    topic VARCHAR(128) NOT NULL,
    scheduled_date DATE NOT NULL,
    scheduled_time VARCHAR(8) NOT NULL,  -- HH:mm
    status VARCHAR(32) NOT NULL DEFAULT 'draft', -- draft, approved, scheduled, published
    goal VARCHAR(128) NOT NULL,
    evidence_rationale TEXT,
    supporting_post_ids TEXT,            -- JSON array of post IDs
    estimated_engagement_rate DECIMAL(6, 3),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_calendar_brand_date ON calendar_posts(brand_id, scheduled_date);

-- Table 5: Strategy Recommendation Feedback Loop
CREATE TABLE IF NOT EXISTS strategy_feedback (
    id VARCHAR(64) PRIMARY KEY,
    brand_id VARCHAR(64) NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    recommendation_date DATE NOT NULL,
    recommendation_summary TEXT NOT NULL,
    target_topic VARCHAR(128) NOT NULL,
    target_format VARCHAR(32) NOT NULL,
    recommended_day VARCHAR(16) NOT NULL,
    recommended_hour INT NOT NULL,
    baseline_engagement_rate DECIMAL(6, 3) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active', -- active, validated, refuted, inconclusive
    outcome_summary TEXT,
    later_posts_analyzed INT DEFAULT 0,
    actual_engagement_rate DECIMAL(6, 3) DEFAULT 0,
    evidence_delta DECIMAL(6, 3) DEFAULT 0,
    supporting_post_ids TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_feedback_brand ON strategy_feedback(brand_id, recommendation_date DESC);
