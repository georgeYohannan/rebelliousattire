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
            <TabsTrigger value="youcat" asChild>
              <Link href="/learn/youcat/explore">YOUCAT</Link>
            </TabsTrigger>
            <TabsTrigger value="ccc" asChild>
              <Link href="/learn/ccc/explore">Catechism (CCC)</Link>
            </TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
          </TabsList>

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
