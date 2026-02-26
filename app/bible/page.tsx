'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Search, Bookmark } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const bibleBooks = [
  { name: 'John', testament: 'New Testament' },
  { name: 'Genesis', testament: 'Old Testament' },
  { name: 'Psalms', testament: 'Old Testament' },
  { name: 'Matthew', testament: 'New Testament' },
  { name: 'Romans', testament: 'New Testament' },
];

export default function BiblePage() {
  const [selectedBook, setSelectedBook] = useState('John');
  const [selectedChapter, setSelectedChapter] = useState('1');

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Bible</h1>
          <p className="text-muted-foreground">
            Read and reflect on Sacred Scripture
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Select value={selectedBook} onValueChange={setSelectedBook}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select book" />
                  </SelectTrigger>
                  <SelectContent>
                    {bibleBooks.map((book) => (
                      <SelectItem key={book.name} value={book.name}>
                        {book.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedChapter} onValueChange={setSelectedChapter}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((ch) => (
                      <SelectItem key={ch} value={ch.toString()}>
                        Chapter {ch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-sm text-mustard uppercase tracking-wider font-semibold mb-3">
                  Gospel of John
                </h2>
                <h1 className="text-3xl font-display font-bold mb-6">
                  The Word Became Flesh
                </h1>
              </div>

              <div className="prose prose-invert prose-lg max-w-none">
                <p className="leading-relaxed">
                  <sup className="text-mustard font-semibold">1</sup> In the beginning was the Word, and the Word was with God, and the Word was God. <sup className="text-mustard font-semibold">2</sup> He was with God in the beginning.
                </p>
                <p className="leading-relaxed">
                  <sup className="text-mustard font-semibold">3</sup> Through him all things were made; without him nothing was made that has been made. <sup className="text-mustard font-semibold">4</sup> In him was life, and that life was the light of all mankind. <sup className="text-mustard font-semibold">5</sup> The light shines in the darkness, and the darkness has not overcome it.
                </p>
                <p className="leading-relaxed">
                  <sup className="text-mustard font-semibold">6</sup> There was a man sent from God whose name was John. <sup className="text-mustard font-semibold">7</sup> He came as a witness to testify concerning that light, so that through him all might believe. <sup className="text-mustard font-semibold">8</sup> He himself was not the light; he came only as a witness to the light.
                </p>
              </div>

              <div className="flex gap-3 pt-6 border-t border-border">
                <Button variant="outline" className="flex-1">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark
                </Button>
                <Button variant="outline" className="flex-1">
                  Add Note
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-mustard mb-3 uppercase tracking-wider">
                Cross References
              </h3>
              <div className="space-y-2 text-sm">
                <button className="text-left hover:text-mustard transition-colors block">
                  Genesis 1:1 - In the beginning God created...
                </button>
                <button className="text-left hover:text-mustard transition-colors block">
                  1 John 1:1 - That which was from the beginning...
                </button>
                <button className="text-left hover:text-mustard transition-colors block">
                  Revelation 19:13 - ...and his name is the Word of God
                </button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-mustard mb-3 uppercase tracking-wider">
                Historical Context
              </h3>
              <p className="text-sm text-muted-foreground">
                The Gospel of John was written around 90-100 AD, making it the last of the four Gospels to be composed.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-semibold text-mustard mb-3 uppercase tracking-wider">
                Translation
              </h3>
              <Select defaultValue="niv">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="niv">New International Version</SelectItem>
                  <SelectItem value="nrsv">NRSV Catholic Edition</SelectItem>
                  <SelectItem value="douay">Douay-Rheims</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
