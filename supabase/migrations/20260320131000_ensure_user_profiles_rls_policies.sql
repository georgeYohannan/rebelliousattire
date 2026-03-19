/*
  # Ensure RLS policies for `yc_user_preferences`

  The app writes/reads `yc_user_preferences.default_rosary_variant_id`.
*/

ALTER TABLE yc_user_preferences ENABLE ROW LEVEL SECURITY;

-- Own-row select
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'yc_user_preferences'
      AND policyname = 'yc_user_preferences_select_own'
  ) THEN
    CREATE POLICY yc_user_preferences_select_own
      ON yc_user_preferences
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Own-row insert
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'yc_user_preferences'
      AND policyname = 'yc_user_preferences_insert_own'
  ) THEN
    CREATE POLICY yc_user_preferences_insert_own
      ON yc_user_preferences
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Own-row update
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'yc_user_preferences'
      AND policyname = 'yc_user_preferences_update_own'
  ) THEN
    CREATE POLICY yc_user_preferences_update_own
      ON yc_user_preferences
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

