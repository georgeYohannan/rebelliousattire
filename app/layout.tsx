import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'Rebellious Attire - Pray, Read, Learn',
  description: 'A modern Catholic platform for young adults to grow in faith through prayer, scripture, and teaching.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Sidebar />
              <div className="lg:pl-64">
                <Header />
                <main className="pb-20 lg:pb-8">
                  {children}
                </main>
              </div>
              <MobileNav />
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
