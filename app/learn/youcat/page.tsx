import { YoucatNavigator } from '@/components/youcat/YoucatNavigator';
import { YoucatReader } from '@/components/youcat/YoucatReader';
import { fetchNavigationContext } from '@/lib/youcat/queries';
import { parseYoucatParams } from '@/lib/youcat/utils';
import { redirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function YoucatPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const params = parseYoucatParams(new URLSearchParams(resolvedParams as Record<string, string>));

  // No params: same behaviour as CCC — go straight to explore page
  if (params.part == null && params.section == null && params.chapter == null && params.question == null) {
    redirect('/learn/youcat/explore');
  }

  const context = await fetchNavigationContext(
    params.part,
    params.section,
    params.chapter
  );

  if (!context) {
    redirect('/learn');
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">YOUCAT</h1>
          <p className="text-muted-foreground">
            Youth Catechism of the Catholic Church
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <YoucatNavigator
              initialPart={params.part}
              initialSection={params.section}
              initialChapter={params.chapter}
              initialQuestion={params.question}
            />
          </div>

          <div className="lg:col-span-8">
            <YoucatReader
              partNumber={context.part.number}
              partTitle={context.part.title}
              sectionNumber={context.section.number}
              sectionTitle={context.section.title}
              chapterNumber={context.chapter.number}
              chapterTitle={context.chapter.title}
              chapterId={context.chapter.id}
              selectedQuestionNumber={params.question}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
