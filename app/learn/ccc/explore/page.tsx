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
  fetchCccParts,
  fetchCccSectionsByPartId,
  fetchCccChaptersBySectionId,
  fetchCccArticlesByChapterId,
  fetchCccParagraphsByScope,
  type CccPart,
  type CccSection,
  type CccChapter,
  type CccArticle,
  type CccParagraph,
} from '@/lib/ccc/ccc-queries';
import { CccBookReader } from '@/components/ccc/CccBookReader';

export default function CccExplorePage() {
  const [parts, setParts] = useState<CccPart[]>([]);
  const [sections, setSections] = useState<CccSection[]>([]);
  const [chapters, setChapters] = useState<CccChapter[]>([]);
  const [articles, setArticles] = useState<CccArticle[]>([]);

  const [selectedPart, setSelectedPart] = useState<CccPart | null>(null);
  const [selectedSection, setSelectedSection] = useState<CccSection | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<CccChapter | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<CccArticle | null>(null);
  const [selectedParagraph, setSelectedParagraph] = useState<CccParagraph | null>(null);

  const [paragraphs, setParagraphs] = useState<CccParagraph[]>([]);

  const [loadingParts, setLoadingParts] = useState(true);
  const [loadingSections, setLoadingSections] = useState(false);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [loadingParagraphs, setLoadingParagraphs] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchCccParts();
        if (cancelled) return;
        setParts(data);
        if (data.length > 0 && !cancelled) {
          setSelectedPart(data[0]);
        }
      } finally {
        if (!cancelled) setLoadingParts(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedPart) {
      setSections([]);
      setSelectedSection(null);
      setSelectedChapter(null);
      setSelectedArticle(null);
      setSelectedParagraph(null);
      setChapters([]);
      setArticles([]);
      setLoadingSections(false);
      return;
    }
    let cancelled = false;
    setLoadingSections(true);
    setSelectedSection(null);
    setSelectedChapter(null);
    setSelectedArticle(null);
    setSelectedParagraph(null);
    setChapters([]);
    setArticles([]);
    const load = async () => {
      try {
        const data = await fetchCccSectionsByPartId(selectedPart.id);
        if (cancelled) return;
        setSections(data);
      } finally {
        if (!cancelled) setLoadingSections(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedPart]);

  useEffect(() => {
    if (!selectedSection) {
      setChapters([]);
      setSelectedChapter(null);
      setSelectedArticle(null);
      setSelectedParagraph(null);
      setArticles([]);
      setLoadingChapters(false);
      return;
    }
    let cancelled = false;
    setLoadingChapters(true);
    setSelectedChapter(null);
    setSelectedArticle(null);
    setSelectedParagraph(null);
    setArticles([]);
    const load = async () => {
      try {
        const data = await fetchCccChaptersBySectionId(selectedSection.id);
        if (cancelled) return;
        setChapters(data);
      } finally {
        if (!cancelled) setLoadingChapters(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedSection]);

  useEffect(() => {
    if (!selectedChapter) {
      setArticles([]);
      setSelectedArticle(null);
      setSelectedParagraph(null);
      setLoadingArticles(false);
      return;
    }
    let cancelled = false;
    setLoadingArticles(true);
    setSelectedArticle(null);
    setSelectedParagraph(null);
    const load = async () => {
      try {
        const data = await fetchCccArticlesByChapterId(selectedChapter.id);
        if (cancelled) return;
        setArticles(data);
      } finally {
        if (!cancelled) setLoadingArticles(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedChapter]);

  useEffect(() => {
    setSelectedParagraph(null);
  }, [selectedArticle]);

  useEffect(() => {
    if (!selectedPart) {
      setParagraphs([]);
      setLoadingParagraphs(false);
      return;
    }
    let cancelled = false;
    setLoadingParagraphs(true);
    const scope = {
      partId: selectedPart.id,
      sectionId: selectedSection?.id,
      chapterId: selectedChapter?.id,
      articleId: selectedArticle?.id,
    };
    const load = async () => {
      try {
        const data = await fetchCccParagraphsByScope(scope);
        if (cancelled) return;
        setParagraphs(data);
      } finally {
        if (!cancelled) setLoadingParagraphs(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [
    selectedPart,
    selectedSection,
    selectedChapter,
    selectedArticle,
  ]);

  const paragraphInitialIndex =
    selectedParagraph && paragraphs.length > 0
      ? Math.max(0, paragraphs.findIndex((p) => p.id === selectedParagraph.id))
      : 0;

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
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">
            Catechism of the Catholic Church
          </h1>
          <p className="text-muted-foreground">
            Read below. Use the sidebar to jump to a Part, Section, Chapter, Article, or Paragraph. Use arrow keys to turn pages.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card className="p-6 sticky top-20">
              <h2 className="text-lg font-display font-bold mb-4">Jump to section</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2 block">
                    Part
                  </label>
                  {loadingParts ? (
                    <Skeleton className="h-10 w-full" />
                  ) : parts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No parts loaded. Check that <code className="text-xs bg-muted px-1 rounded">ccc_parts</code> has data and RLS allows read.
                    </p>
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
                            Part {part.number}: {part.title}
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
                      Article
                    </label>
                    {loadingArticles ? (
                      <Skeleton className="h-10 w-full" />
                    ) : articles.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No articles in this chapter</p>
                    ) : (
                      <Select
                        value={selectedArticle?.id.toString() ?? ''}
                        onValueChange={(val) => {
                          const article =
                            articles.find((a) => a.id.toString() === val) ?? null;
                          setSelectedArticle(article);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Article" />
                        </SelectTrigger>
                        <SelectContent>
                          {articles.map((article) => (
                            <SelectItem key={article.id} value={article.id.toString()}>
                              {article.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}

                {selectedArticle && paragraphs.length > 0 && (
                  <div>
                    <label className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2 block">
                      Paragraph
                    </label>
                    <Select
                      value={selectedParagraph?.id.toString() ?? '__all__'}
                      onValueChange={(val) => {
                        if (val === '__all__') {
                          setSelectedParagraph(null);
                          return;
                        }
                        const p = paragraphs.find((x) => x.id.toString() === val) ?? null;
                        setSelectedParagraph(p);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Paragraph" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">All in scope</SelectItem>
                        {paragraphs.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            Paragraph {p.paragraph_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

            {selectedPart && loadingParagraphs && (
              <div className="space-y-4">
                <Skeleton className="h-64 w-full" />
              </div>
            )}

            {selectedPart && !loadingParagraphs && (
              <>
                <div className="mb-4">
                  <h2 className="text-2xl font-display font-bold">
                    Part {selectedPart.number}: {selectedPart.title}
                  </h2>
                  {(selectedSection || selectedChapter) && (
                    <p className="text-muted-foreground mt-1">
                      {selectedSection?.title}
                      {selectedChapter && ` → ${selectedChapter.title}`}
                      {selectedArticle && ` → ${selectedArticle.title}`}
                      {selectedParagraph && ` → Paragraph ${selectedParagraph.paragraph_number}`}
                    </p>
                  )}
                </div>
                <CccBookReader
                  paragraphs={paragraphs}
                  initialIndex={selectedParagraph ? paragraphInitialIndex : 0}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
