  'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import {
  fetchPrayersByTitles,
  fetchRosaryMysteriesByType,
  fetchRosaryVariantStepsByVariantId,
  fetchRosaryVariants,
  fetchUserDefaultRosaryVariantId,
  type Prayer,
  type RosaryMystery,
  type RosaryVariant,
  type RosaryVariantStep,
} from '@/lib/prayer/prayer-queries';

type Props = {
  params: Promise<{ type: string }>;
};

type DecadeState = {
  ourFatherDone: boolean;
  hailMaryCount: number;
  gloryBeDone: boolean;
};

const BASE_DECADE_PRAYERS = ['Our Father', 'Hail Mary', 'Glory Be'] as const;

function formatMysteryType(type: string): string {
  if (!type) return '';
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function prayerFallback(title: string) {
  return `Missing prayer text in Supabase: ${title}`;
}

export default function WholeRosaryPage({ params }: Props) {
  const { type } = use(params);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const mysteryType = useMemo(() => formatMysteryType(type), [type]);

  const [variant, setVariant] = useState<RosaryVariant | null>(null);
  const [steps, setSteps] = useState<RosaryVariantStep[]>([]);
  const [mysteries, setMysteries] = useState<RosaryMystery[]>([]);
  const [stepPrayers, setStepPrayers] = useState<Prayer[]>([]);
  const [baseDecadePrayers, setBaseDecadePrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  // Stepper state
  const [stepIndex, setStepIndex] = useState(0);
  const [completedStepIds, setCompletedStepIds] = useState<Record<string, boolean>>({});
  const [decadeStateByStepId, setDecadeStateByStepId] = useState<Record<string, DecadeState>>({});

  const sortedMysteries = useMemo(
    () => mysteries.slice().sort((a, b) => a.order - b.order),
    [mysteries]
  );
  const stepPrayerMap = useMemo(() => new Map(stepPrayers.map((p) => [p.id, p])), [stepPrayers]);
  const basePrayerMap = useMemo(
    () => new Map(baseDecadePrayers.map((p) => [p.title, p.content])),
    [baseDecadePrayers]
  );

  useEffect(() => {
    const run = async () => {
      setLoading(true);

      const [variants, userDefaultVariantId, mysteryRows, decadePrayerRows] = await Promise.all([
        fetchRosaryVariants(),
        fetchUserDefaultRosaryVariantId(),
        fetchRosaryMysteriesByType(mysteryType),
        fetchPrayersByTitles([...BASE_DECADE_PRAYERS]),
      ]);

      const fallback = variants.find((v) => v.is_default) ?? variants[0] ?? null;
      const chosen = variants.find((v) => v.id === userDefaultVariantId) ?? fallback;

      setVariant(chosen);
      setMysteries(mysteryRows);
      setBaseDecadePrayers(decadePrayerRows);

      if (!chosen) {
        setSteps([]);
        setStepPrayers([]);
        setCompletedStepIds({});
        setDecadeStateByStepId({});
        setStepIndex(0);
        setLoading(false);
        return;
      }

      const variantSteps = await fetchRosaryVariantStepsByVariantId(chosen.id);
      setSteps(variantSteps);

      const prayerIds = variantSteps
        .filter((s) => s.step_type === 'prayer' && s.prayer_id)
        .map((s) => s.prayer_id!) as string[];

      if (prayerIds.length > 0) {
        const { data, error } = await supabase
          .from('prayers')
          .select('id,title,content')
          .in('id', prayerIds);

        if (error) {
          console.error('Error fetching step prayers:', error);
          setStepPrayers([]);
        } else {
          setStepPrayers((data || []) as Prayer[]);
        }
      } else {
        setStepPrayers([]);
      }

      const decadeInit: Record<string, DecadeState> = {};
      for (const s of variantSteps) {
        if (s.step_type === 'decade') {
          decadeInit[s.id] = { ourFatherDone: false, hailMaryCount: 0, gloryBeDone: false };
        }
      }
      setDecadeStateByStepId(decadeInit);
      setCompletedStepIds({});
      setStepIndex(0);
      setLoading(false);
    };

    run();
  }, [mysteryType, supabase]);

  const resetAll = () => {
    setStepIndex(0);
    setCompletedStepIds({});
    setDecadeStateByStepId((prev) => {
      const next: Record<string, DecadeState> = {};
      for (const key of Object.keys(prev)) {
        next[key] = { ourFatherDone: false, hailMaryCount: 0, gloryBeDone: false };
      }
      return next;
    });
  };

  const currentStep = steps[stepIndex] ?? null;
  const currentDecadeState =
    currentStep?.step_type === 'decade' ? decadeStateByStepId[currentStep.id] ?? null : null;
  const currentMystery =
    currentStep?.step_type === 'decade' && currentStep.mystery_index != null
      ? sortedMysteries[currentStep.mystery_index] ?? null
      : null;
  const hailMaryTarget =
    currentStep?.step_type === 'decade' ? (currentStep.hail_mary_target ?? 10) : 10;

  const stepLabel = useMemo(() => {
    if (!currentStep) return 'Step';
    if (currentStep.title_override) return currentStep.title_override;
    if (currentStep.step_type === 'prayer' && currentStep.prayer_id) {
      return stepPrayerMap.get(currentStep.prayer_id)?.title ?? 'Prayer';
    }
    if (currentStep.step_type === 'decade') {
      const idx = (currentStep.mystery_index ?? 0) + 1;
      return `Decade ${idx}`;
    }
    return 'Step';
  }, [currentStep, stepPrayerMap]);

  const getBasePrayerContent = (title: string) => basePrayerMap.get(title) ?? prayerFallback(title);
  const getStepPrayerContent = (prayerId: string | null) => {
    if (!prayerId) return prayerFallback('Prayer');
    return stepPrayerMap.get(prayerId)?.content ?? prayerFallback('Prayer');
  };

  const canGoNext = (() => {
    if (!currentStep) return false;
    if (currentStep.step_type === 'prayer') return Boolean(completedStepIds[currentStep.id]);
    if (!currentDecadeState) return false;
    return (
      currentDecadeState.ourFatherDone &&
      currentDecadeState.hailMaryCount === hailMaryTarget &&
      currentDecadeState.gloryBeDone
    );
  })();

  const goNext = () => {
    if (!canGoNext) return;
    if (stepIndex < steps.length - 1) setStepIndex(stepIndex + 1);
    else router.push('/pray/rosary');
  };

  const goPrevious = () => {
    if (stepIndex <= 0) return;
    setStepIndex(stepIndex - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 lg:p-8 flex items-center justify-center">
        <Card className="p-6 w-full max-w-2xl">
          <p className="text-muted-foreground">Loading your Rosary…</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown-dark p-4 lg:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:text-mustard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">
              Whole Rosary - {variant?.name || 'Rosary'}
            </div>
            <div className="text-xs text-muted-foreground">
              Step {Math.min(stepIndex + 1, steps.length)} of {steps.length}
            </div>
          </div>
        </div>

        <Card className="p-6 bg-card/50 backdrop-blur border-mustard/20">
          <div className="flex items-center gap-3 mb-4">
            <Badge className="bg-mustard text-navy hover:bg-mustard/90">STEP {stepIndex + 1}</Badge>
            <h1 className="text-2xl font-display font-bold text-white">{stepLabel}</h1>
          </div>

          {/* Prayer step */}
          {currentStep?.step_type === 'prayer' && (
            <>
              <div className="prose prose-invert max-w-none whitespace-pre-line">
                {getStepPrayerContent(currentStep.prayer_id)}
              </div>
              <div className="mt-6 flex items-center gap-3">
                <Button
                  onClick={() =>
                    setCompletedStepIds((prev) => ({ ...prev, [currentStep.id]: true }))
                  }
                  disabled={Boolean(completedStepIds[currentStep.id])}
                  className="bg-mustard text-navy hover:bg-mustard/90"
                >
                  {completedStepIds[currentStep.id] ? 'Marked as prayed' : 'Mark as prayed'}
                </Button>
              </div>
            </>
          )}

          {/* Decades */}
          {currentStep?.step_type === 'decade' && currentDecadeState && (
            <>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Mystery
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-2">
                  {currentMystery?.name || 'Mystery'}
                </h2>
                {currentMystery?.description && (
                  <p className="text-sm text-muted-foreground">{currentMystery.description}</p>
                )}
              </div>

              <div className="space-y-6">
                {/* Our Father */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Our Father</h3>
                  <div className="prose prose-invert max-w-none whitespace-pre-line text-sm">
                    {getBasePrayerContent('Our Father')}
                  </div>
                  <div className="mt-3">
                    <Button
                      onClick={() =>
                        setDecadeStateByStepId((prev) => ({
                          ...prev,
                          [currentStep.id]: { ...prev[currentStep.id], ourFatherDone: true },
                        }))
                      }
                      disabled={currentDecadeState.ourFatherDone}
                      className="bg-mustard text-navy hover:bg-mustard/90 w-full"
                    >
                      {currentDecadeState.ourFatherDone ? 'Marked as prayed' : 'Our Father prayed'}
                    </Button>
                  </div>
                </div>

                {/* Hail Mary Counter */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Hail Mary{' '}
                    <span className="text-muted-foreground text-sm">
                      ({currentDecadeState.hailMaryCount}/{hailMaryTarget})
                    </span>
                  </h3>
                  <div className="prose prose-invert max-w-none whitespace-pre-line text-sm">
                    {getBasePrayerContent('Hail Mary')}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setDecadeStateByStepId((prev) => ({
                          ...prev,
                          [currentStep.id]: {
                            ...prev[currentStep.id],
                            hailMaryCount: Math.max(0, prev[currentStep.id].hailMaryCount - 1),
                          },
                        }))
                      }
                      disabled={currentDecadeState.hailMaryCount <= 0}
                      className="border-white/20 text-white"
                    >
                      Undo
                    </Button>
                    <Button
                      onClick={() =>
                        setDecadeStateByStepId((prev) => ({
                          ...prev,
                          [currentStep.id]: {
                            ...prev[currentStep.id],
                            hailMaryCount: Math.min(hailMaryTarget, prev[currentStep.id].hailMaryCount + 1),
                          },
                        }))
                      }
                      disabled={currentDecadeState.hailMaryCount >= hailMaryTarget}
                      className="bg-mustard text-navy hover:bg-mustard/90"
                    >
                      Hail Mary prayed
                    </Button>
                  </div>
                </div>

                {/* Glory Be */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Glory Be</h3>
                  <div className="prose prose-invert max-w-none whitespace-pre-line text-sm">
                    {getBasePrayerContent('Glory Be')}
                  </div>
                  <div className="mt-3">
                    <Button
                      onClick={() =>
                        setDecadeStateByStepId((prev) => ({
                          ...prev,
                          [currentStep.id]: { ...prev[currentStep.id], gloryBeDone: true },
                        }))
                      }
                      disabled={
                        currentDecadeState.gloryBeDone ||
                        !currentDecadeState.ourFatherDone ||
                        currentDecadeState.hailMaryCount !== hailMaryTarget
                      }
                      className="bg-mustard text-navy hover:bg-mustard/90 w-full"
                    >
                      {currentDecadeState.gloryBeDone ? 'Marked as prayed' : 'Glory Be prayed'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Footer navigation (Next/Prev) */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="outline" onClick={goPrevious} disabled={stepIndex === 0} className="border-white/20 text-white">
              Previous
            </Button>
            {stepIndex >= steps.length - 1 ? (
              <Button
                onClick={goNext}
                disabled={!canGoNext}
                className="bg-mustard text-navy hover:bg-mustard/90"
              >
                Finish Rosary
              </Button>
            ) : (
              <Button
                onClick={goNext}
                disabled={!canGoNext}
                className="bg-mustard text-navy hover:bg-mustard/90"
              >
                Next
              </Button>
            )}
          </div>

          <div className="mt-4">
            <Button variant="ghost" onClick={resetAll} className="text-muted-foreground hover:text-white">
              Restart
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

