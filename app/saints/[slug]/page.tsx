'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { fetchSaintBySlug, type Saint } from '@/lib/saints/saints-queries';
import { SaintFullProfile } from '@/components/saints/SaintFullProfile';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = {
  params: Promise<{ slug: string }>;
};

export default function SaintDetailPage({ params }: Props) {
  const { slug } = use(params);
  const router = useRouter();
  const [saint, setSaint] = useState<Saint | null | undefined>(undefined);

  useEffect(() => {
    const run = async () => {
      const row = await fetchSaintBySlug(slug);
      setSaint(row);
    };
    run();
  }, [slug]);

  if (saint === undefined) {
    return (
      <div className="min-h-screen bg-brown-dark p-4 lg:p-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (saint === null) {
    return (
      <div className="min-h-screen bg-brown-dark p-4 lg:p-8">
        <div className="mx-auto max-w-3xl space-y-4">
          <Button variant="ghost" onClick={() => router.push('/saints')} className="text-white hover:text-mustard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Saints
          </Button>
          <Card className="border-mustard/20 bg-card/60 p-8">
            <p className="text-muted-foreground">This saint could not be found.</p>
            <Link href="/saints" className="mt-4 inline-block text-mustard hover:underline">
              Return to directory
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brown-dark p-4 lg:p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <Button variant="ghost" onClick={() => router.push('/saints')} className="text-white hover:text-mustard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Saints
        </Button>
        <SaintFullProfile saint={saint} />
      </div>
    </div>
  );
}
