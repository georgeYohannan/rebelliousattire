'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { buildYoucatUrl, truncateText } from '@/lib/youcat/utils';
import {
  YoucatPart,
  YoucatSection,
  YoucatChapter,
  YoucatQuestion,
} from '@/lib/youcat/types';

type Props = {
  initialPart?: number;
  initialSection?: number;
  initialChapter?: number;
  initialQuestion?: number;
};

export function YoucatNavigator({
  initialPart,
  initialSection,
  initialChapter,
  initialQuestion,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [parts, setParts] = useState<YoucatPart[]>([]);
  const [sections, setSections] = useState<YoucatSection[]>([]);
  const [chapters, setChapters] = useState<YoucatChapter[]>([]);
  const [questions, setQuestions] = useState<YoucatQuestion[]>([]);

  const [selectedPartId, setSelectedPartId] = useState<string>('');
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');

  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    loadParts();
  }, []);

  useEffect(() => {
    if (selectedPartId) {
      loadSections(selectedPartId);
    }
  }, [selectedPartId]);

  useEffect(() => {
    if (selectedSectionId) {
      loadChapters(selectedSectionId);
    }
  }, [selectedSectionId]);

  useEffect(() => {
    if (selectedChapterId) {
      loadQuestions(selectedChapterId);
    }
  }, [selectedChapterId]);

  async function loadParts() {
    setLoading(true);
    const { data } = await supabase
      .from('youcat_parts')
      .select('*')
      .order('order_index', { ascending: true });

    if (data && data.length > 0) {
      setParts(data);

      if (initialPart) {
        const part = data.find((p) => p.number === initialPart);
        if (part) setSelectedPartId(part.id);
      } else {
        setSelectedPartId(data[0].id);
      }
    }
    setLoading(false);
  }

  async function loadSections(partId: string) {
    const { data } = await supabase
      .from('youcat_sections')
      .select('*')
      .eq('part_id', partId)
      .order('order_index', { ascending: true });

    if (data && data.length > 0) {
      setSections(data);

      if (initialSection && selectedPartId === partId) {
        const section = data.find((s) => s.number === initialSection);
        if (section) {
          setSelectedSectionId(section.id);
          return;
        }
      }
      setSelectedSectionId(data[0].id);
    } else {
      setSections([]);
      setSelectedSectionId('');
    }
  }

  async function loadChapters(sectionId: string) {
    const { data } = await supabase
      .from('youcat_chapters')
      .select('*')
      .eq('section_id', sectionId)
      .order('order_index', { ascending: true });

    if (data && data.length > 0) {
      setChapters(data);

      if (initialChapter && selectedSectionId === sectionId) {
        const chapter = data.find((c) => c.number === initialChapter);
        if (chapter) {
          setSelectedChapterId(chapter.id);
          return;
        }
      }
      setSelectedChapterId(data[0].id);
    } else {
      setChapters([]);
      setSelectedChapterId('');
    }
  }

  async function loadQuestions(chapterId: string) {
    const { data } = await supabase
      .from('youcat_questions')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('order_index', { ascending: true });

    if (data && data.length > 0) {
      setQuestions(data);

      if (initialQuestion && selectedChapterId === chapterId) {
        const question = data.find((q) => q.q_number === initialQuestion);
        if (question) {
          setSelectedQuestionId(question.id);
        }
      }
    } else {
      setQuestions([]);
      setSelectedQuestionId('');
    }
  }

  function handlePartChange(partId: string) {
    setSelectedPartId(partId);
    setSelectedSectionId('');
    setSelectedChapterId('');
    setSelectedQuestionId('');
    setQuestions([]);

    const part = parts.find((p) => p.id === partId);
    if (part) {
      router.push(buildYoucatUrl({ part: part.number }));
    }
  }

  function handleSectionChange(sectionId: string) {
    setSelectedSectionId(sectionId);
    setSelectedChapterId('');
    setSelectedQuestionId('');
    setQuestions([]);

    const part = parts.find((p) => p.id === selectedPartId);
    const section = sections.find((s) => s.id === sectionId);
    if (part && section) {
      router.push(buildYoucatUrl({ part: part.number, section: section.number }));
    }
  }

  function handleChapterChange(chapterId: string) {
    setSelectedChapterId(chapterId);
    setSelectedQuestionId('');

    const part = parts.find((p) => p.id === selectedPartId);
    const section = sections.find((s) => s.id === selectedSectionId);
    const chapter = chapters.find((c) => c.id === chapterId);
    if (part && section && chapter) {
      router.push(
        buildYoucatUrl({
          part: part.number,
          section: section.number,
          chapter: chapter.number,
        })
      );
    }
  }

  function handleQuestionSelect(question: YoucatQuestion) {
    setSelectedQuestionId(question.id);
    const part = parts.find((p) => p.id === selectedPartId);
    const section = sections.find((s) => s.id === selectedSectionId);
    const chapter = chapters.find((c) => c.id === selectedChapterId);

    if (part && section && chapter) {
      router.push(
        buildYoucatUrl({
          part: part.number,
          section: section.number,
          chapter: chapter.number,
          question: question.q_number,
        })
      );
    }

    setMobileOpen(false);

    setTimeout(() => {
      const element = document.getElementById(`question-${question.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  const NavigatorContent = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2 block">
          Part
        </label>
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <Select value={selectedPartId} onValueChange={handlePartChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Part" />
            </SelectTrigger>
            <SelectContent>
              {parts.map((part) => (
                <SelectItem key={part.id} value={part.id}>
                  Part {part.number}: {part.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {sections.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2 block">
            Section
          </label>
          <Select value={selectedSectionId} onValueChange={handleSectionChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Section" />
            </SelectTrigger>
            <SelectContent>
              {sections.map((section) => (
                <SelectItem key={section.id} value={section.id}>
                  Section {section.number}: {section.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {chapters.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2 block">
            Chapter
          </label>
          <Select value={selectedChapterId} onValueChange={handleChapterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Chapter" />
            </SelectTrigger>
            <SelectContent>
              {chapters.map((chapter) => (
                <SelectItem key={chapter.id} value={chapter.id}>
                  Chapter {chapter.number}: {chapter.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {questions.length > 0 && (
        <div>
          <label className="text-sm font-semibold text-mustard uppercase tracking-wider mb-2 block">
            Questions
          </label>
          <ScrollArea className="h-[400px] lg:h-[500px] border border-border rounded-md">
            <div className="p-2 space-y-1">
              {questions.map((question) => (
                <Button
                  key={question.id}
                  variant={selectedQuestionId === question.id ? 'default' : 'ghost'}
                  className={`w-full justify-start text-left h-auto py-3 ${
                    selectedQuestionId === question.id
                      ? 'bg-mustard text-navy hover:bg-mustard/90'
                      : ''
                  }`}
                  onClick={() => handleQuestionSelect(question)}
                >
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="font-semibold">Q{question.q_number}</div>
                    <div className="text-xs opacity-90 line-clamp-2">
                      {truncateText(question.question_text, 80)}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full">
              <Menu className="h-4 w-4 mr-2" />
              Browse YOUCAT
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] overflow-y-auto">
            <div className="py-4">
              <h2 className="text-lg font-display font-bold mb-4">Navigation</h2>
              <NavigatorContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden lg:block">
        <Card className="p-6 sticky top-20">
          <h2 className="text-lg font-display font-bold mb-4">Navigation</h2>
          <NavigatorContent />
        </Card>
      </div>
    </>
  );
}
