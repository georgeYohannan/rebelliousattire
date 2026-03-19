'use client';

import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Mystery = {
  id: string;
  mystery_type: string;
  name: string;
  order: number;
  description: string;
  scriptural_references: string[];
  recommended_days: string[] | null;
};

const mysteryImages: Record<string, string> = {
  Joyful: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
  Sorrowful: 'https://images.pexels.com/photos/7672246/pexels-photo-7672246.jpeg?auto=compress&cs=tinysrgb&w=800',
  Glorious: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=800',
  Luminous: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const mysteryDescriptions: Record<string, string> = {
  Joyful: 'The Annunciation, The Visitation, The Nativity, The Presentation, The Finding in the Temple.',
  Sorrowful: 'The Agony in the Garden, The Scourging, The Crowning with Thorns, The Carrying of the Cross.',
  Glorious: 'The Resurrection, The Ascension, The Descent of the Holy Spirit, The Assumption.',
  Luminous: 'The Baptism of Jesus, The Wedding at Cana, The Proclamation of the Kingdom, The Transfiguration.',
};

export default function RosaryPage() {
  const [mysteries, setMysteries] = useState<Mystery[]>([]);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    const fetchMysteries = async () => {
      const { data } = await supabase
        .from('rosary_mysteries')
        .select('*')
        .order('order', { ascending: true });

      if (data) {
        setMysteries(data);
      }
    };

    fetchMysteries();
  }, [supabase]);

  const groupedMysteries = mysteries.reduce((acc, mystery) => {
    if (!acc[mystery.mystery_type]) {
      acc[mystery.mystery_type] = [];
    }
    acc[mystery.mystery_type].push(mystery);
    return acc;
  }, {} as Record<string, Mystery[]>);

  const todaysMystery = Object.keys(groupedMysteries).find(type =>
    groupedMysteries[type][0]?.recommended_days?.includes(today)
  );

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pray
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">✨</span>
            <h1 className="text-3xl lg:text-4xl font-display font-bold">Holy Rosary</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            PEACE BE WITH YOU
          </p>
          <h2 className="text-2xl font-display mt-2">Select a Mystery</h2>
        </div>

        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="daily">Daily Recommendation</TabsTrigger>
            <TabsTrigger value="all">All Mysteries</TabsTrigger>
          </TabsList>

          <TabsContent value="daily">
            {todaysMystery && (
              <Card className="relative overflow-hidden hover:border-mustard transition-colors cursor-pointer">
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-mustard text-navy hover:bg-mustard/90">
                    TODAY
                  </Badge>
                </div>
                <div className="aspect-[16/9] relative">
                  <img
                    src={mysteryImages[todaysMystery]}
                    alt={`${todaysMystery} Mysteries`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-display font-bold text-white mb-2">
                      {todaysMystery} Mysteries
                    </h3>
                    <p className="text-sm text-gray-200">
                      {mysteryDescriptions[todaysMystery]}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-3">
                    <Link href={`/pray/rosary/${todaysMystery.toLowerCase()}`}>
                      <Button className="w-full bg-mustard text-navy hover:bg-mustard/90">
                        ▶ Pray Now
                      </Button>
                    </Link>
                    <Link href={`/pray/rosary/${todaysMystery.toLowerCase()}/whole`}>
                      <Button
                        variant="outline"
                        className="w-full hover:border-mustard transition-colors"
                      >
                        ▶ Pray Whole Rosary
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(groupedMysteries).map(([type, typeMysteries]) => {
              const isToday = type === todaysMystery;
              const days = typeMysteries[0]?.recommended_days?.join(' & ') ?? '';

              return (
                <Card className="relative overflow-hidden hover:border-mustard transition-colors cursor-pointer h-full" key={type}>
                  {isToday && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-mustard text-navy hover:bg-mustard/90">
                        TODAY
                      </Badge>
                    </div>
                  )}
                  <div className="aspect-video relative">
                    <img
                      src={mysteryImages[type]}
                      alt={`${type} Mysteries`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-display font-bold text-white">
                        {type} Mysteries
                      </h3>
                      <p className="text-xs text-gray-300 mt-1">{days}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground mb-4">
                      {mysteryDescriptions[type]}
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      <Link href={`/pray/rosary/${type.toLowerCase()}`}>
                        <Button
                          variant={isToday ? "default" : "outline"}
                          className={isToday ? "w-full bg-mustard text-navy hover:bg-mustard/90" : "w-full"}
                        >
                          ▶ Pray Now
                        </Button>
                      </Link>
                      <Link href={`/pray/rosary/${type.toLowerCase()}/whole`}>
                        <Button
                          variant="outline"
                          className="w-full hover:border-mustard transition-colors"
                        >
                          ▶ Pray Whole Rosary
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
