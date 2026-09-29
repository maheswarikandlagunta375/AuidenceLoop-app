-- Migration 001_initial_schema.sql
-- Description: Baseline schema for AudienceLoop multi-brand platform
-- Applied: 2026-09-01

-- (See db/schema.sql for the baseline tables)

-- Migration 002_add_feedback_loop_and_pii_guards.sql
-- Description: Adds supporting columns for closed-loop strategy tracking and privacy controls
-- Applied: 2026-09-15

ALTER TABLE community_comments 
ADD COLUMN IF NOT EXISTS pii_flags_detected INT DEFAULT 0;

ALTER TABLE strategy_feedback
ADD COLUMN IF NOT EXISTS confidence_interval_low DECIMAL(6, 3),
ADD COLUMN IF NOT EXISTS confidence_interval_high DECIMAL(6, 3);

-- Migration 003_add_rag_vector_readiness.sql
-- Description: Prepared for pgvector / Azure AI Search semantic index linkage
-- Applied: 2026-09-29

ALTER TABLE posts
ADD COLUMN IF NOT EXISTS embedding_id VARCHAR(128);

ALTER TABLE community_comments
ADD COLUMN IF NOT EXISTS embedding_id VARCHAR(128);
