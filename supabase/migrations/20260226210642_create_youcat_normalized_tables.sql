/*
  # Create YOUCAT Normalized Database Structure

  1. New Tables
    - `youcat_parts`
      - `id` (uuid, primary key)
      - `number` (integer, unique)
      - `title` (text)
      - `description` (text, nullable)
      - `order_index` (integer)
      - `created_at` (timestamptz)
      
    - `youcat_sections`
      - `id` (uuid, primary key)
      - `part_id` (uuid, foreign key to youcat_parts)
      - `number` (integer)
      - `title` (text)
      - `description` (text, nullable)
      - `order_index` (integer)
      - `created_at` (timestamptz)
      
    - `youcat_chapters`
      - `id` (uuid, primary key)
      - `section_id` (uuid, foreign key to youcat_sections)
      - `number` (integer)
      - `title` (text)
      - `description` (text, nullable)
      - `order_index` (integer)
      - `created_at` (timestamptz)
      
    - `youcat_supplementary`
      - `id` (uuid, primary key)
      - `question_id` (uuid, foreign key to youcat_questions)
      - `type` (text) - quote, definition, sidebar, etc.
      - `content` (text)
      - `order_index` (integer)
      - `created_at` (timestamptz)

  2. Schema Changes
    - Add `chapter_id` column to existing `youcat_questions` table
    - Rename `question_number` to `q_number` in `youcat_questions`
    - Rename `question` to `question_text` in `youcat_questions`
    - Rename `answer` to `answer_text` in `youcat_questions`
    - Add `order_index` column to `youcat_questions`
    - Rename `ccc_references` to `ccc_refs` in `youcat_questions`
    - Rename `scriptural_references` to `bible_refs` in `youcat_questions`

  3. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to read all YOUCAT content

  4. Indexes
    - Add indexes on foreign keys and order_index columns for performance
*/

-- Create youcat_parts table
CREATE TABLE IF NOT EXISTS youcat_parts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  number integer UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create youcat_sections table
CREATE TABLE IF NOT EXISTS youcat_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  part_id uuid NOT NULL REFERENCES youcat_parts(id) ON DELETE CASCADE,
  number integer NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create youcat_chapters table
CREATE TABLE IF NOT EXISTS youcat_chapters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid NOT NULL REFERENCES youcat_sections(id) ON DELETE CASCADE,
  number integer NOT NULL,
  title text NOT NULL,
  description text,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add chapter_id to youcat_questions if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'youcat_questions' AND column_name = 'chapter_id'
  ) THEN
    ALTER TABLE youcat_questions ADD COLUMN chapter_id uuid REFERENCES youcat_chapters(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add order_index to youcat_questions if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'youcat_questions' AND column_name = 'order_index'
  ) THEN
    ALTER TABLE youcat_questions ADD COLUMN order_index integer DEFAULT 0;
  END IF;
END $$;

-- Rename columns in youcat_questions if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'youcat_questions' AND column_name = 'question_number'
  ) THEN
    ALTER TABLE youcat_questions RENAME COLUMN question_number TO q_number;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'youcat_questions' AND column_name = 'question'
  ) THEN
    ALTER TABLE youcat_questions RENAME COLUMN question TO question_text;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'youcat_questions' AND column_name = 'answer'
  ) THEN
    ALTER TABLE youcat_questions RENAME COLUMN answer TO answer_text;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'youcat_questions' AND column_name = 'ccc_references'
  ) THEN
    ALTER TABLE youcat_questions RENAME COLUMN ccc_references TO ccc_refs;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'youcat_questions' AND column_name = 'scriptural_references'
  ) THEN
    ALTER TABLE youcat_questions RENAME COLUMN scriptural_references TO bible_refs;
  END IF;
END $$;

-- Create youcat_supplementary table
CREATE TABLE IF NOT EXISTS youcat_supplementary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES youcat_questions(id) ON DELETE CASCADE,
  type text NOT NULL,
  content text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_youcat_sections_part_id ON youcat_sections(part_id);
CREATE INDEX IF NOT EXISTS idx_youcat_sections_order ON youcat_sections(order_index);
CREATE INDEX IF NOT EXISTS idx_youcat_chapters_section_id ON youcat_chapters(section_id);
CREATE INDEX IF NOT EXISTS idx_youcat_chapters_order ON youcat_chapters(order_index);
CREATE INDEX IF NOT EXISTS idx_youcat_questions_chapter_id ON youcat_questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_youcat_questions_order ON youcat_questions(order_index);
CREATE INDEX IF NOT EXISTS idx_youcat_supplementary_question_id ON youcat_supplementary(question_id);
CREATE INDEX IF NOT EXISTS idx_youcat_supplementary_order ON youcat_supplementary(order_index);

-- Enable RLS
ALTER TABLE youcat_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE youcat_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE youcat_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE youcat_supplementary ENABLE ROW LEVEL SECURITY;

-- Create policies for read access
CREATE POLICY "Anyone can read YOUCAT parts"
  ON youcat_parts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read YOUCAT sections"
  ON youcat_sections FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read YOUCAT chapters"
  ON youcat_chapters FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can read YOUCAT supplementary"
  ON youcat_supplementary FOR SELECT
  TO authenticated
  USING (true);