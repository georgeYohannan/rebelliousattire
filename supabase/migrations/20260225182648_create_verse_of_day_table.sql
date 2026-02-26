/*
  # Create Verse of the Day Table

  1. New Tables
    - `verse_of_day`
      - `id` (uuid, primary key)
      - `date` (date, unique) - The date this verse is featured
      - `verse_reference` (text) - Verse reference (e.g., "Jeremiah 29:11")
      - `verse_text` (text) - The verse text
      - `reflection` (text) - Optional short reflection
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `verse_of_day` table
    - Add policy for all authenticated users to read verses
*/

CREATE TABLE IF NOT EXISTS verse_of_day (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date UNIQUE NOT NULL DEFAULT CURRENT_DATE,
  verse_reference text NOT NULL,
  verse_text text NOT NULL,
  reflection text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE verse_of_day ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read verse of the day"
  ON verse_of_day
  FOR SELECT
  TO authenticated
  USING (true);