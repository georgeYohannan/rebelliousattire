'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import type { YcQuestionDetail } from '@/lib/youcat/yc-queries';

type Props = {
  question: YcQuestionDetail;
  showOpenFullPage?: boolean;
};

export function YcQuestionDetailView({ question, showOpenFullPage = true }: Props) {
  const scriptureElements = question.supplementary.filter((s) => s.element_type === 'scripture');
  const quoteElements = question.supplementary.filter((s) => s.element_type === 'quote');
  const definitionElements = question.supplementary.filter((s) => s.element_type === 'definition');
  const cccRefs = question.ccc_reference
    ? question.ccc_reference.split(',').map((r) => r.trim())
    : [];

  return (
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
              {scriptureElements.map((elem) => (
                <div key={elem.id} className="text-sm">
                  <p className="text-foreground">{elem.content}</p>
                  {elem.source_author && (
                    <p className="text-muted-foreground italic mt-1">— {elem.source_author}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {quoteElements.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-mustard mb-2 uppercase tracking-wider">
              Quotes
            </h3>
            <div className="space-y-2">
              {quoteElements.map((elem) => (
                <div key={elem.id} className="text-sm">
                  <p className="text-foreground">{elem.content}</p>
                  {elem.source_author && (
                    <p className="text-muted-foreground italic mt-1">— {elem.source_author}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {definitionElements.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-sm font-semibold text-mustard mb-2 uppercase tracking-wider">
              Definitions
            </h3>
            <div className="space-y-2">
              {definitionElements.map((elem) => (
                <div key={elem.id} className="text-sm">
                  <p className="text-foreground">{elem.content}</p>
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
                <Badge
                  key={idx}
                  variant="outline"
                  className="border-mustard/30 text-foreground"
                >
                  CCC {ref}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {showOpenFullPage && (
        <div className="mt-8 pt-6 border-t border-border">
          <Link
            href={`/learn/youcat/${question.id}`}
            className="text-sm font-medium text-mustard hover:underline"
          >
            Open full question page →
          </Link>
        </div>
      )}
    </Card>
  );
}
