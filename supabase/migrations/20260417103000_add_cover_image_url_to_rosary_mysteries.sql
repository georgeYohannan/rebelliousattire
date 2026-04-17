/*
  # Add cover image for rosary mystery types

  Purpose:
    - Keep per-decade artwork in `image_url`
    - Add a separate first-page "face image" in `cover_image_url`
*/

ALTER TABLE rosary_mysteries
ADD COLUMN IF NOT EXISTS cover_image_url text;
