'use client';

import { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { YcQuestionDetailView } from '@/components/youcat/YcQuestionDetailView';
import type { YcQuestionDetail } from '@/lib/youcat/yc-queries';

type Props = {
  questions: YcQuestionDetail[];
};

export function YcBookReader({ questions }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = questions.length;
  const safeIndex = total > 0 ? Math.min(currentIndex, total - 1) : 0;
  const current = total > 0 ? questions[safeIndex] : undefined;

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, Math.max(0, questions.length - 1)));
  }, [questions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goPrev, goNext]);

  if (questions.length === 0 || current == null) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        No questions in this scope.
      </div>
    );
  }

  const canGoPrev = safeIndex > 0;
  const canGoNext = safeIndex < total - 1;

  return (
    <div
      className="rounded-xl border border-border bg-card shadow-lg overflow-hidden"
      tabIndex={0}
      role="region"
      aria-label="YOUCAT question reader"
    >
      <div className="p-6 lg:p-10">
        <YcQuestionDetailView question={current} showOpenFullPage={true} />
        <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Previous question"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goNext}
              disabled={!canGoNext}
              aria-label="Next question"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Question {safeIndex + 1} of {total}
            <span className="hidden sm:inline ml-2">· Use ← → to turn pages</span>
          </p>
        </div>
      </div>
    </div>
  );
}
