/*
  # Saints table

  Stores Catholic saint profiles for feast-day hero and browse/detail pages.

  Security: RLS SELECT for authenticated users (aligned with rosary_mysteries).
*/

CREATE TABLE IF NOT EXISTS saints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  name text NOT NULL,
  feast_month integer NOT NULL CHECK (feast_month BETWEEN 1 AND 12),
  feast_day integer NOT NULL CHECK (feast_day BETWEEN 1 AND 31),
  birth_date date,
  death_date date,
  canonization_date date,
  beatification_date date,
  country text,
  short_bio text,
  biography text,
  patron_of text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT saints_slug_unique UNIQUE (slug)
);

CREATE INDEX IF NOT EXISTS saints_feast_month_day_idx ON saints (feast_month, feast_day);

ALTER TABLE saints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read saints"
  ON saints
  FOR SELECT
  TO authenticated
  USING (true);

COMMENT ON TABLE saints IS 'Saint profiles with recurring feast date (month/day)';

/*
  Stable “one saint per calendar day” when no feast matches today’s date.
  Pass ISO date string e.g. 2026-04-17 so all clients resolve the same row for that day.
*/
CREATE OR REPLACE FUNCTION featured_saint_for_day(p_seed text)
RETURNS SETOF saints
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT *
  FROM saints
  ORDER BY md5(id::text || '|' || p_seed)
  LIMIT 1;
$$;

COMMENT ON FUNCTION featured_saint_for_day(text) IS 'Deterministic featured saint using seed (e.g. local calendar date ISO string)';

GRANT EXECUTE ON FUNCTION featured_saint_for_day(text) TO authenticated;
