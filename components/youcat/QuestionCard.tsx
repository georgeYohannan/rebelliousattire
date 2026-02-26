'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { YoucatQuestionDetail } from '@/lib/youcat/types';
import { SupplementaryBlock } from './SupplementaryBlock';

type Props = {
  question: YoucatQuestionDetail;
  isSelected: boolean;
};

export function QuestionCard({ question, isSelected }: Props) {
  return (
    <Card
      id={`question-${question.id}`}
      className={`p-6 lg:p-8 scroll-mt-20 transition-all ${
        isSelected ? 'border-mustard bg-mustard/5' : 'border-border'
      }`}
    >
      <div className="space-y-6">
        <div>
          <Badge className="bg-mustard text-navy hover:bg-mustard/90 mb-3">
            Question {question.q_number}
          </Badge>
          <h2 className="text-2xl lg:text-3xl font-display font-bold leading-tight">
            {question.question_text}
          </h2>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-mustard uppercase tracking-wider mb-3">
            Answer
          </h3>
          <div className="prose prose-invert max-w-none">
            <p className="text-base lg:text-lg leading-relaxed whitespace-pre-line">
              {question.answer_text}
            </p>
          </div>
        </div>

        {question.supplementary && question.supplementary.length > 0 && (
          <div className="space-y-3">
            {question.supplementary.map((supp) => (
              <SupplementaryBlock key={supp.id} supplementary={supp} />
            ))}
          </div>
        )}

        {question.bible_refs && question.bible_refs.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2">
              Scripture References
            </h4>
            <div className="flex flex-wrap gap-2">
              {question.bible_refs.map((ref, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="border-mustard/30 text-foreground"
                >
                  {ref}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {question.ccc_refs && question.ccc_refs.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2">
              Catechism References
            </h4>
            <div className="flex flex-wrap gap-2">
              {question.ccc_refs.map((ref, idx) => (
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

        {question.tags && question.tags.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h4 className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2">
              Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {question.tags.map((tag, idx) => (
                <Badge key={idx} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
