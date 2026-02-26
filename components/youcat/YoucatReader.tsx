'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { QuestionCard } from './QuestionCard';
import { NavigationControls } from './NavigationControls';
import { YoucatQuestionDetail } from '@/lib/youcat/types';
import { buildYoucatUrl } from '@/lib/youcat/utils';

type Props = {
  partNumber: number;
  partTitle: string;
  sectionNumber: number;
  sectionTitle: string;
  chapterNumber: number;
  chapterTitle: string;
  chapterId: string;
  selectedQuestionNumber?: number;
};

export function YoucatReader({
  partNumber,
  partTitle,
  sectionNumber,
  sectionTitle,
  chapterNumber,
  chapterTitle,
  chapterId,
  selectedQuestionNumber,
}: Props) {
  const supabase = useMemo(() => createClient(), []);
  const [questions, setQuestions] = useState<YoucatQuestionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjacentChapters, setAdjacentChapters] = useState<{
    prev: number | null;
    next: number | null;
  }>({ prev: null, next: null });

  useEffect(() => {
    loadQuestions();
  }, [chapterId]);

  useEffect(() => {
    if (selectedQuestionNumber && questions.length > 0) {
      setTimeout(() => {
        const question = questions.find((q) => q.q_number === selectedQuestionNumber);
        if (question) {
          const element = document.getElementById(`question-${question.id}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 100);
    }
  }, [selectedQuestionNumber, questions]);

  async function loadQuestions() {
    setLoading(true);

    const { data: questionsData } = await supabase
      .from('youcat_questions')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('order_index', { ascending: true });

    if (questionsData) {
      const questionsWithSupplementary = await Promise.all(
        questionsData.map(async (q) => {
          const { data: suppData } = await supabase
            .from('youcat_supplementary')
            .select('*')
            .eq('question_id', q.id)
            .order('order_index', { ascending: true });

          return {
            ...q,
            supplementary: suppData || [],
          };
        })
      );

      setQuestions(questionsWithSupplementary);
    }

    const { data: currentChapter } = await supabase
      .from('youcat_chapters')
      .select('section_id, order_index')
      .eq('id', chapterId)
      .maybeSingle();

    if (currentChapter) {
      const { data: prevChapter } = await supabase
        .from('youcat_chapters')
        .select('number')
        .eq('section_id', currentChapter.section_id)
        .lt('order_index', currentChapter.order_index)
        .order('order_index', { ascending: false })
        .limit(1)
        .maybeSingle();

      const { data: nextChapter } = await supabase
        .from('youcat_chapters')
        .select('number')
        .eq('section_id', currentChapter.section_id)
        .gt('order_index', currentChapter.order_index)
        .order('order_index', { ascending: true })
        .limit(1)
        .maybeSingle();

      setAdjacentChapters({
        prev: prevChapter?.number || null,
        next: nextChapter?.number || null,
      });
    }

    setLoading(false);
  }

  function getAdjacentQuestions(currentQNumber: number) {
    const currentIndex = questions.findIndex((q) => q.q_number === currentQNumber);
    return {
      prev: currentIndex > 0 ? questions[currentIndex - 1].q_number : undefined,
      next: currentIndex < questions.length - 1 ? questions[currentIndex + 1].q_number : undefined,
    };
  }

  const selectedQuestion = selectedQuestionNumber
    ? questions.find((q) => q.q_number === selectedQuestionNumber)
    : null;

  const adjacentQuestions = selectedQuestionNumber
    ? getAdjacentQuestions(selectedQuestionNumber)
    : { prev: undefined, next: undefined };

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={buildYoucatUrl({ part: partNumber })}>
              Part {partNumber}: {partTitle}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={buildYoucatUrl({ part: partNumber, section: sectionNumber })}
            >
              Section {sectionNumber}: {sectionTitle}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>
              Chapter {chapterNumber}: {chapterTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">
          Chapter {chapterNumber}: {chapterTitle}
        </h1>
        <p className="text-muted-foreground">
          {questions.length} {questions.length === 1 ? 'question' : 'questions'} in this
          chapter
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No questions found in this chapter.
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              isSelected={selectedQuestionNumber === question.q_number}
            />
          ))}
        </div>
      )}

      {questions.length > 0 && (
        <div className="pt-6">
          <NavigationControls
            prevQuestionNumber={adjacentQuestions.prev}
            nextQuestionNumber={adjacentQuestions.next}
            prevChapterNumber={adjacentChapters.prev || undefined}
            nextChapterNumber={adjacentChapters.next || undefined}
            currentPart={partNumber}
            currentSection={sectionNumber}
            currentChapter={chapterNumber}
            onNavigate={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
}
