/*
  # Create yc_user_preferences for rosary defaults

  Isolated per-user preferences for this project only.
*/

CREATE TABLE IF NOT EXISTS yc_user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_rosary_variant_id uuid REFERENCES rosary_variants(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

