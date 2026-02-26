import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

type TodayCardProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
};

export function TodayCard({ title, icon, children, className = '' }: TodayCardProps) {
  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-mustard/10 rounded-lg text-mustard">
          {icon}
        </div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-mustard">
          {title}
        </h3>
      </div>
      {children}
    </Card>
  );
}
