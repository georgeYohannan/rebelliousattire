/*
  # Add YC Chapters Table

  1. New Tables
    - `yc_chapters`
      - `id` (bigint, primary key, auto-generated)
      - `section_id` (bigint, foreign key to yc_sections)
      - `title` (text, not null)
      - `sort_order` (int, nullable)

  2. Changes
    - Update yc_questions to reference yc_chapters instead of yc_sections
    - Add chapter_id foreign key to yc_questions

  3. Security
    - Enable RLS on yc_chapters
    - Add policy for public read access
*/

-- Create yc_chapters table
CREATE TABLE IF NOT EXISTS yc_chapters (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  section_id bigint REFERENCES yc_sections(id) ON DELETE CASCADE,
  title text NOT NULL,
  sort_order int
);

-- Update yc_questions to add chapter_id reference
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'yc_questions' AND column_name = 'chapter_id'
  ) THEN
    ALTER TABLE yc_questions ADD COLUMN chapter_id bigint REFERENCES yc_chapters(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE yc_chapters ENABLE ROW LEVEL SECURITY;

-- Create policy for reading data
CREATE POLICY "Anyone can view chapters"
  ON yc_chapters FOR SELECT
  USING (true);