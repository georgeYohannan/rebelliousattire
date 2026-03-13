'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function LearnPage() {

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Learn</h1>
          <p className="text-muted-foreground">
            Deepen your understanding of the Catholic faith
          </p>
        </div>

        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="youcat">YOUCAT</TabsTrigger>
            <TabsTrigger value="ccc">Catechism (CCC)</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>

          <TabsContent value="youcat" className="space-y-4">
            <Card className="p-8 lg:p-12 text-center border-2 border-mustard/20 hover:border-mustard/40 transition-colors">
              <BookOpen className="h-16 w-16 text-mustard mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-display font-semibold mb-3">
                Youth Catechism Questions
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Browse the complete YOUCAT with hierarchical navigation through Parts, Sections, Chapters, and Questions
              </p>
              <Link
                href="/learn/youcat/explore"
                className="inline-block rounded-lg border bg-mustard p-6 text-navy shadow-sm transition-colors hover:bg-mustard/90 cursor-pointer"
              >
                <span className="font-semibold text-lg">Explore YOUCAT</span>
              </Link>
            </Card>
          </TabsContent>

          <TabsContent value="ccc" className="space-y-4">
            <Card className="p-8 lg:p-12 text-center border-2 border-mustard/20 hover:border-mustard/40 transition-colors">
              <BookOpen className="h-16 w-16 text-mustard mx-auto mb-4" />
              <h2 className="text-2xl lg:text-3xl font-display font-semibold mb-3">
                Catechism of the Catholic Church
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Opening the Catechism…
              </p>
              <Link
                href="/learn/ccc/explore"
                className="inline-block rounded-lg border bg-mustard p-6 text-navy shadow-sm transition-colors hover:bg-mustard/90 cursor-pointer"
              >
                <span className="font-semibold text-lg">Open CCC</span>
              </Link>
            </Card>
          </TabsContent>

          <TabsContent value="topics">
            <Card className="p-12 text-center">
              <BookOpen className="h-16 w-16 text-mustard mx-auto mb-4" />
              <h3 className="text-2xl font-display font-semibold mb-2">
                Topics & Themes
              </h3>
              <p className="text-muted-foreground mb-6">
                Coming soon: Explore faith topics organized by theme
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
