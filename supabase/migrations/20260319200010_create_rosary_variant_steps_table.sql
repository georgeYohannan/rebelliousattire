/*
  # Create Rosary Variant Steps Table

  1. New Tables
    - `rosary_variant_steps`
      - `id` (uuid, primary key)
      - `variant_id` (uuid, references rosary_variants.id)
      - `order` (integer) - step order within the variant
      - `step_type` (text) - 'prayer' or 'decade'
      - `prayer_id` (uuid, nullable) - required when step_type='prayer'
      - `title_override` (text, nullable)
      - `mystery_index` (integer, nullable) - 0..4 required when step_type='decade'
      - `hail_mary_target` (integer, default 10) - for decade counter
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `rosary_variant_steps`
    - Allow authenticated read
*/

CREATE TABLE IF NOT EXISTS rosary_variant_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id uuid NOT NULL REFERENCES rosary_variants(id) ON DELETE CASCADE,
  "order" integer NOT NULL,
  step_type text NOT NULL,
  prayer_id uuid REFERENCES prayers(id) ON DELETE SET NULL,
  title_override text,
  mystery_index integer,
  hail_mary_target integer DEFAULT 10,
  created_at timestamptz DEFAULT now(),
  UNIQUE(variant_id, "order"),
  CONSTRAINT rosary_variant_steps_step_type_check CHECK (step_type IN ('prayer', 'decade')),
  CONSTRAINT rosary_variant_steps_prayer_required CHECK (
    (step_type <> 'prayer') OR (prayer_id IS NOT NULL)
  ),
  CONSTRAINT rosary_variant_steps_decade_required CHECK (
    (step_type <> 'decade') OR (mystery_index IS NOT NULL AND mystery_index >= 0 AND mystery_index <= 4)
  )
);

ALTER TABLE rosary_variant_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read rosary variant steps"
  ON rosary_variant_steps
  FOR SELECT
  TO authenticated
  USING (true);

