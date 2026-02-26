'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { buildYoucatUrl } from '@/lib/youcat/utils';

type Props = {
  prevQuestionNumber?: number;
  nextQuestionNumber?: number;
  prevChapterNumber?: number;
  nextChapterNumber?: number;
  currentPart: number;
  currentSection: number;
  currentChapter: number;
  onNavigate?: () => void;
};

export function NavigationControls({
  prevQuestionNumber,
  nextQuestionNumber,
  prevChapterNumber,
  nextChapterNumber,
  currentPart,
  currentSection,
  currentChapter,
  onNavigate,
}: Props) {
  const router = useRouter();

  function handlePrevQuestion() {
    if (prevQuestionNumber) {
      router.push(
        buildYoucatUrl({
          part: currentPart,
          section: currentSection,
          chapter: currentChapter,
          question: prevQuestionNumber,
        })
      );
      onNavigate?.();
    }
  }

  function handleNextQuestion() {
    if (nextQuestionNumber) {
      router.push(
        buildYoucatUrl({
          part: currentPart,
          section: currentSection,
          chapter: currentChapter,
          question: nextQuestionNumber,
        })
      );
      onNavigate?.();
    }
  }

  function handlePrevChapter() {
    if (prevChapterNumber) {
      router.push(
        buildYoucatUrl({
          part: currentPart,
          section: currentSection,
          chapter: prevChapterNumber,
        })
      );
      onNavigate?.();
    }
  }

  function handleNextChapter() {
    if (nextChapterNumber) {
      router.push(
        buildYoucatUrl({
          part: currentPart,
          section: currentSection,
          chapter: nextChapterNumber,
        })
      );
      onNavigate?.();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handlePrevQuestion}
          disabled={!prevQuestionNumber}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous Question
        </Button>
        <Button
          variant="outline"
          onClick={handleNextQuestion}
          disabled={!nextQuestionNumber}
          className="flex-1"
        >
          Next Question
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handlePrevChapter}
          disabled={!prevChapterNumber}
          className="flex-1"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous Chapter
        </Button>
        <Button
          variant="outline"
          onClick={handleNextChapter}
          disabled={!nextChapterNumber}
          className="flex-1"
        >
          Next Chapter
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
