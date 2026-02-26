import { YoucatUrlParams } from './types';

export function buildYoucatUrl(params: YoucatUrlParams): string {
  const searchParams = new URLSearchParams();

  if (params.part) searchParams.set('part', params.part.toString());
  if (params.section) searchParams.set('section', params.section.toString());
  if (params.chapter) searchParams.set('chapter', params.chapter.toString());
  if (params.question) searchParams.set('question', params.question.toString());

  const queryString = searchParams.toString();
  return `/learn/youcat${queryString ? `?${queryString}` : ''}`;
}

export function parseYoucatParams(searchParams: URLSearchParams): YoucatUrlParams {
  return {
    part: searchParams.get('part') ? parseInt(searchParams.get('part')!) : undefined,
    section: searchParams.get('section') ? parseInt(searchParams.get('section')!) : undefined,
    chapter: searchParams.get('chapter') ? parseInt(searchParams.get('chapter')!) : undefined,
    question: searchParams.get('question') ? parseInt(searchParams.get('question')!) : undefined,
  };
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}
