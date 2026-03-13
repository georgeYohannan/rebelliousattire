import { createClient } from '@/lib/supabase/client';

export type CccPart = {
  id: number;
  number: number;
  title: string;
};

export type CccSection = {
  id: number;
  part_id: number;
  number: number;
  title: string;
};

export type CccChapter = {
  id: number;
  section_id: number;
  number: number;
  title: string;
};

export type CccArticle = {
  id: number;
  chapter_id: number;
  number: number;
  title: string;
};

export type CccSubheading = {
  id: number;
  article_id: number | null;
  chapter_id: number | null;
  type: string;
  label: string | null;
  title: string;
};

export type CccParagraph = {
  id: number;
  paragraph_number: number;
  text: string;
  part_id: number;
  section_id: number;
  chapter_id: number;
  article_id: number | null;
  subheading_id: number | null;
  is_in_brief: boolean;
  page_number: number | null;
};

export type CccParagraphScope = {
  partId?: number;
  sectionId?: number;
  chapterId?: number;
  articleId?: number;
  subheadingId?: number;
};

function normalizePart(row: Record<string, unknown>): CccPart {
  const id = Number(row.id);
  const number = Number(row.number ?? row.part_number ?? row.num ?? id);
  const title = String(row.title ?? '');
  return { id, number, title };
}

export async function fetchCccParts(): Promise<CccPart[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ccc_parts')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching CCC parts:', error);
    return [];
  }
  const rows = Array.isArray(data) ? data : [];
  return rows.map((row) => normalizePart(row as Record<string, unknown>));
}

export async function fetchCccSectionsByPartId(partId: number): Promise<CccSection[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ccc_sections')
    .select('*')
    .eq('part_id', partId)
    .order('number', { ascending: true });

  if (error) {
    console.error('Error fetching CCC sections:', error);
    return [];
  }
  return data || [];
}

export async function fetchCccChaptersBySectionId(sectionId: number): Promise<CccChapter[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ccc_chapters')
    .select('*')
    .eq('section_id', sectionId)
    .order('number', { ascending: true });

  if (error) {
    console.error('Error fetching CCC chapters:', error);
    return [];
  }
  return data || [];
}

export async function fetchCccArticlesByChapterId(chapterId: number): Promise<CccArticle[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ccc_articles')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('number', { ascending: true });

  if (error) {
    console.error('Error fetching CCC articles:', error);
    return [];
  }
  return data || [];
}

export async function fetchCccSubheadingsByChapterId(
  chapterId: number
): Promise<CccSubheading[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ccc_subheadings')
    .select('*')
    .eq('chapter_id', chapterId);

  if (error) {
    console.error('Error fetching CCC subheadings by chapter:', error);
    return [];
  }
  return data || [];
}

export async function fetchCccSubheadingsByArticleId(
  articleId: number
): Promise<CccSubheading[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ccc_subheadings')
    .select('*')
    .eq('article_id', articleId);

  if (error) {
    console.error('Error fetching CCC subheadings by article:', error);
    return [];
  }
  return data || [];
}

export async function fetchCccParagraphsByScope(
  scope: CccParagraphScope
): Promise<CccParagraph[]> {
  const supabase = createClient();
  let query = supabase
    .from('ccc_paragraphs')
    .select('*')
    .order('paragraph_number', { ascending: true });

  if (scope.partId != null) {
    query = query.eq('part_id', scope.partId);
  }
  if (scope.sectionId != null) {
    query = query.eq('section_id', scope.sectionId);
  }
  if (scope.chapterId != null) {
    query = query.eq('chapter_id', scope.chapterId);
  }
  if (scope.articleId != null) {
    query = query.eq('article_id', scope.articleId);
  }
  if (scope.subheadingId != null) {
    query = query.eq('subheading_id', scope.subheadingId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching CCC paragraphs by scope:', error);
    return [];
  }
  return data || [];
}
