'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';

type Prayer = {
  id: string;
  title: string;
  category: string;
  content: string;
};

export default function PrayerPage() {
  const params = useParams();
  const router = useRouter();
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [completed, setCompleted] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchPrayer = async () => {
      const { data } = await supabase
        .from('prayers')
        .select('*')
        .eq('id', params.id)
        .maybeSingle();

      if (data) {
        setPrayer(data);
      }
    };

    fetchPrayer();
  }, [params.id, supabase]);

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && prayer) {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          content_type: 'prayer',
          content_id: prayer.id,
          status: 'completed',
          completed_at: new Date().toISOString(),
        });
      setCompleted(true);
    }
  };

  if (!prayer) {
    return null;
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8 lg:p-12">
          <div className="mb-6">
            <span className="text-sm text-mustard uppercase tracking-wider font-semibold">
              {prayer.category}
            </span>
            <h1 className="text-3xl lg:text-4xl font-display font-bold mt-2 mb-6">
              {prayer.title}
            </h1>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed whitespace-pre-line">
              {prayer.content}
            </p>
          </div>

          <div className="mt-8 flex gap-3">
            <Button
              onClick={handleComplete}
              disabled={completed}
              className="bg-mustard text-navy hover:bg-mustard/90"
            >
              {completed ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Completed
                </>
              ) : (
                'Mark as Completed'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
