'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookHeart, BookOpen, Book, Settings, MessageCircle, Sparkles } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Pray', href: '/pray', icon: BookHeart },
  { name: 'Learn', href: '/learn', icon: BookOpen },
  { name: 'Saints', href: '/saints', icon: Sparkles },
  { name: 'Bible', href: '/bible', icon: Book },
  { name: 'Ask', href: '/ask', icon: MessageCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 transition-colors duration-200">
      <div className="grid grid-cols-7 h-16">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-xs transition-colors ${
                isActive
                  ? 'text-mustard'
                  : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
