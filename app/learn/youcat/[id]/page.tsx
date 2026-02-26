'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Check } from 'lucide-react';
import { fetchYcQuestionDetail } from '@/lib/youcat/yc-queries';

export default function YoucatQuestionPage() {
  const params = useParams();
  const router = useRouter();
  const [question, setQuestion] = useState<{
    id: number;
    question_number: number;
    question_text: string;
    answer_text: string;
    commentary: string | null;
    ccc_reference: string | null;
    supplementary: Array<{
      element_type: string;
      content: string;
      source_author: string | null;
    }>;
  } | null>(null);
  const [completed, setCompleted] = useState(false);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchQuestion = async () => {
      const questionId = parseInt(params.id as string);
      if (isNaN(questionId)) return;

      const data = await fetchYcQuestionDetail(questionId);

      if (data) {
        setQuestion(data);
      }
    };

    fetchQuestion();
  }, [params.id]);

  const handleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && question) {
      await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          content_type: 'youcat',
          content_id: question.id.toString(),
          status: 'completed',
          completed_at: new Date().toISOString(),
        });
      setCompleted(true);
    }
  };

  if (!question) {
    return null;
  }

  const scriptureElements = question.supplementary.filter(s => s.element_type === 'scripture');
  const cccRefs = question.ccc_reference ? question.ccc_reference.split(',').map(r => r.trim()) : [];

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Learn
        </Button>

        <Card className="p-8 lg:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-mustard/10 rounded-lg text-mustard">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <span className="text-sm text-mustard uppercase tracking-wider font-semibold">
                YOUCAT
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-mustard text-navy hover:bg-mustard/90">
                  Question {question.question_number}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-mustard mb-2 uppercase tracking-wider">
                Question
              </h2>
              <h1 className="text-2xl lg:text-3xl font-display font-bold">
                {question.question_text}
              </h1>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-mustard mb-3 uppercase tracking-wider">
                Answer
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-line">
                  {question.answer_text}
                </p>
              </div>
            </div>

            {question.commentary && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-mustard mb-2 uppercase tracking-wider">
                  Commentary
                </h3>
                <p className="text-base leading-relaxed whitespace-pre-line">
                  {question.commentary}
                </p>
              </div>
            )}

            {scriptureElements.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-mustard mb-2 uppercase tracking-wider">
                  Scripture References
                </h3>
                <div className="space-y-2">
                  {scriptureElements.map((elem, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="text-foreground">{elem.content}</p>
                      {elem.source_author && (
                        <p className="text-muted-foreground italic mt-1">— {elem.source_author}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cccRefs.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-semibold text-mustard mb-2 uppercase tracking-wider">
                  Catechism References
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cccRefs.map((ref, idx) => (
                    <Badge key={idx} variant="outline" className="border-mustard/30 text-foreground">
                      CCC {ref}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
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
                'Mark as Studied'
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
