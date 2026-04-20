'use client';

import type { Saint } from '@/lib/saints/saints-queries';
import { formatFeastMonthDay, formatOptionalIsoDate } from '@/lib/saints/format';
import { Card } from '@/components/ui/card';

type Props = {
  saint: Saint;
};

export function SaintFullProfile({ saint }: Props) {
  const feastLabel = formatFeastMonthDay(saint.feast_month, saint.feast_day);
  const biog = saint.biography?.trim() || saint.short_bio?.trim();

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-4">
        {saint.image_url ? (
          <div className="relative overflow-hidden rounded-xl border border-mustard/20">
            <div className="aspect-[16/10] w-full">
              <img src={saint.image_url} alt={saint.name} className="h-full w-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-xs uppercase tracking-wide text-white/75">Feast · {feastLabel}</p>
              <h1 className="font-display text-3xl font-bold text-white">{saint.name}</h1>
            </div>
          </div>
        ) : (
          <Card className="border-mustard/20 bg-brown-dark/50 p-8">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Feast · {feastLabel}</p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white">{saint.name}</h1>
            {saint.short_bio ? <p className="mt-4 text-muted-foreground">{saint.short_bio}</p> : null}
          </Card>
        )}
      </header>

      {(saint.patron_of ?? '').trim() ? (
        <Card className="border-mustard/20 bg-card/60 p-6 backdrop-blur">
          <h2 className="font-display text-lg font-semibold text-white">Patronage</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{saint.patron_of}</p>
        </Card>
      ) : null}

      <Card className="border-mustard/20 bg-card/60 p-6 backdrop-blur">
        <h2 className="font-display text-lg font-semibold text-white">Dates</h2>
        <dl className="mt-4 grid gap-3 text-sm">
          <div className="flex gap-4">
            <dt className="w-36 shrink-0 text-muted-foreground">Feast day</dt>
            <dd>{feastLabel}</dd>
          </div>
          {formatOptionalIsoDate(saint.birth_date) ? (
            <div className="flex gap-4">
              <dt className="w-36 shrink-0 text-muted-foreground">Born</dt>
              <dd>{formatOptionalIsoDate(saint.birth_date)}</dd>
            </div>
          ) : null}
          {formatOptionalIsoDate(saint.death_date) ? (
            <div className="flex gap-4">
              <dt className="w-36 shrink-0 text-muted-foreground">Died</dt>
              <dd>{formatOptionalIsoDate(saint.death_date)}</dd>
            </div>
          ) : null}
          {formatOptionalIsoDate(saint.beatification_date) ? (
            <div className="flex gap-4">
              <dt className="w-36 shrink-0 text-muted-foreground">Beatified</dt>
              <dd>{formatOptionalIsoDate(saint.beatification_date)}</dd>
            </div>
          ) : null}
          {formatOptionalIsoDate(saint.canonization_date) ? (
            <div className="flex gap-4">
              <dt className="w-36 shrink-0 text-muted-foreground">Canonized</dt>
              <dd>{formatOptionalIsoDate(saint.canonization_date)}</dd>
            </div>
          ) : null}
          {saint.country ? (
            <div className="flex gap-4">
              <dt className="w-36 shrink-0 text-muted-foreground">Country</dt>
              <dd>{saint.country}</dd>
            </div>
          ) : null}
        </dl>
      </Card>

      {biog ? (
        <Card className="border-mustard/20 bg-card/60 p-6 backdrop-blur">
          <h2 className="font-display text-lg font-semibold text-white">Biography</h2>
          <div className="prose prose-invert mt-4 max-w-none whitespace-pre-line text-sm leading-relaxed">
            {biog}
          </div>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">No biography has been added for this saint yet.</p>
      )}
    </article>
  );
}
