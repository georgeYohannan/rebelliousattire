'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import {
  fetchAllYcParts,
  fetchYcSectionsByPartId,
  fetchYcChaptersBySectionId,
  fetchYcQuestionsByChapterId,
  fetchYcQuestionDetail,
  type YcPart,
  type YcSection,
  type YcChapter,
  type YcQuestion,
  type YcQuestionDetail,
} from '@/lib/youcat/yc-queries';
import { YcQuestionDetailView } from '@/components/youcat/YcQuestionDetailView';

export default function YoucatExplorePage() {
  const [parts, setParts] = useState<YcPart[]>([]);
  const [sections, setSections] = useState<YcSection[]>([]);
  const [chapters, setChapters] = useState<YcChapter[]>([]);
  const [questions, setQuestions] = useState<YcQuestion[]>([]);

  const [selectedPart, setSelectedPart] = useState<YcPart | null>(null);
  const [selectedSection, setSelectedSection] = useState<YcSection | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<YcChapter | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<YcQuestion | null>(null);
  const [questionDetail, setQuestionDetail] = useState<YcQuestionDetail | null>(null);
  const [scopeQuestionDetails, setScopeQuestionDetails] = useState<YcQuestionDetail[]>([]);
  const [loadingScopeContent, setLoadingScopeContent] = useState(false);

  const [loadingParts, setLoadingParts] = useState(true);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingQuestionDetail, setLoadingQuestionDetail] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadParts = async () => {
      try {
        const data = await fetchAllYcParts();
        if (cancelled) return;
        setParts(data);
      } finally {
        if (!cancelled) {
          setLoadingParts(false);
        }
      }
    };

    loadParts();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadSections = async () => {
      if (!selectedPart) {
        setSections([]);
        setSelectedSection(null);
        setSelectedChapter(null);
        setSelectedQuestion(null);
        setChapters([]);
        setQuestions([]);
        setQuestionDetail(null);
        setLoadingSections(false);
        return;
      }

      setLoadingSections(true);
      setSelectedSection(null);
      setSelectedChapter(null);
      setSelectedQuestion(null);
      setChapters([]);
      setQuestions([]);
      setQuestionDetail(null);

      try {
        const data = await fetchYcSectionsByPartId(selectedPart.id);
        if (cancelled) return;
        setSections(data);
      } finally {
        if (!cancelled) {
          setLoadingSections(false);
        }
      }
    };

    loadSections();

    return () => {
      cancelled = true;
    };
  }, [selectedPart]);

  useEffect(() => {
    let cancelled = false;

    const loadChapters = async () => {
      if (!selectedSection) {
        setChapters([]);
        setSelectedChapter(null);
        setSelectedQuestion(null);
        setQuestions([]);
        setQuestionDetail(null);
        setLoadingChapters(false);
        return;
      }

      setLoadingChapters(true);
      setSelectedChapter(null);
      setSelectedQuestion(null);
      setQuestions([]);
      setQuestionDetail(null);

      try {
        const data = await fetchYcChaptersBySectionId(selectedSection.id);
        if (cancelled) return;
        setChapters(data);
      } finally {
        if (!cancelled) {
          setLoadingChapters(false);
        }
      }
    };

    loadChapters();

    return () => {
      cancelled = true;
    };
  }, [selectedSection]);

  useEffect(() => {
    let cancelled = false;

    const loadQuestions = async () => {
      if (!selectedChapter) {
        setQuestions([]);
        setSelectedQuestion(null);
        setQuestionDetail(null);
        setLoadingQuestions(false);
        return;
      }

      setLoadingQuestions(true);
      setSelectedQuestion(null);
      setQuestionDetail(null);

      try {
        const data = await fetchYcQuestionsByChapterId(selectedChapter.id);
        if (cancelled) return;
        setQuestions(data);
      } finally {
        if (!cancelled) {
          setLoadingQuestions(false);
        }
      }
    };

    loadQuestions();

    return () => {
      cancelled = true;
    };
  }, [selectedChapter]);

  useEffect(() => {
    let cancelled = false;

    const loadQuestionDetail = async () => {
      if (!selectedQuestion) {
        setQuestionDetail(null);
        setLoadingQuestionDetail(false);
        return;
      }

      setLoadingQuestionDetail(true);
      try {
        const data = await fetchYcQuestionDetail(selectedQuestion.id);
        if (cancelled) return;
        setQuestionDetail(data ?? null);
      } finally {
        if (!cancelled) {
          setLoadingQuestionDetail(false);
        }
      }
    };

    loadQuestionDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedQuestion]);

  useEffect(() => {
    if (selectedQuestion) {
      setScopeQuestionDetails([]);
      setLoadingScopeContent(false);
      return;
    }
    if (!selectedPart) {
      setScopeQuestionDetails([]);
      setLoadingScopeContent(false);
      return;
    }
    if (loadingSections || loadingChapters || loadingQuestions) {
      setScopeQuestionDetails([]);
      setLoadingScopeContent(false);
      return;
    }

    let cancelled = false;

    const loadScopeContent = async () => {
      setLoadingScopeContent(true);

      try {
        const questionIds: number[] = [];

        if (selectedPart && !selectedSection) {
          // Part only: all questions in all sections and chapters of this part
          for (const section of sections) {
            const sectionChapters = await fetchYcChaptersBySectionId(section.id);
            if (cancelled) return;
            for (const ch of sectionChapters) {
              const chQuestions = await fetchYcQuestionsByChapterId(ch.id);
              if (cancelled) return;
              questionIds.push(...chQuestions.map((q) => q.id));
            }
          }
        } else if (selectedSection && !selectedChapter) {
          // Part + Section: all questions in all chapters of this section
          for (const ch of chapters) {
            const chQuestions = await fetchYcQuestionsByChapterId(ch.id);
            if (cancelled) return;
            questionIds.push(...chQuestions.map((q) => q.id));
          }
        } else if (selectedChapter) {
          // Part + Section + Chapter: all questions in this chapter
          questionIds.push(...questions.map((q) => q.id));
        }

        if (cancelled || questionIds.length === 0) {
          if (!cancelled) {
            setScopeQuestionDetails([]);
          }
          return;
        }

        const details = await Promise.all(
          questionIds.map((id) => fetchYcQuestionDetail(id))
        );
        if (cancelled) return;
        setScopeQuestionDetails(
          details.filter((d): d is YcQuestionDetail => d != null)
        );
      } finally {
        if (!cancelled) {
          setLoadingScopeContent(false);
        }
      }
    };

    loadScopeContent();
    return () => {
      cancelled = true;
    };
  }, [
    selectedPart,
    selectedSection,
    selectedChapter,
    selectedQuestion,
    sections,
    chapters,
    questions,
    loadingSections,
    loadingChapters,
    loadingQuestions,
  ]);

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/learn">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Learn
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Explore YOUCAT</h1>
          <p className="text-muted-foreground">
            Select a Part, Section, Chapter, and optionally a Question to view the content
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card className="p-6 sticky top-20">
              <h2 className="text-lg font-display font-bold mb-4">Navigation</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2 block">
                    Part
                  </label>
                  {loadingParts ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select
                      value={selectedPart?.id.toString() ?? ''}
                      onValueChange={(val) => {
                        const part = parts.find((p) => p.id.toString() === val) ?? null;
                        setSelectedPart(part);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Part" />
                      </SelectTrigger>
                      <SelectContent>
                        {parts.map((part) => (
                          <SelectItem key={part.id} value={part.id.toString()}>
                            Part {part.part_number}: {part.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                {selectedPart && (
                  <div>
                    <label className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2 block">
                      Section
                    </label>
                    {loadingSections ? (
                      <Skeleton className="h-10 w-full" />
                    ) : sections.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No sections in this part</p>
                    ) : (
                      <Select
                        value={selectedSection?.id.toString() ?? ''}
                        onValueChange={(val) => {
                          const section =
                            sections.find((s) => s.id.toString() === val) ?? null;
                          setSelectedSection(section);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Section" />
                        </SelectTrigger>
                        <SelectContent>
                          {sections.map((section) => (
                            <SelectItem key={section.id} value={section.id.toString()}>
                              {section.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}

                {selectedSection && (
                  <div>
                    <label className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2 block">
                      Chapter
                    </label>
                    {loadingChapters ? (
                      <Skeleton className="h-10 w-full" />
                    ) : chapters.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No chapters in this section</p>
                    ) : (
                      <Select
                        value={selectedChapter?.id.toString() ?? ''}
                        onValueChange={(val) => {
                          const chapter =
                            chapters.find((c) => c.id.toString() === val) ?? null;
                          setSelectedChapter(chapter);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          {chapters.map((chapter) => (
                            <SelectItem key={chapter.id} value={chapter.id.toString()}>
                              {chapter.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}

                {selectedChapter && (
                  <div>
                    <label className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2 block">
                      Question
                    </label>
                    {loadingQuestions ? (
                      <Skeleton className="h-10 w-full" />
                    ) : questions.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No questions in this chapter</p>
                    ) : (
                      <Select
                        value={selectedQuestion ? selectedQuestion.id.toString() : '__none__'}
                        onValueChange={(val) => {
                          if (val === '__none__') {
                            setSelectedQuestion(null);
                            return;
                          }
                          const question =
                            questions.find((q) => q.id.toString() === val) ?? null;
                          setSelectedQuestion(question);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Question (optional)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">None</SelectItem>
                          {questions.map((q) => (
                            <SelectItem key={q.id} value={q.id.toString()}>
                              Q{q.question_number}: {q.question_text.slice(0, 50)}
                              {q.question_text.length > 50 ? '...' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-8">
            {!selectedPart && (
              <Card className="p-8 lg:p-12 text-center text-muted-foreground">
                Select a Part to see content.
              </Card>
            )}

            {selectedPart && !selectedQuestion && (
              <>
                <div className="mb-4">
                  <h2 className="text-2xl font-display font-bold">
                    Part {selectedPart.part_number}: {selectedPart.title}
                  </h2>
                  {selectedSection && (
                    <p className="text-muted-foreground mt-1">
                      {selectedSection.title}
                      {selectedChapter && ` → ${selectedChapter.title}`}
                    </p>
                  )}
                </div>
                {loadingScopeContent ? (
                  <div className="space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                  </div>
                ) : scopeQuestionDetails.length === 0 ? (
                  <Card className="p-8 lg:p-12 text-center text-muted-foreground">
                    {selectedPart && !selectedSection && sections.length === 0 && !loadingSections
                      ? 'No sections in this part.'
                      : selectedSection && selectedChapter === null && chapters.length === 0 && !loadingChapters
                        ? 'No chapters in this section.'
                        : selectedChapter && questions.length === 0 && !loadingQuestions
                          ? 'No questions in this chapter.'
                          : 'No content in this selection.'}
                  </Card>
                ) : (
                  <div className="space-y-8">
                    {scopeQuestionDetails.map((detail) => (
                      <YcQuestionDetailView
                        key={detail.id}
                        question={detail}
                        showOpenFullPage={true}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {selectedPart && selectedSection && selectedChapter && selectedQuestion && (
              <>
                <div className="mb-4">
                  <h2 className="text-xl font-display font-bold">
                    Part {selectedPart.part_number}: {selectedPart.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {selectedSection.title} → {selectedChapter.title}
                  </p>
                </div>
                {loadingQuestionDetail ? (
                  <Skeleton className="h-96 w-full" />
                ) : questionDetail ? (
                  <YcQuestionDetailView question={questionDetail} showOpenFullPage={true} />
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    Could not load question details.
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
