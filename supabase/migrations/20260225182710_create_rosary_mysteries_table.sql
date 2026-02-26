/*
  # Create Rosary Mysteries Table

  1. New Tables
    - `rosary_mysteries`
      - `id` (uuid, primary key)
      - `mystery_type` (text) - Joyful, Sorrowful, Glorious, Luminous
      - `name` (text) - Name of the mystery
      - `order` (integer) - Order within the set (1-5)
      - `description` (text) - Description of the mystery
      - `image_url` (text) - URL to mystery artwork
      - `scriptural_references` (text array) - Bible references
      - `recommended_days` (text array) - Days of week (Monday, Tuesday, etc.)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `rosary_mysteries` table
    - Add policy for all authenticated users to read mysteries
*/

CREATE TABLE IF NOT EXISTS rosary_mysteries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mystery_type text NOT NULL,
  name text NOT NULL,
  "order" integer NOT NULL,
  description text,
  image_url text,
  scriptural_references text[] DEFAULT '{}',
  recommended_days text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(mystery_type, "order")
);

ALTER TABLE rosary_mysteries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all rosary mysteries"
  ON rosary_mysteries
  FOR SELECT
  TO authenticated
  USING (true);