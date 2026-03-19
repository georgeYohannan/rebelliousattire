'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { VerseOfDay } from '@/components/home/VerseOfDay';
import { DailyPrayer } from '@/components/home/DailyPrayer';
import { YoucatQuestion } from '@/components/home/YoucatQuestion';
import { Skeleton } from '@/components/ui/skeleton';

type ProfileData = {
  name: string;
  role_title: string;
  streak_count: number;
};

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setProfile(data);
        }
      };

      fetchProfile();
    }
  }, [user, supabase]);

  if (loading) {
    return (
      <div className="p-4 lg:p-8 space-y-6">
        <Skeleton className="h-48 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="relative bg-gradient-to-br from-navy-700 via-navy-800 to-navy-900 border-b border-mustard/20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(255, 183, 0) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>
        <div className="relative p-8 lg:p-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-1 bg-mustard rounded-full" />
              <div>
                <p className="text-sm text-mustard uppercase tracking-widest font-semibold">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-xs text-gray-400">
                  {profile?.role_title || 'Faith Warrior'} • {profile?.streak_count || 0} day streak 🔥
                </p>
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-bold mb-4 text-white">
              Welcome back,<br />
              <span className="text-mustard">{profile?.name || user.email?.split('@')[0] || 'Friend'}</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl">
              Continue your journey of faith with prayer, scripture, and study.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-8 space-y-8">
        <div className="max-w-6xl mx-auto">
          <VerseOfDay />

          <div className="mt-8">
            <h2 className="text-2xl font-display font-bold mb-4">Today&apos;s Focus</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DailyPrayer />
              <YoucatQuestion />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
