/*
  # Create User Profiles Table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text) - User's display name
      - `role_title` (text) - e.g., "Faith Warrior", "Prayer Warrior"
      - `avatar_url` (text) - URL to user's avatar image
      - `streak_count` (integer) - Current daily streak
      - `streak_last_updated` (date) - Last date streak was updated
      - `created_at` (timestamptz) - Account creation timestamp
      - `updated_at` (timestamptz) - Last profile update timestamp

  2. Security
    - Enable RLS on `profiles` table
    - Add policy for users to read their own profile
    - Add policy for users to update their own profile
    - Add policy for authenticated users to view other profiles (for community features)
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role_title text DEFAULT 'Faith Warrior',
  avatar_url text,
  streak_count integer DEFAULT 0,
  streak_last_updated date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Authenticated users can view other profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);