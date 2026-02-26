'use client';

import { BookOpen } from 'lucide-react';
import { TodayCard } from './TodayCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { fetchYcQuestionByNumber } from '@/lib/youcat/yc-queries';
import Link from 'next/link';

export function YoucatQuestion() {
  const [question, setQuestion] = useState<{
    id: number;
    question_number: number;
    question_text: string;
    answer_text: string;
  } | null>(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
      const questionNumber = (dayOfYear % 527) + 1;

      const data = await fetchYcQuestionByNumber(questionNumber);

      if (data) {
        setQuestion(data);
      }
    };

    fetchQuestion();
  }, []);

  if (!question) return null;

  return (
    <TodayCard title="YOUCAT" icon={<BookOpen className="h-5 w-5" />}>
      <div className="flex items-start gap-3 mb-3">
        <Badge className="bg-mustard text-navy hover:bg-mustard/90 shrink-0">
          {question.question_number}
        </Badge>
        <h3 className="text-base font-semibold">{question.question_text}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {question.answer_text.substring(0, 100)}...
      </p>
      <Link href={`/learn/youcat/${question.id}`}>
        <Button variant="outline" className="w-full border-mustard text-mustard hover:bg-mustard hover:text-navy">
          Study Answer
        </Button>
      </Link>
    </TodayCard>
  );
}
