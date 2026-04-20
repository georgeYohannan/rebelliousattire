'use client';

import Link from 'next/link';
import type { Saint } from '@/lib/saints/saints-queries';
import { formatFeastMonthDay, formatOptionalIsoDate } from '@/lib/saints/format';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Props = {
  saint: Saint;
  className?: string;
  /** @deprecated optional override; prefer variant + todayLabel */
  subtitle?: string;
  /** feast = saint is shown because their liturgical feast is today; featured = random spotlight (show Today vs annual feast clearly). */
  variant?: 'feast' | 'featured';
  /** Long formatted “today” string; used when variant is featured */
  todayLabel?: string;
  /** When false, omit the footer link (e.g. on detail page). Default true. */
  showProfileLink?: boolean;
};

export function SaintCoverCard({
  saint,
  className,
  subtitle,
  variant = 'feast',
  todayLabel,
  showProfileLink = true,
}: Props) {
  const feastLabel = formatFeastMonthDay(saint.feast_month, saint.feast_day);
  const born = formatOptionalIsoDate(saint.birth_date);
  const died = formatOptionalIsoDate(saint.death_date);
  const canon = formatOptionalIsoDate(saint.canonization_date);
  const beat = formatOptionalIsoDate(saint.beatification_date);

  return (
    <Card
      className={cn(
        'overflow-hidden border-mustard/20 bg-card/80 backdrop-blur transition-colors hover:border-mustard/40',
        className
      )}
    >
      {saint.image_url ? (
        <div className="relative aspect-[16/10] w-full">
          <img
            src={saint.image_url}
            alt={saint.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            {subtitle ? (
              <p className="text-xs uppercase tracking-wide text-white/80">{subtitle}</p>
            ) : variant === 'featured' && todayLabel ? (
              <>
                <p className="text-xs uppercase tracking-wide text-white/85">Today · {todayLabel}</p>
                <p className="mt-1 text-[11px] text-white/70">Liturgical feast · {feastLabel}</p>
              </>
            ) : (
              <p className="text-xs uppercase tracking-wide text-white/80">
                Feast today · {feastLabel}
              </p>
            )}
            <h2 className="mt-2 font-display text-2xl font-bold text-white">{saint.name}</h2>
            {saint.short_bio ? (
              <p className="mt-2 line-clamp-2 text-sm text-white/90">{saint.short_bio}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="border-b border-mustard/15 bg-brown-dark/50 p-6">
          {subtitle ? (
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{subtitle}</p>
          ) : variant === 'featured' && todayLabel ? (
            <>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Today · {todayLabel}</p>
              <p className="mt-1 text-xs text-muted-foreground/90">Spotlight (no feast match today)</p>
            </>
          ) : (
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Feast today · {feastLabel}
            </p>
          )}
          <h2 className="mt-2 font-display text-2xl font-bold">{saint.name}</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            {variant === 'featured' && todayLabel ? (
              <div className="flex gap-2">
                <dt className="text-muted-foreground shrink-0">Today</dt>
                <dd>{todayLabel}</dd>
              </div>
            ) : null}
            {saint.country ? (
              <div className="flex gap-2">
                <dt className="text-muted-foreground shrink-0">Country</dt>
                <dd>{saint.country}</dd>
              </div>
            ) : null}
            {born ? (
              <div className="flex gap-2">
                <dt className="text-muted-foreground shrink-0">Born</dt>
                <dd>{born}</dd>
              </div>
            ) : null}
            {died ? (
              <div className="flex gap-2">
                <dt className="text-muted-foreground shrink-0">Died</dt>
                <dd>{died}</dd>
              </div>
            ) : null}
            {beat ? (
              <div className="flex gap-2">
                <dt className="text-muted-foreground shrink-0">Beatified</dt>
                <dd>{beat}</dd>
              </div>
            ) : null}
            {canon ? (
              <div className="flex gap-2">
                <dt className="text-muted-foreground shrink-0">Canonized</dt>
                <dd>{canon}</dd>
              </div>
            ) : null}
            <div className="flex gap-2">
              <dt className="text-muted-foreground shrink-0">
                {variant === 'featured' ? 'Liturgical feast' : 'Feast'}
              </dt>
              <dd>{feastLabel}</dd>
            </div>
          </dl>
        </div>
      )}
      {showProfileLink ? (
        <div className="p-4">
          <Link
            href={`/saints/${saint.slug}`}
            className="text-sm font-medium text-mustard hover:underline"
          >
            View profile
          </Link>
        </div>
      ) : null}
    </Card>
  );
}
