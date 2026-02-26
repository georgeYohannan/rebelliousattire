'use client';

import { Card } from '@/components/ui/card';
import { Quote, BookOpen, Info } from 'lucide-react';
import { YoucatSupplementary } from '@/lib/youcat/types';

type Props = {
  supplementary: YoucatSupplementary;
};

export function SupplementaryBlock({ supplementary }: Props) {
  const renderIcon = () => {
    switch (supplementary.type) {
      case 'quote':
        return <Quote className="h-5 w-5 text-mustard" />;
      case 'definition':
        return <BookOpen className="h-5 w-5 text-mustard" />;
      case 'sidebar':
        return <Info className="h-5 w-5 text-mustard" />;
      default:
        return <Info className="h-5 w-5 text-mustard" />;
    }
  };

  const getTypeLabel = () => {
    return supplementary.type.charAt(0).toUpperCase() + supplementary.type.slice(1);
  };

  if (supplementary.type === 'quote') {
    return (
      <Card className="p-4 border-l-4 border-l-mustard bg-mustard/5 my-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-1">{renderIcon()}</div>
          <div>
            <div className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2">
              {getTypeLabel()}
            </div>
            <blockquote className="italic text-base leading-relaxed">
              {supplementary.content}
            </blockquote>
          </div>
        </div>
      </Card>
    );
  }

  if (supplementary.type === 'definition') {
    return (
      <Card className="p-4 bg-mustard/10 border-mustard/30 my-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-1">{renderIcon()}</div>
          <div>
            <div className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2">
              {getTypeLabel()}
            </div>
            <p className="text-base leading-relaxed">{supplementary.content}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (supplementary.type === 'sidebar') {
    return (
      <Card className="p-4 bg-secondary border-border my-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-1">{renderIcon()}</div>
          <div>
            <div className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2">
              {getTypeLabel()}
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {supplementary.content}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 border-border my-4">
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-1">{renderIcon()}</div>
        <div>
          <div className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2">
            {getTypeLabel()}
          </div>
          <p className="text-base leading-relaxed">{supplementary.content}</p>
        </div>
      </div>
    </Card>
  );
}
