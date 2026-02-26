/*
  # Create Documents Table for Library

  1. New Tables
    - `documents`
      - `id` (uuid, primary key)
      - `title` (text) - Document title
      - `type` (text) - Type: encyclical, letter, teaching, etc.
      - `author` (text) - Author (e.g., Pope name, Saint name)
      - `topic` (text) - Main topic/subject
      - `description` (text) - Short description
      - `content` (text) - Full document text
      - `thumbnail_url` (text) - Thumbnail image
      - `published_date` (date) - Original publication date
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `documents` table
    - Add policy for all authenticated users to read documents
*/

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  type text NOT NULL,
  author text,
  topic text,
  description text,
  content text NOT NULL,
  thumbnail_url text,
  published_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all documents"
  ON documents
  FOR SELECT
  TO authenticated
  USING (true);