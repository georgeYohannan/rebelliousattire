/*
  # Seed Rosary Variants and Steps

  Seeds two variants:
  - standard (default)
  - standard_plus_st_joseph

  Steps include:
  - Prayer steps referencing `prayers` rows by title
  - Decade steps (mystery_index 0..4) for the stepper decade counter UX

  Note: Prayer steps are inserted only when matching prayers exist.
*/

-- 1) Variants
INSERT INTO rosary_variants (slug, name, description, is_default)
VALUES
  ('standard', 'Standard Rosary', 'Standard prelude, 5 decades, and closing prayers.', true),
  ('standard_plus_st_joseph', 'Standard + St. Joseph', 'Standard Rosary with Prayer to St. Joseph after Hail Holy Queen.', false)
ON CONFLICT (slug) DO NOTHING;

-- 2) Helper CTEs
WITH v AS (
  SELECT id, slug
  FROM rosary_variants
  WHERE slug IN ('standard', 'standard_plus_st_joseph')
),
p AS (
  SELECT id, title
  FROM prayers
  WHERE title IN (
    'Sign of the Cross',
    'Angelus',
    'Apostles'' Creed',
    'Hail Holy Queen',
    'Prayer to St. Joseph'
  )
),
standard_variant AS (
  SELECT id AS variant_id FROM v WHERE slug = 'standard'
),
stj_variant AS (
  SELECT id AS variant_id FROM v WHERE slug = 'standard_plus_st_joseph'
),
-- Prayer step candidates (only inserted if the prayer exists)
standard_prayer_steps AS (
  SELECT
    (SELECT variant_id FROM standard_variant) AS variant_id,
    s."order",
    s.title
  FROM (
    VALUES
      (1, 'Sign of the Cross'),
      (2, 'Angelus'),
      (3, 'Apostles'' Creed'),
      (9, 'Hail Holy Queen')
  ) AS s("order", title)
),
stj_prayer_steps AS (
  SELECT
    (SELECT variant_id FROM stj_variant) AS variant_id,
    s."order",
    s.title
  FROM (
    VALUES
      (1, 'Sign of the Cross'),
      (2, 'Angelus'),
      (3, 'Apostles'' Creed'),
      (9, 'Hail Holy Queen'),
      (10, 'Prayer to St. Joseph')
  ) AS s("order", title)
),
decade_steps AS (
  SELECT * FROM (
    VALUES
      (4, 0),
      (5, 1),
      (6, 2),
      (7, 3),
      (8, 4)
  ) AS d("order", mystery_index)
)
-- Insert prayer steps for standard
INSERT INTO rosary_variant_steps (variant_id, "order", step_type, prayer_id, title_override)
SELECT
  s.variant_id,
  s."order",
  'prayer',
  p.id,
  NULL
FROM standard_prayer_steps s
JOIN p ON p.title = s.title
ON CONFLICT DO NOTHING;

-- Insert decade steps for standard
INSERT INTO rosary_variant_steps (variant_id, "order", step_type, mystery_index, hail_mary_target)
SELECT
  (SELECT variant_id FROM standard_variant),
  d."order",
  'decade',
  d.mystery_index,
  10
FROM decade_steps d
ON CONFLICT DO NOTHING;

-- Insert prayer steps for standard_plus_st_joseph
INSERT INTO rosary_variant_steps (variant_id, "order", step_type, prayer_id, title_override)
SELECT
  s.variant_id,
  s."order",
  'prayer',
  p.id,
  NULL
FROM stj_prayer_steps s
JOIN p ON p.title = s.title
ON CONFLICT DO NOTHING;

-- Insert decade steps for standard_plus_st_joseph
INSERT INTO rosary_variant_steps (variant_id, "order", step_type, mystery_index, hail_mary_target)
SELECT
  (SELECT variant_id FROM stj_variant),
  d."order",
  'decade',
  d.mystery_index,
  10
FROM decade_steps d
ON CONFLICT DO NOTHING;

