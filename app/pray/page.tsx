'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookHeart, Clock, Sun, Moon, Utensils } from 'lucide-react';
import Link from 'next/link';

type Prayer = {
  id: string;
  title: string;
  category: string;
  content: string;
};

const categoryIcons: Record<string, any> = {
  Morning: Sun,
  Evening: Moon,
  Mealtime: Utensils,
  Devotional: BookHeart,
};

export default function PrayPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchPrayers = async () => {
      const { data } = await supabase
        .from('prayers')
        .select('*')
        .order('order', { ascending: true });

      if (data) {
        setPrayers(data);
      }
      setLoading(false);
    };

    fetchPrayers();
  }, [supabase]);

  const groupedPrayers = prayers.reduce((acc, prayer) => {
    if (!acc[prayer.category]) {
      acc[prayer.category] = [];
    }
    acc[prayer.category].push(prayer);
    return acc;
  }, {} as Record<string, Prayer[]>);

  const todayPrayers = prayers.filter(p => p.category === 'Morning' || p.category === 'Evening');

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Pray</h1>
          <p className="text-muted-foreground">
            Grow closer to God through daily prayer and devotion
          </p>
        </div>

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="all">All Prayers</TabsTrigger>
            <TabsTrigger value="rosary">Rosary</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todayPrayers.map((prayer) => {
                const Icon = categoryIcons[prayer.category] || Clock;
                return (
                  <Link key={prayer.id} href={`/pray/${prayer.id}`}>
                    <Card className="p-6 hover:border-mustard transition-colors cursor-pointer h-full">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-mustard/10 rounded-lg text-mustard">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{prayer.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {prayer.content.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            {Object.entries(groupedPrayers).map(([category, categoryPrayers]) => {
              const Icon = categoryIcons[category] || BookHeart;
              return (
                <div key={category}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="h-5 w-5 text-mustard" />
                    <h2 className="text-xl font-display font-semibold">{category}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryPrayers.map((prayer) => (
                      <Link key={prayer.id} href={`/pray/${prayer.id}`}>
                        <Card className="p-4 hover:border-mustard transition-colors cursor-pointer h-full">
                          <h3 className="font-semibold mb-2">{prayer.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {prayer.content.substring(0, 80)}...
                          </p>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="rosary">
            <Link href="/pray/rosary">
              <Card className="p-8 text-center hover:border-mustard transition-colors cursor-pointer">
                <BookHeart className="h-12 w-12 text-mustard mx-auto mb-4" />
                <h3 className="text-2xl font-display font-semibold mb-2">Holy Rosary</h3>
                <p className="text-muted-foreground">
                  Pray the rosary with guided mysteries and meditation
                </p>
              </Card>
            </Link>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
