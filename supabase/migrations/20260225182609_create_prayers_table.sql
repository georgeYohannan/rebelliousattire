/*
  # Create Prayers Table

  1. New Tables
    - `prayers`
      - `id` (uuid, primary key)
      - `title` (text) - Prayer title
      - `category` (text) - Category (Morning, Evening, Mealtime, Devotional, etc.)
      - `content` (text) - Full prayer text
      - `season` (text) - Liturgical season if applicable (Advent, Lent, Easter, etc.)
      - `order` (integer) - Display order within category
      - `is_daily_recommended` (boolean) - Whether to show in daily recommendations
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `prayers` table
    - Add policy for all authenticated users to read prayers
*/

CREATE TABLE IF NOT EXISTS prayers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  content text NOT NULL,
  season text,
  "order" integer DEFAULT 0,
  is_daily_recommended boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all prayers"
  ON prayers
  FOR SELECT
  TO authenticated
  USING (true);