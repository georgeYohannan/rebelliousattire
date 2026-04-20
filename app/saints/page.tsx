'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  fetchAllSaintsForPicker,
  fetchFeaturedSaintForSeed,
  fetchSaintsForFeast,
  type Saint,
  type SaintPick,
} from '@/lib/saints/saints-queries';
import { localCalendarSeedDate } from '@/lib/saints/format';
import { SaintFullProfile } from '@/components/saints/SaintFullProfile';
import { SaintSearchCombobox } from '@/components/saints/SaintSearchCombobox';
import { Card } from '@/components/ui/card';

export default function SaintsPage() {
  const [loading, setLoading] = useState(true);
  const [heroSaints, setHeroSaints] = useState<Saint[]>([]);
  const [heroMode, setHeroMode] = useState<'feast' | 'featured' | 'empty'>('empty');
  const [picker, setPicker] = useState<SaintPick[]>([]);

  const todayLabel = useMemo(() => {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();

        const [feastRows, pickList] = await Promise.all([
          fetchSaintsForFeast(month, day),
          fetchAllSaintsForPicker(),
        ]);

        setPicker(pickList);

        if (feastRows.length > 0) {
          setHeroSaints(feastRows);
          setHeroMode('feast');
        } else {
          const seed = localCalendarSeedDate(now);
          const featured = await fetchFeaturedSaintForSeed(seed);
          if (featured) {
            setHeroSaints([featured]);
            setHeroMode('featured');
          } else {
            setHeroSaints([]);
            setHeroMode('empty');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-brown-dark p-4 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white lg:text-4xl">
            Saints
          </h1>
          <p className="mt-2 text-muted-foreground">{todayLabel}</p>
        </div>

        {!loading && (
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-white">Find a saint</h2>
            <Card className="border-mustard/20 bg-card/60 p-6 backdrop-blur">
              <label className="mb-2 block text-sm font-medium text-white">Search by name</label>
              <p className="mb-3 text-xs text-muted-foreground">
                Type to filter; choose a name to open their full profile.
              </p>
              <SaintSearchCombobox saints={picker} disabled={picker.length === 0} />
            </Card>
          </section>
        )}

        {loading ? (
          <Card className="border-mustard/20 bg-card/60 p-8 backdrop-blur">
            <p className="text-muted-foreground">Loading saints…</p>
          </Card>
        ) : heroMode === 'empty' ? (
          <Card className="border-mustard/20 bg-card/60 p-8 backdrop-blur">
            <p className="text-muted-foreground">
              No saints are in the database yet. Add saints in Supabase (table{' '}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">saints</code>), then reload this page.
            </p>
          </Card>
        ) : (
          <section className="space-y-6">
            <div className="border-b border-mustard/15 pb-4">
              <h2 className="font-display text-xl font-semibold text-white">
                {heroMode === 'feast' ? "Today's feast" : 'Saint of the day'}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {heroMode === 'feast'
                  ? 'Full profile for each saint commemorated on this calendar day.'
                  : `No feast on the calendar for today (${todayLabel})—showing a random spotlight saint.`}
              </p>
            </div>
            <div className="space-y-20">
              {heroSaints.map((saint) => (
                <SaintFullProfile key={saint.id} saint={saint} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
