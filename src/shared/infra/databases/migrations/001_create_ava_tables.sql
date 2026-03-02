-- =========================================================
-- AVA (Ambiente Virtual de Aprendizagem) — Full Schema
-- Migration: 001_create_ava_tables
-- =========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- ENUM: Section Types
-- --------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE section_type AS ENUM (
    'TEXT',
    'VIDEO',
    'FILE',
    'SLIDES',
    'STORYTELLING',
    'CASE_STUDY',
    'QUIZ',
    'MINDMAP',
    'FINAL_MESSAGE',
    'DASHBOARD'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------
-- ENUM: Course Status
-- --------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE course_status AS ENUM (
    'draft',
    'published',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- --------------------------------------------------------
-- ENUM: File Provider
-- --------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE file_provider AS ENUM (
    'local',
    's3',
    'drive',
    'onedrive',
    'external'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- =========================================================
-- TABLE: courses
-- =========================================================
CREATE TABLE IF NOT EXISTS courses (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title             VARCHAR(255)  NOT NULL,
  description       TEXT,
  cover_image_url   VARCHAR(512),
  status            course_status NOT NULL DEFAULT 'draft',
  version           INTEGER       NOT NULL DEFAULT 1,
  created_by        VARCHAR(255),                 -- user id from MongoDB (string ref)
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- =========================================================
-- TABLE: modules
-- =========================================================
CREATE TABLE IF NOT EXISTS modules (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id   UUID         NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_modules_course_id ON modules(course_id);

-- =========================================================
-- TABLE: pages
-- =========================================================
CREATE TABLE IF NOT EXISTS pages (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id    UUID         NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  slug         VARCHAR(300),
  order_index  INTEGER      NOT NULL DEFAULT 0,
  is_published BOOLEAN      NOT NULL DEFAULT FALSE,
  version      INTEGER      NOT NULL DEFAULT 1,
  is_active    BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pages_module_id ON pages(module_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_slug_unique ON pages(module_id, slug)
  WHERE slug IS NOT NULL;

-- =========================================================
-- TABLE: sections
-- =========================================================
CREATE TABLE IF NOT EXISTS sections (
  id           UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id      UUID         NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  type         section_type NOT NULL,
  title        VARCHAR(255) NOT NULL,
  order_index  INTEGER      NOT NULL DEFAULT 0,
  config       JSONB        NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sections_page_id ON sections(page_id);
CREATE INDEX IF NOT EXISTS idx_sections_type    ON sections(type);

-- =========================================================
-- TABLE: section_contents
-- Stores the actual content of each section (one per section)
-- content JSONB shape varies per section type:
--   TEXT         → { "html": "...", "markdown": "..." }
--   VIDEO        → { "url": "...", "title": "..." }
--   FILE/SLIDES  → { "file_url": "...", "file_name": "...", "provider": "...", "mime_type": "..." }
--   STORYTELLING → { "file_url": "...", "file_name": "..." }
--   CASE_STUDY   → { "text": "...", "attachments": [] }
--   QUIZ         → { "quiz_id": "..." }             (quiz referenced by id)
--   MINDMAP      → { "file_url": "...", "image_url": "..." }
--   FINAL_MESSAGE→ { "html": "...", "cta_label": "...", "cta_url": "..." }
--   DASHBOARD    → { "metrics": [] }
-- =========================================================
CREATE TABLE IF NOT EXISTS section_contents (
  id         UUID    PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID    NOT NULL UNIQUE REFERENCES sections(id) ON DELETE CASCADE,
  content    JSONB   NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- TABLE: quizzes
-- =========================================================
CREATE TABLE IF NOT EXISTS quizzes (
  id                  UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  title               VARCHAR(255) NOT NULL,
  description         TEXT,
  randomize_questions BOOLEAN      NOT NULL DEFAULT TRUE,
  questions_to_show   INTEGER      NOT NULL DEFAULT 10,
  passing_score       NUMERIC(5,2) NOT NULL DEFAULT 60.00,  -- percentage
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- =========================================================
-- TABLE: quiz_questions
-- =========================================================
CREATE TABLE IF NOT EXISTS quiz_questions (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id     UUID         NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  statement   TEXT         NOT NULL,
  axis        VARCHAR(255),               -- eixo temático
  weight      NUMERIC(4,2) NOT NULL DEFAULT 1.00,
  order_index INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_axis    ON quiz_questions(axis);

-- =========================================================
-- TABLE: quiz_options
-- =========================================================
CREATE TABLE IF NOT EXISTS quiz_options (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID         NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  text        TEXT         NOT NULL,
  is_correct  BOOLEAN      NOT NULL DEFAULT FALSE,
  order_index INTEGER      NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id ON quiz_options(question_id);

-- =========================================================
-- TABLE: user_course_progress
-- =========================================================
CREATE TABLE IF NOT EXISTS user_course_progress (
  id                   UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              VARCHAR(255) NOT NULL,        -- MongoDB ObjectId string
  course_id            UUID         NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  completion_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  total_time_seconds   INTEGER      NOT NULL DEFAULT 0,
  final_score          NUMERIC(5,2),
  completed_at         TIMESTAMPTZ,
  last_access          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_ucp_user_id   ON user_course_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ucp_course_id ON user_course_progress(course_id);

-- =========================================================
-- TABLE: user_page_progress
-- =========================================================
CREATE TABLE IF NOT EXISTS user_page_progress (
  id                UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           VARCHAR(255) NOT NULL,
  page_id           UUID         NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  completed         BOOLEAN      NOT NULL DEFAULT FALSE,
  time_spent_seconds INTEGER     NOT NULL DEFAULT 0,
  last_access       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, page_id)
);

CREATE INDEX IF NOT EXISTS idx_upp_user_id ON user_page_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_upp_page_id ON user_page_progress(page_id);

-- =========================================================
-- TABLE: user_answers
-- =========================================================
CREATE TABLE IF NOT EXISTS user_answers (
  id                 UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            VARCHAR(255) NOT NULL,
  quiz_id            UUID         NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_id        UUID         NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  selected_option_id UUID         REFERENCES quiz_options(id) ON DELETE SET NULL,
  is_correct         BOOLEAN      NOT NULL DEFAULT FALSE,
  answered_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, quiz_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_ua_user_id    ON user_answers(user_id);
CREATE INDEX IF NOT EXISTS idx_ua_quiz_id    ON user_answers(quiz_id);
CREATE INDEX IF NOT EXISTS idx_ua_question_id ON user_answers(question_id);

-- =========================================================
-- TABLE: file_uploads  (tracks all uploaded files)
-- =========================================================
CREATE TABLE IF NOT EXISTS file_uploads (
  id          UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_url    VARCHAR(1024) NOT NULL,
  file_name   VARCHAR(512)  NOT NULL,
  original_name VARCHAR(512),
  mime_type   VARCHAR(128),
  size_bytes  INTEGER,
  provider    file_provider NOT NULL DEFAULT 'local',
  uploaded_by VARCHAR(255),           -- MongoDB user id
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- =========================================================
-- FUNCTION: auto-update updated_at columns
-- =========================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$ BEGIN
  CREATE TRIGGER trg_courses_updated_at         BEFORE UPDATE ON courses         FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER trg_modules_updated_at         BEFORE UPDATE ON modules         FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER trg_pages_updated_at           BEFORE UPDATE ON pages           FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER trg_sections_updated_at        BEFORE UPDATE ON sections        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER trg_section_contents_updated_at BEFORE UPDATE ON section_contents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER trg_quizzes_updated_at         BEFORE UPDATE ON quizzes         FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER trg_quiz_questions_updated_at  BEFORE UPDATE ON quiz_questions  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER trg_ucp_updated_at             BEFORE UPDATE ON user_course_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  CREATE TRIGGER trg_upp_updated_at             BEFORE UPDATE ON user_page_progress   FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null;
END $$;
