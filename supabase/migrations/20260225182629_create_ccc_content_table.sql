/*
  # Create CCC (Catechism) Content Table

  1. New Tables
    - `ccc_content`
      - `id` (uuid, primary key)
      - `paragraph_number` (integer, unique) - Official CCC paragraph number
      - `content` (text) - The paragraph content
      - `part` (integer) - Part number (1-4)
      - `section` (integer) - Section number
      - `chapter` (integer) - Chapter number
      - `article` (text) - Article title if applicable
      - `tags` (text array) - Related tags for filtering
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `ccc_content` table
    - Add policy for all authenticated users to read content
*/

CREATE TABLE IF NOT EXISTS ccc_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  paragraph_number integer UNIQUE NOT NULL,
  content text NOT NULL,
  part integer NOT NULL,
  section integer,
  chapter integer,
  article text,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ccc_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all CCC content"
  ON ccc_content
  FOR SELECT
  TO authenticated
  USING (true);