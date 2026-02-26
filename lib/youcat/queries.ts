import { createClient } from '@/lib/supabase/server';
import {
  YoucatPart,
  YoucatSection,
  YoucatChapter,
  YoucatQuestion,
  YoucatQuestionDetail,
  NavigationContext,
  AdjacentNavigation,
} from './types';

export async function fetchAllParts(): Promise<YoucatPart[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('youcat_parts')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchSectionsByPartId(partId: string): Promise<YoucatSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('youcat_sections')
    .select('*')
    .eq('part_id', partId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchChaptersBySectionId(sectionId: string): Promise<YoucatChapter[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('youcat_chapters')
    .select('*')
    .eq('section_id', sectionId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchQuestionsByChapterId(chapterId: string): Promise<YoucatQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('youcat_questions')
    .select('*')
    .eq('chapter_id', chapterId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function fetchQuestionDetail(questionId: string): Promise<YoucatQuestionDetail | null> {
  const supabase = await createClient();

  const { data: question, error: questionError } = await supabase
    .from('youcat_questions')
    .select('*')
    .eq('id', questionId)
    .maybeSingle();

  if (questionError) throw questionError;
  if (!question) return null;

  const { data: supplementary, error: suppError } = await supabase
    .from('youcat_supplementary')
    .select('*')
    .eq('question_id', questionId)
    .order('order_index', { ascending: true });

  if (suppError) throw suppError;

  return {
    ...question,
    supplementary: supplementary || [],
  };
}

export async function fetchNavigationContext(
  partNumber?: number,
  sectionNumber?: number,
  chapterNumber?: number
): Promise<NavigationContext | null> {
  const supabase = await createClient();

  const { data: part, error: partError } = await supabase
    .from('youcat_parts')
    .select('*')
    .eq('number', partNumber || 1)
    .maybeSingle();

  if (partError || !part) return null;

  if (!sectionNumber) {
    const { data: firstSection } = await supabase
      .from('youcat_sections')
      .select('*')
      .eq('part_id', part.id)
      .order('order_index', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!firstSection) return null;

    const { data: firstChapter } = await supabase
      .from('youcat_chapters')
      .select('*')
      .eq('section_id', firstSection.id)
      .order('order_index', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!firstChapter) return null;

    return { part, section: firstSection, chapter: firstChapter };
  }

  const { data: section, error: sectionError } = await supabase
    .from('youcat_sections')
    .select('*')
    .eq('part_id', part.id)
    .eq('number', sectionNumber)
    .maybeSingle();

  if (sectionError || !section) return null;

  if (!chapterNumber) {
    const { data: firstChapter } = await supabase
      .from('youcat_chapters')
      .select('*')
      .eq('section_id', section.id)
      .order('order_index', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!firstChapter) return null;

    return { part, section, chapter: firstChapter };
  }

  const { data: chapter, error: chapterError } = await supabase
    .from('youcat_chapters')
    .select('*')
    .eq('section_id', section.id)
    .eq('number', chapterNumber)
    .maybeSingle();

  if (chapterError || !chapter) return null;

  return { part, section, chapter };
}

export async function fetchAdjacentQuestions(
  questionId: string,
  chapterId: string
): Promise<{ prevId: string | null; nextId: string | null }> {
  const supabase = await createClient();

  const { data: currentQuestion } = await supabase
    .from('youcat_questions')
    .select('order_index')
    .eq('id', questionId)
    .maybeSingle();

  if (!currentQuestion) return { prevId: null, nextId: null };

  const { data: prevQuestion } = await supabase
    .from('youcat_questions')
    .select('id')
    .eq('chapter_id', chapterId)
    .lt('order_index', currentQuestion.order_index)
    .order('order_index', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: nextQuestion } = await supabase
    .from('youcat_questions')
    .select('id')
    .eq('chapter_id', chapterId)
    .gt('order_index', currentQuestion.order_index)
    .order('order_index', { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    prevId: prevQuestion?.id || null,
    nextId: nextQuestion?.id || null,
  };
}

export async function fetchAdjacentChapters(
  chapterId: string,
  sectionId: string
): Promise<{ prevId: string | null; nextId: string | null }> {
  const supabase = await createClient();

  const { data: currentChapter } = await supabase
    .from('youcat_chapters')
    .select('order_index')
    .eq('id', chapterId)
    .maybeSingle();

  if (!currentChapter) return { prevId: null, nextId: null };

  const { data: prevChapter } = await supabase
    .from('youcat_chapters')
    .select('id')
    .eq('section_id', sectionId)
    .lt('order_index', currentChapter.order_index)
    .order('order_index', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: nextChapter } = await supabase
    .from('youcat_chapters')
    .select('id')
    .eq('section_id', sectionId)
    .gt('order_index', currentChapter.order_index)
    .order('order_index', { ascending: true })
    .limit(1)
    .maybeSingle();

  return {
    prevId: prevChapter?.id || null,
    nextId: nextChapter?.id || null,
  };
}

export async function getPartByNumber(number: number): Promise<YoucatPart | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('youcat_parts')
    .select('*')
    .eq('number', number)
    .maybeSingle();

  return data;
}

export async function getSectionByPartAndNumber(
  partId: string,
  number: number
): Promise<YoucatSection | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('youcat_sections')
    .select('*')
    .eq('part_id', partId)
    .eq('number', number)
    .maybeSingle();

  return data;
}

export async function getChapterBySectionAndNumber(
  sectionId: string,
  number: number
): Promise<YoucatChapter | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('youcat_chapters')
    .select('*')
    .eq('section_id', sectionId)
    .eq('number', number)
    .maybeSingle();

  return data;
}

export async function getQuestionByChapterAndNumber(
  chapterId: string,
  qNumber: number
): Promise<YoucatQuestion | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('youcat_questions')
    .select('*')
    .eq('chapter_id', chapterId)
    .eq('q_number', qNumber)
    .maybeSingle();

  return data;
}
