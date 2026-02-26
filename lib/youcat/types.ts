export type YoucatPart = {
  id: string;
  number: number;
  title: string;
  description: string | null;
  order_index: number;
};

export type YoucatSection = {
  id: string;
  part_id: string;
  number: number;
  title: string;
  description: string | null;
  order_index: number;
};

export type YoucatChapter = {
  id: string;
  section_id: string;
  number: number;
  title: string;
  description: string | null;
  order_index: number;
};

export type YoucatQuestion = {
  id: string;
  chapter_id: string;
  q_number: number;
  question_text: string;
  answer_text: string;
  order_index: number;
  ccc_refs: string[];
  bible_refs: string[];
  category: string | null;
  tags: string[];
};

export type YoucatSupplementary = {
  id: string;
  question_id: string;
  type: 'quote' | 'definition' | 'sidebar' | string;
  content: string;
  order_index: number;
};

export type YoucatQuestionDetail = YoucatQuestion & {
  supplementary: YoucatSupplementary[];
};

export type NavigationContext = {
  part: YoucatPart;
  section: YoucatSection;
  chapter: YoucatChapter;
};

export type AdjacentNavigation = {
  prevQuestionId: string | null;
  nextQuestionId: string | null;
  prevChapterId: string | null;
  nextChapterId: string | null;
};

export type YoucatUrlParams = {
  part?: number;
  section?: number;
  chapter?: number;
  question?: number;
};
