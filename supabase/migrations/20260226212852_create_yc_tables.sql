/*
  # Create YC Tables

  1. Extensions
    - Enable vector extension for embeddings

  2. New Tables
    - `yc_parts`
      - `id` (bigint, primary key, auto-generated)
      - `part_number` (int, not null)
      - `title` (text, not null)
    
    - `yc_sections`
      - `id` (bigint, primary key, auto-generated)
      - `part_id` (bigint, foreign key to yc_parts)
      - `title` (text, not null)
      - `sort_order` (int, nullable)
    
    - `yc_questions`
      - `id` (bigint, primary key, auto-generated)
      - `section_id` (bigint, foreign key to yc_sections)
      - `question_number` (int, unique, not null)
      - `question_text` (text, not null)
      - `answer_text` (text, not null)
      - `commentary` (text, nullable)
      - `ccc_reference` (text, nullable)
      - `embedding` (vector(1536), nullable)
    
    - `yc_supplementary_elements`
      - `id` (bigint, primary key, auto-generated)
      - `question_id` (bigint, foreign key to yc_questions)
      - `element_type` (text, must be 'scripture', 'quote', or 'definition')
      - `content` (text, not null)
      - `source_author` (text, nullable)
      - `icon_identifier` (text, nullable)

  3. Security
    - Enable RLS on all tables
    - Add policies for public read access (learning content)
*/

-- Enable vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create yc_parts table
CREATE TABLE IF NOT EXISTS yc_parts (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  part_number int NOT NULL,
  title text NOT NULL
);

-- Create yc_sections table
CREATE TABLE IF NOT EXISTS yc_sections (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  part_id bigint REFERENCES yc_parts(id) ON DELETE CASCADE,
  title text NOT NULL,
  sort_order int
);

-- Create yc_questions table
CREATE TABLE IF NOT EXISTS yc_questions (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  section_id bigint REFERENCES yc_sections(id) ON DELETE CASCADE,
  question_number int UNIQUE NOT NULL,
  question_text text NOT NULL,
  answer_text text NOT NULL,
  commentary text,
  ccc_reference text,
  embedding vector(1536)
);

-- Create yc_supplementary_elements table
CREATE TABLE IF NOT EXISTS yc_supplementary_elements (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  question_id bigint REFERENCES yc_questions(id) ON DELETE CASCADE,
  element_type text CHECK (element_type IN ('scripture', 'quote', 'definition')),
  content text NOT NULL,
  source_author text,
  icon_identifier text
);

-- Enable RLS
ALTER TABLE yc_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE yc_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE yc_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE yc_supplementary_elements ENABLE ROW LEVEL SECURITY;

-- Create policies for reading data (public access for learning content)
CREATE POLICY "Anyone can view parts"
  ON yc_parts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view sections"
  ON yc_sections FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view questions"
  ON yc_questions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view supplementary elements"
  ON yc_supplementary_elements FOR SELECT
  USING (true);