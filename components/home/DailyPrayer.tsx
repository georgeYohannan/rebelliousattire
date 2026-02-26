'use client';

import { BookHeart } from 'lucide-react';
import { TodayCard } from './TodayCard';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

type PrayerData = {
  id: string;
  title: string;
  content: string;
};

export function DailyPrayer() {
  const [prayer, setPrayer] = useState<PrayerData | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchPrayer = async () => {
      const { data } = await supabase
        .from('prayers')
        .select('*')
        .eq('is_daily_recommended', true)
        .maybeSingle();

      if (data) {
        setPrayer(data);
      }
    };

    fetchPrayer();
  }, [supabase]);

  if (!prayer) return null;

  return (
    <TodayCard title="Daily Prayer" icon={<BookHeart className="h-5 w-5" />}>
      <h3 className="text-xl font-display mb-3">{prayer.title}</h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {prayer.content.substring(0, 150)}...
      </p>
      <Link href={`/pray/${prayer.id}`}>
        <Button variant="outline" className="w-full border-mustard text-mustard hover:bg-mustard hover:text-navy">
          Read Full Prayer
        </Button>
      </Link>
    </TodayCard>
  );
}
