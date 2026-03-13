'use client';

import { useEffect, useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CccParagraph } from '@/lib/ccc/ccc-queries';

type Props = {
  paragraphs: CccParagraph[];
};

export function CccBookReader({ paragraphs }: Props) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const total = paragraphs.length;
  const safeIndex = total > 0 ? Math.min(currentPageIndex, total - 1) : 0;
  const current = total > 0 ? paragraphs[safeIndex] : undefined;

  const goPrev = useCallback(() => {
    setCurrentPageIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentPageIndex((i) => Math.min(total - 1, i + 1));
  }, [total]);

  useEffect(() => {
    setCurrentPageIndex((prev) => Math.min(prev, Math.max(0, paragraphs.length - 1)));
  }, [paragraphs]);

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

  if (paragraphs.length === 0 || current == null) {
    return (
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        No paragraphs in this scope.
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
      aria-label="CCC paragraph reader"
    >
      <div className="p-6 lg:p-10 min-h-[320px] flex flex-col">
        <div className="flex-1 prose prose-invert max-w-none">
          <p className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2">
            Paragraph {current.paragraph_number}
          </p>
          <div className="text-base leading-relaxed whitespace-pre-line">
            {current.text}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goPrev}
              disabled={!canGoPrev}
              aria-label="Previous paragraph"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goNext}
              disabled={!canGoNext}
              aria-label="Next paragraph"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Paragraph {safeIndex + 1} of {total}
            <span className="hidden sm:inline ml-2">· Use ← → to turn pages</span>
          </p>
        </div>
      </div>
    </div>
  );
}
