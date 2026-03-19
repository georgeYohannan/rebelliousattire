/*
  # Create Rosary Variants Table

  1. New Tables
    - `rosary_variants`
      - `id` (uuid, primary key)
      - `slug` (text, unique)
      - `name` (text)
      - `description` (text)
      - `is_default` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `rosary_variants`
    - Allow authenticated read
*/

CREATE TABLE IF NOT EXISTS rosary_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE rosary_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read rosary variants"
  ON rosary_variants
  FOR SELECT
  TO authenticated
  USING (true);

