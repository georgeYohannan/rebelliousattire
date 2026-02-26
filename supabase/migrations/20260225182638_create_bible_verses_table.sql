/*
  # Create Bible Verses Table

  1. New Tables
    - `bible_verses`
      - `id` (uuid, primary key)
      - `book` (text) - Book name
      - `chapter` (integer) - Chapter number
      - `verse` (integer) - Verse number
      - `translation` (text) - Translation version (NIV, NRSV, etc.)
      - `content` (text) - The verse text
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `bible_verses` table
    - Add policy for all authenticated users to read verses
*/

CREATE TABLE IF NOT EXISTS bible_verses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  translation text DEFAULT 'NIV',
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(book, chapter, verse, translation)
);

ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all Bible verses"
  ON bible_verses
  FOR SELECT
  TO authenticated
  USING (true);