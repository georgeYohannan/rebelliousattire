import { createClient } from '@/lib/supabase/client';

export type Saint = {
  id: string;
  slug: string;
  name: string;
  feast_month: number;
  feast_day: number;
  birth_date: string | null;
  death_date: string | null;
  canonization_date: string | null;
  beatification_date: string | null;
  country: string | null;
  short_bio: string | null;
  biography: string | null;
  patron_of: string | null;
  image_url: string | null;
  created_at: string | null;
};

export type SaintPick = Pick<Saint, 'id' | 'slug' | 'name'>;

export async function fetchAllSaintsForPicker(): Promise<SaintPick[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('saints')
    .select('id,slug,name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching saints list:', error);
    return [];
  }

  return (data || []) as SaintPick[];
}

export async function fetchSaintsForFeast(month: number, day: number): Promise<Saint[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('saints')
    .select('*')
    .eq('feast_month', month)
    .eq('feast_day', day);

  if (error) {
    console.error('Error fetching saints by feast:', error);
    return [];
  }

  return (data || []) as Saint[];
}

/** Deterministic featured saint when no feast matches today (same row per seed). */
export async function fetchFeaturedSaintForSeed(seedIsoDate: string): Promise<Saint | null> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc('featured_saint_for_day', {
    p_seed: seedIsoDate,
  });

  if (error) {
    console.error('Error fetching featured saint:', error);
    return null;
  }

  if (data == null) return null;
  if (Array.isArray(data)) return (data[0] as Saint | undefined) ?? null;
  return data as Saint;
}

export async function fetchSaintBySlug(slug: string): Promise<Saint | null> {
  const supabase = createClient();

  const { data, error } = await supabase.from('saints').select('*').eq('slug', slug).maybeSingle();

  if (error) {
    console.error('Error fetching saint by slug:', error);
    return null;
  }

  return (data as Saint) ?? null;
}
