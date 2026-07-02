'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import { useSidebar } from './sidebar-context';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    label: 'Products',
    href: '/admin/products',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
        <line x1="7" y1="7" x2="7.01" y2="7" />
      </svg>
    ),
  },
  {
    label: 'Categories',
    href: '/admin',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    label: 'Orders',
    href: '/admin',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    label: 'Customers',
    href: '/admin',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/admin',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { collapsed, toggleCollapsed } = useSidebar();

  const isActive = (item: typeof NAV_ITEMS[0]) => {
    if (item.href === '/admin' && item.label === 'Dashboard') return pathname === '/admin';
    if (item.label === 'Products') return pathname.startsWith('/admin/products');
    return false;
  };

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 bottom-0 bg-white border-r border-[#e5e7eb] flex-col z-40"
      style={{ width: collapsed ? 80 : 260, transition: 'width 0.25s ease' }}
    >
      {/* Logo + Toggle */}
      <div className="px-4 h-16 flex items-center border-b border-[#f3f4f6] gap-3">
        <Link href="/admin" className="flex items-center gap-3 overflow-hidden flex-shrink-0">
          <div className="w-9 h-9 bg-[#2563eb] rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
            <span className="text-white text-sm font-bold">J.</span>
          </div>
          {!collapsed && (
            <div className="whitespace-nowrap">
              <span className="text-sm font-semibold text-[#111827]">Admin</span>
              <span className="block text-[10px] text-[#9ca3af] font-medium">Dashboard</span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleCollapsed}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151] transition-colors flex-shrink-0 ml-auto"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s ease' }}
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest">Main Menu</p>
        )}
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.label}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                collapsed ? 'justify-center' : ''
              } ${
                active
                  ? 'bg-[#eff6ff] text-[#2563eb]'
                  : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]'
              }`}
            >
              <span className={`flex-shrink-0 ${active ? 'text-[#2563eb]' : 'text-[#9ca3af]'}`}>{item.icon}</span>
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-[#f3f4f6] space-y-1">
        <Link
          href="/"
          title={collapsed ? 'View Store' : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827] transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          {!collapsed && <span className="whitespace-nowrap">View Store</span>}
        </Link>
      </div>
    </aside>
  );
}
