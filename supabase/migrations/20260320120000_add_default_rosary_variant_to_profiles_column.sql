/*
  # Ensure `yc_user_preferences` exists

  The app stores rosary defaults in this isolated preferences table.
*/

CREATE TABLE IF NOT EXISTS yc_user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  default_rosary_variant_id uuid REFERENCES rosary_variants(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

