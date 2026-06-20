'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserButton, useUser } from '@clerk/nextjs';

const navItems = [
  { label: 'Overview', href: '/app', icon: '◉' },
  { label: 'Projects', href: '/projects', icon: '📋' },
  { label: 'Clients', href: '/clients', icon: '👥' },
  { label: 'Products', href: '/products', icon: '🛋️' },
  { label: 'Orders', href: '/orders', icon: '📦' },
  { label: 'Mood Boards', href: '/moodboards', icon: '🎨' },
  { label: 'Style Quiz', href: '/style-assessment', icon: '✧' },
  { label: 'Invoices', href: '/invoices', icon: '📄' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <aside className="w-64 h-screen border-r border-slate-100 bg-white flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-slate-100">
        <Link href="/app" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-wood-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-serif font-bold text-sm">S</span>
          </div>
          <span className="font-serif text-lg font-medium text-slate-900">Spatial</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/app'
            ? pathname === '/app'
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-wood-50 text-wood-700 border border-wood-100'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <UserButton afterSignOutUrl="/" />
            <div>
              <p className="text-sm font-medium text-slate-800 truncate max-w-[140px]">
                {user?.fullName || 'Designer'}
              </p>
              <p className="text-xs text-slate-400">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}