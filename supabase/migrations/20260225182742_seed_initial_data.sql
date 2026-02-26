/*
  # Seed Initial Data

  1. Initial Data
    - Add sample prayers
    - Add rosary mysteries
    - Add sample verse of the day

  2. Notes
    - This provides starter content for the application
    - Can be expanded with more content later
*/

-- Insert Morning Offering Prayer
INSERT INTO prayers (title, category, content, is_daily_recommended, "order")
VALUES (
  'Morning Offering',
  'Morning',
  'O Jesus, through the Immaculate Heart of Mary, I offer You my prayers, works, joys, and sufferings of this day for all the intentions of Your Sacred Heart, in union with the Holy Sacrifice of the Mass throughout the world, for the salvation of souls, the reparation of sins, the reunion of all Christians, and in particular for the intentions of the Holy Father this month. Amen.',
  true,
  1
) ON CONFLICT DO NOTHING;

-- Insert Guardian Angel Prayer
INSERT INTO prayers (title, category, content, is_daily_recommended, "order")
VALUES (
  'Guardian Angel Prayer',
  'Devotional',
  'Angel of God, my guardian dear, to whom God''s love commits me here, ever this day be at my side, to light and guard, to rule and guide. Amen.',
  false,
  2
) ON CONFLICT DO NOTHING;

-- Insert Grace Before Meals
INSERT INTO prayers (title, category, content, is_daily_recommended, "order")
VALUES (
  'Grace Before Meals',
  'Mealtime',
  'Bless us, O Lord, and these Thy gifts, which we are about to receive from Thy bounty, through Christ our Lord. Amen.',
  false,
  1
) ON CONFLICT DO NOTHING;

-- Insert Joyful Mysteries
INSERT INTO rosary_mysteries (mystery_type, name, "order", description, scriptural_references, recommended_days)
VALUES 
  ('Joyful', 'The Annunciation', 1, 'The angel Gabriel announces to Mary that she will be the Mother of God.', ARRAY['Luke 1:26-38'], ARRAY['Monday', 'Saturday']),
  ('Joyful', 'The Visitation', 2, 'Mary visits her cousin Elizabeth, who is pregnant with John the Baptist.', ARRAY['Luke 1:39-56'], ARRAY['Monday', 'Saturday']),
  ('Joyful', 'The Nativity', 3, 'Jesus is born in Bethlehem.', ARRAY['Luke 2:1-20'], ARRAY['Monday', 'Saturday']),
  ('Joyful', 'The Presentation', 4, 'Mary and Joseph present Jesus in the Temple.', ARRAY['Luke 2:22-38'], ARRAY['Monday', 'Saturday']),
  ('Joyful', 'The Finding in the Temple', 5, 'Mary and Joseph find Jesus teaching in the Temple.', ARRAY['Luke 2:41-52'], ARRAY['Monday', 'Saturday'])
ON CONFLICT DO NOTHING;

-- Insert Sorrowful Mysteries
INSERT INTO rosary_mysteries (mystery_type, name, "order", description, scriptural_references, recommended_days)
VALUES 
  ('Sorrowful', 'The Agony in the Garden', 1, 'Jesus prays in the Garden of Gethsemane.', ARRAY['Matthew 26:36-46'], ARRAY['Tuesday', 'Friday']),
  ('Sorrowful', 'The Scourging', 2, 'Jesus is scourged at the pillar.', ARRAY['Matthew 27:26'], ARRAY['Tuesday', 'Friday']),
  ('Sorrowful', 'The Crowning with Thorns', 3, 'Jesus is crowned with thorns and mocked.', ARRAY['Matthew 27:27-31'], ARRAY['Tuesday', 'Friday']),
  ('Sorrowful', 'The Carrying of the Cross', 4, 'Jesus carries His cross to Calvary.', ARRAY['John 19:17'], ARRAY['Tuesday', 'Friday']),
  ('Sorrowful', 'The Crucifixion', 5, 'Jesus dies on the cross for our salvation.', ARRAY['John 19:18-30'], ARRAY['Tuesday', 'Friday'])
ON CONFLICT DO NOTHING;

-- Insert Glorious Mysteries
INSERT INTO rosary_mysteries (mystery_type, name, "order", description, scriptural_references, recommended_days)
VALUES 
  ('Glorious', 'The Resurrection', 1, 'Jesus rises from the dead.', ARRAY['Matthew 28:1-10'], ARRAY['Wednesday', 'Sunday']),
  ('Glorious', 'The Ascension', 2, 'Jesus ascends into Heaven.', ARRAY['Acts 1:6-11'], ARRAY['Wednesday', 'Sunday']),
  ('Glorious', 'The Descent of the Holy Spirit', 3, 'The Holy Spirit descends upon the Apostles at Pentecost.', ARRAY['Acts 2:1-4'], ARRAY['Wednesday', 'Sunday']),
  ('Glorious', 'The Assumption', 4, 'Mary is assumed body and soul into Heaven.', ARRAY['Revelation 12:1'], ARRAY['Wednesday', 'Sunday']),
  ('Glorious', 'The Coronation', 5, 'Mary is crowned as Queen of Heaven and Earth.', ARRAY['Revelation 12:1'], ARRAY['Wednesday', 'Sunday'])
ON CONFLICT DO NOTHING;

-- Insert Luminous Mysteries
INSERT INTO rosary_mysteries (mystery_type, name, "order", description, scriptural_references, recommended_days)
VALUES 
  ('Luminous', 'The Baptism of Jesus', 1, 'Jesus is baptized in the Jordan River by John the Baptist.', ARRAY['Matthew 3:13-17'], ARRAY['Thursday']),
  ('Luminous', 'The Wedding at Cana', 2, 'Jesus performs His first miracle at the wedding feast.', ARRAY['John 2:1-11'], ARRAY['Thursday']),
  ('Luminous', 'The Proclamation of the Kingdom', 3, 'Jesus proclaims the Kingdom of God and calls us to conversion.', ARRAY['Mark 1:14-15'], ARRAY['Thursday']),
  ('Luminous', 'The Transfiguration', 4, 'Jesus is transfigured on Mount Tabor.', ARRAY['Matthew 17:1-8'], ARRAY['Thursday']),
  ('Luminous', 'The Institution of the Eucharist', 5, 'Jesus institutes the Eucharist at the Last Supper.', ARRAY['Matthew 26:26-28'], ARRAY['Thursday'])
ON CONFLICT DO NOTHING;

-- Insert Verse of the Day
INSERT INTO verse_of_day (date, verse_reference, verse_text, reflection)
VALUES (
  CURRENT_DATE,
  'Jeremiah 29:11',
  'For I know the plans I have for you, declares the LORD, plans to prosper you and not to harm you, plans to give you hope and a future.',
  'God created us out of free and unselfish love.'
) ON CONFLICT (date) DO NOTHING;