'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: '', role_title: '' });
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setProfile({ name: data.name, role_title: data.role_title });
        }
      };
      fetchProfile();
    }
  }, [user, supabase]);

  const handleSaveProfile = async () => {
    if (user) {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: profile.name,
          role_title: profile.role_title,
        });
    }
  };

  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your name"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="role">Role Title</Label>
                <Input
                  id="role"
                  value={profile.role_title}
                  onChange={(e) => setProfile({ ...profile, role_title: e.target.value })}
                  placeholder="e.g., Faith Warrior"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-2"
                />
              </div>
              <Button onClick={handleSaveProfile} className="bg-mustard text-navy hover:bg-mustard/90">
                Save Profile
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-verse">Daily Verse</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive verse of the day each morning
                  </p>
                </div>
                <Switch id="daily-verse" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-prayer">Daily Prayer</Label>
                  <p className="text-sm text-muted-foreground">
                    Reminder for daily prayer
                  </p>
                </div>
                <Switch id="daily-prayer" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="youcat-daily">YOUCAT Q&A</Label>
                  <p className="text-sm text-muted-foreground">
                    Daily question from YOUCAT
                  </p>
                </div>
                <Switch id="youcat-daily" defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-display font-semibold mb-4">Reading Preferences</h2>
            <div className="space-y-4">
              <div>
                <Label>Bible Translation</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Preferred translation for Bible reading
                </p>
                <select className="w-full p-2 bg-secondary border border-border rounded-md">
                  <option>New International Version (NIV)</option>
                  <option>NRSV Catholic Edition</option>
                  <option>Douay-Rheims</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
