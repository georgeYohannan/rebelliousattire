'use client';

import { Card } from '@/components/ui/card';
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

type VerseData = {
  verse_reference: string;
  verse_text: string;
  reflection?: string;
};

export function VerseOfDay() {
  const [verse, setVerse] = useState<VerseData | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchVerse = async () => {
      const { data } = await supabase
        .from('verse_of_day')
        .select('*')
        .eq('date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (data) {
        setVerse(data);
      }
    };

    fetchVerse();
  }, [supabase]);

  if (!verse) return null;

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-navy-600 to-navy-800 p-8 lg:p-12">
      <div className="relative z-10">
        <div className="inline-block px-3 py-1 bg-mustard text-navy text-xs font-semibold rounded-full mb-4">
          VERSE OF THE DAY
        </div>
        <h2 className="text-xl font-semibold text-mustard mb-2">
          {verse.verse_reference}
        </h2>
        <p className="text-2xl lg:text-3xl font-display italic text-white leading-relaxed mb-4">
          &ldquo;{verse.verse_text}&rdquo;
        </p>
        {verse.reflection && (
          <p className="text-sm text-gray-300 italic">
            {verse.reflection}
          </p>
        )}
      </div>
    </Card>
  );
}
