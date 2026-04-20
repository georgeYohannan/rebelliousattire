/*
  When no saint matches today's feast, pick one at random for the hero.
  Parameter p_seed is kept for API compatibility with the client RPC call but is unused.
*/

CREATE OR REPLACE FUNCTION featured_saint_for_day(p_seed text)
RETURNS SETOF saints
LANGUAGE sql
VOLATILE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT *
  FROM saints
  ORDER BY random()
  LIMIT 1;
$$;

COMMENT ON FUNCTION featured_saint_for_day(text) IS 'Random featured saint when no feast match; p_seed unused (signature retained for clients)';
