import { createClient } from '@/lib/supabase/client';

export type YcPart = {
  id: number;
  part_number: number;
  title: string;
};

export type YcSection = {
  id: number;
  part_id: number;
  title: string;
  sort_order: number | null;
};

export type YcChapter = {
  id: number;
  section_id: number;
  title: string;
  sort_order: number | null;
};

export type YcQuestion = {
  id: number;
  section_id: number | null;
  chapter_id: number | null;
  question_number: number;
  question_text: string;
  answer_text: string;
  commentary: string | null;
  ccc_reference: string | null;
};

export type YcSupplementaryElement = {
  id: number;
  question_id: number;
  element_type: 'scripture' | 'quote' | 'definition';
  content: string;
  source_author: string | null;
  icon_identifier: string | null;
};

export type YcQuestionDetail = YcQuestion & {
  supplementary: YcSupplementaryElement[];
};

export async function fetchAllYcParts(): Promise<YcPart[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('yc_parts')
    .select('*')
    .order('part_number', { ascending: true });

  if (error) {
    console.error('Error fetching YC parts:', error);
    return [];
  }
  return data || [];
}

export async function fetchYcSectionsByPartId(partId: number): Promise<YcSection[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('yc_sections')
    .select('*')
    .eq('part_id', partId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching YC sections:', error);
    return [];
  }
  return data || [];
}

export async function fetchYcChaptersBySectionId(sectionId: number): Promise<YcChapter[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('yc_chapters')
    .select('*')
    .eq('section_id', sectionId)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching YC chapters:', error);
    return [];
  }
  return data || [];
}

export async function fetchYcQuestionsByChapterId(chapterId: number): Promise<YcQuestion[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('yc_questions')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('question_number', { ascending: true });

  if (error) {
    console.error('Error fetching YC questions:', error);
    return [];
  }
  return data || [];
}

export async function fetchYcQuestionByNumber(questionNumber: number): Promise<YcQuestion | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('yc_questions')
    .select('*')
    .eq('question_number', questionNumber)
    .maybeSingle();

  if (error) {
    console.error('Error fetching YC question:', error);
    return null;
  }
  return data;
}

export async function fetchYcQuestionDetail(questionId: number): Promise<YcQuestionDetail | null> {
  const supabase = createClient();

  const { data: question, error: questionError } = await supabase
    .from('yc_questions')
    .select('*')
    .eq('id', questionId)
    .maybeSingle();

  if (questionError) {
    console.error('Error fetching YC question:', questionError);
    return null;
  }
  if (!question) return null;

  const { data: supplementary, error: suppError } = await supabase
    .from('yc_supplementary_elements')
    .select('*')
    .eq('question_id', questionId);

  if (suppError) {
    console.error('Error fetching supplementary elements:', suppError);
  }

  return {
    ...question,
    supplementary: supplementary || [],
  };
}

export async function fetchYcPartByNumber(partNumber: number): Promise<YcPart | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('yc_parts')
    .select('*')
    .eq('part_number', partNumber)
    .maybeSingle();

  if (error) {
    console.error('Error fetching YC part:', error);
    return null;
  }
  return data;
}

export async function fetchYcSectionById(sectionId: number): Promise<YcSection | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('yc_sections')
    .select('*')
    .eq('id', sectionId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching YC section:', error);
    return null;
  }
  return data;
}

export async function fetchYcChapterById(chapterId: number): Promise<YcChapter | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('yc_chapters')
    .select('*')
    .eq('id', chapterId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching YC chapter:', error);
    return null;
  }
  return data;
}
