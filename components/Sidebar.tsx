'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookHeart, BookOpen, Book, Settings } from 'lucide-react';
import Image from 'next/image';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Pray', href: '/pray', icon: BookHeart },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Bible', href: '/bible', icon: Book },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-card border-r border-border">
      <div className="flex flex-col flex-grow pt-8 pb-4 overflow-y-auto">
        <div className="flex items-center justify-center px-4 mb-8">
          <Image
            src="/rebelliousattire_logo.png"
            alt="Rebellious Attire"
            width={180}
            height={60}
            className="h-auto w-40"
          />
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-mustard text-navy'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
