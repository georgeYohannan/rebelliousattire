import { createClient } from '@/lib/supabase/client';

export type Prayer = {
  id: string;
  title: string;
  content: string;
};

export type RosaryMystery = {
  id: string;
  mystery_type: string;
  name: string;
  order: number;
  description: string | null;
  scriptural_references: string[] | null;
  recommended_days: string[] | null;
  /** Public URL (e.g. Supabase Storage) for decade artwork */
  image_url: string | null;
};

export type RosaryVariant = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  is_default: boolean;
};

export type RosaryVariantStep = {
  id: string;
  variant_id: string;
  order: number;
  step_type: 'prayer' | 'decade';
  prayer_id: string | null;
  title_override: string | null;
  mystery_index: number | null;
  hail_mary_target: number | null;
};

export async function fetchPrayersByTitles(titles: string[]): Promise<Prayer[]> {
  const supabase = createClient();

  if (titles.length === 0) return [];

  const { data, error } = await supabase
    .from('prayers')
    .select('id,title,content')
    .in('title', titles);

  if (error) {
    console.error('Error fetching prayers by titles:', error);
    return [];
  }

  return (data || []) as Prayer[];
}

export async function fetchRosaryMysteriesByType(mysteryType: string): Promise<RosaryMystery[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('rosary_mysteries')
    .select('*')
    .eq('mystery_type', mysteryType)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching rosary mysteries by type:', error);
    return [];
  }

  return (data || []) as RosaryMystery[];
}

export async function fetchRosaryVariants(): Promise<RosaryVariant[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('rosary_variants')
    .select('*')
    .order('is_default', { ascending: false })
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching rosary variants:', error);
    return [];
  }

  return (data || []) as RosaryVariant[];
}

export async function fetchRosaryVariantStepsByVariantId(
  variantId: string
): Promise<RosaryVariantStep[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('rosary_variant_steps')
    .select('*')
    .eq('variant_id', variantId)
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching rosary variant steps:', error);
    return [];
  }

  return (data || []) as RosaryVariantStep[];
}

export async function fetchUserDefaultRosaryVariantId(): Promise<string | null> {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error('Error fetching auth user:', (authError as any)?.message ?? authError);
    return null;
  }

  const user = authData?.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from('yc_user_preferences')
    .select('default_rosary_variant_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error(
      'Error fetching user default rosary variant id:',
      (error as any)?.message ?? error,
    );
    return null;
  }

  return (data?.default_rosary_variant_id as string | null) ?? null;
}

export async function setUserDefaultRosaryVariantId(variantId: string | null): Promise<boolean> {
  const supabase = createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) {
    console.error('Error fetching auth user:', (authError as any)?.message ?? authError);
    return false;
  }

  const user = authData?.user;
  if (!user) return false;

  const normalizedVariantId = variantId && variantId.trim() ? variantId : null;
  const { error: upsertError } = await supabase.from('yc_user_preferences').upsert(
    { user_id: user.id, default_rosary_variant_id: normalizedVariantId },
    { onConflict: 'user_id' },
  );

  if (upsertError) {
    console.error(
      'Error setting user default rosary variant id:',
      (upsertError as any)?.message ?? upsertError,
    );
    return false;
  }

  return true;
}

