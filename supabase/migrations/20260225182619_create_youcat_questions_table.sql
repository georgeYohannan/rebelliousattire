/*
  # Create YOUCAT Questions Table

  1. New Tables
    - `youcat_questions`
      - `id` (uuid, primary key)
      - `question_number` (integer, unique) - Official YOUCAT question number
      - `question` (text) - The question text
      - `answer` (text) - The full answer text
      - `category` (text) - Category/topic of the question
      - `tags` (text array) - Related tags for filtering
      - `scriptural_references` (text array) - Bible verse references
      - `ccc_references` (text array) - Catechism references
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `youcat_questions` table
    - Add policy for all authenticated users to read questions
*/

CREATE TABLE IF NOT EXISTS youcat_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_number integer UNIQUE NOT NULL,
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  tags text[] DEFAULT '{}',
  scriptural_references text[] DEFAULT '{}',
  ccc_references text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE youcat_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all YOUCAT questions"
  ON youcat_questions
  FOR SELECT
  TO authenticated
  USING (true);