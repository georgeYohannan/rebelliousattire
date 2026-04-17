  'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
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

function getOrdinalWord(num: number): string {
  const ordinals = ['First', 'Second', 'Third', 'Fourth', 'Fifth'];
  return ordinals[num - 1] ?? `${num}th`;
}

type DecadePanel = 'ourFather' | 'hailMary' | 'gloryBe' | 'complete';

function getDecadePanel(state: DecadeState, hailMaryTarget: number): DecadePanel {
  const target = Math.max(1, hailMaryTarget);
  if (!state.ourFatherDone) return 'ourFather';
  if (state.hailMaryCount < target) return 'hailMary';
  if (!state.gloryBeDone) return 'gloryBe';
  return 'complete';
}

/** Five mystery positions on the rosary — stays beside the mystery title for all decade phases. */
function RosaryMysteryStrand({ mysteryIndex }: { mysteryIndex: number }) {
  const idx = Math.max(0, Math.min(4, mysteryIndex));
  const decadeMarkers = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5 sm:items-end">
      <p className="text-[11px] uppercase tracking-wide text-white/65">Mysteries</p>
      <p className="text-xs tabular-nums text-white/85">
        {idx + 1}{' '}
        <span className="text-white/50">/</span> 5
      </p>
      <div className="rounded-md border border-white/10 bg-black/15 p-2">
        <div className="relative mx-auto h-14 w-40">
          <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/25" />
          <div className="absolute left-1/2 top-[62%] h-4 w-px -translate-x-1/2 bg-white/25" />
          <div className="absolute left-1/2 top-[62%] h-2 w-2 -translate-x-1/2 rounded-sm border border-white/30" />
          <div className="absolute left-1/2 top-[72%] h-2 w-[2px] -translate-x-1/2 bg-white/35" />
          <div className="absolute left-1/2 top-[84%] h-2 w-[6px] -translate-x-1/2 rounded-sm border border-white/35" />

          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between px-1">
            {decadeMarkers.map((index) => {
              const isPast = index < idx;
              const isActive = index === idx;
              return (
                <div
                  key={index}
                  className={[
                    'h-3 w-3 rounded-full border transition-all duration-300',
                    isPast
                      ? 'border-mustard bg-mustard shadow-[0_0_8px_rgba(255,183,0,0.45)]'
                      : 'border-white/30 bg-transparent',
                    isActive ? 'animate-pulse border-white/70 bg-white/20' : '',
                  ].join(' ')}
                  aria-label={`Mystery ${index + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function RosaryBeadTracker({
  currentCount,
  totalCount,
}: {
  currentCount: number;
  totalCount: number;
}) {
  const normalizedTotal = Math.max(1, totalCount);
  const beads = Array.from({ length: normalizedTotal }, (_, i) => i + 1);

  return (
    <div className="rounded-lg border border-mustard/20 bg-brown-dark/50 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs uppercase tracking-wide text-white/70">Rosary Beads</p>
        <p className="text-xs text-white/70">
          {Math.min(currentCount, normalizedTotal)}/{normalizedTotal}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {beads.map((beadNumber) => {
          const isComplete = beadNumber <= currentCount;
          const isCurrent = beadNumber === Math.min(currentCount + 1, normalizedTotal);

          return (
            <div
              key={beadNumber}
              className={[
                'h-2.5 w-2.5 rounded-full border transition-all duration-300',
                isComplete
                  ? 'border-mustard bg-mustard shadow-[0_0_8px_rgba(255,183,0,0.45)]'
                  : 'border-white/25 bg-transparent',
                isCurrent && !isComplete ? 'animate-pulse border-white/60 bg-white/10' : '',
              ].join(' ')}
              aria-label={`Hail Mary bead ${beadNumber}`}
            />
          );
        })}
      </div>
    </div>
  );
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

  const decadePanel = useMemo((): DecadePanel | null => {
    if (currentStep?.step_type !== 'decade' || !currentDecadeState) return null;
    return getDecadePanel(currentDecadeState, hailMaryTarget);
  }, [currentStep?.step_type, currentDecadeState, hailMaryTarget]);

  const stepLabel = useMemo(() => {
    if (!currentStep) return 'Step';
    if (currentStep.title_override) return currentStep.title_override;
    if (currentStep.step_type === 'prayer' && currentStep.prayer_id) {
      return stepPrayerMap.get(currentStep.prayer_id)?.title ?? 'Prayer';
    }
    if (currentStep.step_type === 'decade') {
      const idx = (currentStep.mystery_index ?? 0) + 1;
      return `${getOrdinalWord(idx)} ${mysteryType} Mystery`;
    }
    return 'Step';
  }, [currentStep, mysteryType, stepPrayerMap]);

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
      <div
        className={cn(
          'mx-auto w-full',
          currentStep?.step_type === 'decade' ? 'max-w-5xl' : 'max-w-3xl'
        )}
      >
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
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <Button variant="ghost" onClick={resetAll} className="text-muted-foreground hover:text-white">
                  Restart
                </Button>
                <Button
                  onClick={() => {
                    const stepId = currentStep.id;
                    setCompletedStepIds((prev) => ({ ...prev, [stepId]: true }));
                    queueMicrotask(() => {
                      setStepIndex((i) => {
                        if (i >= steps.length - 1) {
                          router.push('/pray/rosary');
                          return i;
                        }
                        return i + 1;
                      });
                    });
                  }}
                  disabled={Boolean(completedStepIds[currentStep.id])}
                  className="bg-mustard text-navy hover:bg-mustard/90"
                >
                  Mark as prayed
                </Button>
              </div>
            </>
          )}

          {/* Decades: shared mystery header; one prayer panel at a time */}
          {currentStep?.step_type === 'decade' && currentDecadeState && decadePanel && (
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="rounded-lg border border-mustard/20 bg-brown-dark/40 p-5 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 text-sm font-medium uppercase tracking-wide text-white/65">
                      Mystery
                    </div>
                    <h2 className="text-2xl font-display font-bold text-white">
                      {currentMystery?.name || 'Mystery'}
                    </h2>
                  </div>
                  <RosaryMysteryStrand
                    mysteryIndex={Math.max(0, Math.min(4, currentStep.mystery_index ?? 0))}
                  />
                </div>
                {currentMystery?.image_url ? (
                  <div className="overflow-hidden rounded-md border border-mustard/20">
                    <img
                      src={currentMystery.image_url}
                      alt={currentMystery.name ? `Art for ${currentMystery.name}` : 'Mystery'}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>
                ) : null}
                <p className="text-sm leading-relaxed text-stone-100">
                  {currentMystery?.description || 'Meditate on this mystery with Christ.'}
                </p>
              </div>

              {decadePanel === 'ourFather' && (
                <div className="rounded-lg border border-mustard/20 bg-brown-dark/40 p-5">
                  <h3 className="text-lg font-semibold text-white mb-3">Our Father</h3>
                  <div className="prose prose-invert max-w-none whitespace-pre-line text-sm">
                    {getBasePrayerContent('Our Father')}
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() =>
                        setDecadeStateByStepId((prev) => ({
                          ...prev,
                          [currentStep.id]: { ...prev[currentStep.id], ourFatherDone: true },
                        }))
                      }
                      className="w-full bg-mustard text-navy hover:bg-mustard/90"
                    >
                      Our Father prayed
                    </Button>
                  </div>
                </div>
              )}

              {decadePanel === 'hailMary' && (
                <div className="rounded-lg border border-mustard/20 bg-brown-dark/40 p-5">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Hail Mary{' '}
                    <span className="text-sm text-muted-foreground">
                      ({currentDecadeState.hailMaryCount}/{hailMaryTarget})
                    </span>
                  </h3>
                  <div className="mt-3 grid gap-4 md:grid-cols-2 md:items-start">
                    <div className="prose prose-invert min-w-0 max-w-none whitespace-pre-line text-sm">
                      {getBasePrayerContent('Hail Mary')}
                    </div>
                    <div className="min-w-0 md:justify-self-end md:max-w-[220px] lg:max-w-[260px]">
                      <RosaryBeadTracker
                        currentCount={currentDecadeState.hailMaryCount}
                        totalCount={hailMaryTarget}
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
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
                      className="border-white/25 !bg-brown-dark !text-white hover:!bg-white/10 hover:!text-white"
                    >
                      Undo
                    </Button>
                    <Button
                      onClick={() =>
                        setDecadeStateByStepId((prev) => ({
                          ...prev,
                          [currentStep.id]: {
                            ...prev[currentStep.id],
                            hailMaryCount: Math.min(
                              hailMaryTarget,
                              prev[currentStep.id].hailMaryCount + 1
                            ),
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
              )}

              {decadePanel === 'gloryBe' && (
                <div className="rounded-lg border border-mustard/20 bg-brown-dark/40 p-5">
                  <h3 className="text-lg font-semibold text-white mb-3">Glory Be</h3>
                  <div className="prose prose-invert max-w-none whitespace-pre-line text-sm">
                    {getBasePrayerContent('Glory Be')}
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => {
                        const stepId = currentStep.id;
                        setDecadeStateByStepId((prev) => ({
                          ...prev,
                          [stepId]: { ...prev[stepId], gloryBeDone: true },
                        }));
                        queueMicrotask(() => {
                          setStepIndex((i) => {
                            if (i >= steps.length - 1) {
                              router.push('/pray/rosary');
                              return i;
                            }
                            return i + 1;
                          });
                        });
                      }}
                      disabled={currentDecadeState.gloryBeDone}
                      className="w-full bg-mustard text-navy hover:bg-mustard/90"
                    >
                      Glory Be prayed
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer: prayer steps advance via Mark as prayed only; decade keeps Previous */}
          {currentStep?.step_type !== 'prayer' && (
            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                onClick={goPrevious}
                disabled={stepIndex === 0}
                className="border-white/25 !bg-brown-dark !text-white hover:!bg-white/10 hover:!text-white"
              >
                Previous
              </Button>
              {currentStep?.step_type === 'decade' ? (
                <span className="inline-flex min-h-10 min-w-[7.5rem]" aria-hidden />
              ) : stepIndex >= steps.length - 1 ? (
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
          )}

          {currentStep?.step_type !== 'prayer' && (
            <div className="mt-4">
              <Button variant="ghost" onClick={resetAll} className="text-muted-foreground hover:text-white">
                Restart
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

