'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack } from 'lucide-react';

type Mystery = {
  id: string;
  mystery_type: string;
  name: string;
  order: number;
  description: string;
  scriptural_references: string[];
};

type Props = {
  params: Promise<{ type: string }>;
};

export default function RosaryMeditationPage({ params }: Props) {
  const { type } = use(params);
  const router = useRouter();
  const [mysteries, setMysteries] = useState<Mystery[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  const mysteryType = typeof type === 'string'
    ? type.charAt(0).toUpperCase() + type.slice(1)
    : '';

  useEffect(() => {
    const fetchMysteries = async () => {
      const { data } = await supabase
        .from('rosary_mysteries')
        .select('*')
        .eq('mystery_type', mysteryType)
        .order('order', { ascending: true });

      if (data) {
        setMysteries(data);
      }
    };

    if (mysteryType) {
      fetchMysteries();
    }
  }, [mysteryType, supabase]);

  const currentMystery = mysteries[currentIndex];

  const handleNext = () => {
    if (currentIndex < mysteries.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!currentMystery) {
    return null;
  }

  return (
    <div className="min-h-screen bg-brown-dark flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 text-white hover:text-mustard"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Meditation
        </Button>

        <Card className="bg-card/50 backdrop-blur border-mustard/20">
          <div className="aspect-[4/3] relative">
            <img
              src="https://images.pexels.com/photos/8468148/pexels-photo-8468148.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt={currentMystery.name}
              className="w-full h-full object-cover rounded-t-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <span className="text-mustard text-sm font-semibold uppercase tracking-wider">
                {mysteryType} Mystery
              </span>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mt-2">
                {currentMystery.name}
              </h1>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <p className="text-lg text-foreground/90 italic mb-4">
                &ldquo;{currentMystery.description}&rdquo;
              </p>
              {currentMystery.scriptural_references.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Scripture: {currentMystery.scriptural_references.join(', ')}
                </p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Decade Progress</span>
                <span>{currentIndex + 1} of {mysteries.length}</span>
              </div>
              <div className="flex gap-1 mt-2">
                {mysteries.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 flex-1 rounded ${
                      idx <= currentIndex ? 'bg-mustard' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="h-12 w-12"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                onClick={() => setIsPaused(!isPaused)}
                className="h-16 w-16 rounded-full bg-mustard text-navy hover:bg-mustard/90"
              >
                {isPaused ? (
                  <Play className="h-6 w-6 ml-1" />
                ) : (
                  <Pause className="h-6 w-6" />
                )}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={currentIndex === mysteries.length - 1}
                className="h-12 w-12"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                <span className="inline-block mr-2">🔊</span>
                Ambient: Cathedral Silence
              </p>
              <p className="text-xs text-muted-foreground">
                <span className="inline-block mr-2">⏱</span>
                12:45 remaining
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" className="flex-1">
                📖 Reflections
              </Button>
              <Button variant="outline" className="flex-1">
                ⚙️ Audio Settings
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
