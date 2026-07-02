'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminSidebar from '@/components/admin-sidebar';
import { SidebarProvider, useSidebar } from '@/components/sidebar-context';
import { ToastProvider } from '@/components/ui/toast';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile();
    };
    if (mobileOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [mobileOpen, closeMobile]);

  const NAV_ITEMS = [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Products', href: '/admin/products' },
  ];

  const sidebarWidth = isDesktop ? (collapsed ? 80 : 260) : 0;

  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <AdminSidebar />

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-white border-b border-[#e5e7eb] flex items-center px-4 gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#374151] hover:bg-[#f3f4f6] transition-colors"
          aria-label="Open navigation menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#2563eb] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">J.</span>
          </div>
          <span className="text-sm font-semibold text-[#111827]">Admin</span>
        </Link>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <aside className="absolute left-0 top-0 h-full w-[280px] bg-white shadow-[4px_0_24px_rgba(0,0,0,0.12)] flex flex-col animate-slide-in-left">
            <div className="px-4 h-16 flex items-center border-b border-[#f3f4f6] gap-3">
              <Link href="/admin" className="flex items-center gap-3" onClick={closeMobile}>
                <div className="w-9 h-9 bg-[#2563eb] rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">J.</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-[#111827]">Admin</span>
                  <span className="block text-[10px] text-[#9ca3af] font-medium">Dashboard</span>
                </div>
              </Link>
              <button
                onClick={closeMobile}
                className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#374151] transition-colors"
                aria-label="Close navigation menu"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
              <p className="px-3 mb-2 text-[10px] font-semibold text-[#9ca3af] uppercase tracking-widest">Main Menu</p>
              {NAV_ITEMS.map((item) => {
                const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={closeMobile}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active ? 'bg-[#eff6ff] text-[#2563eb]' : 'text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827]'
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="px-3 py-4 border-t border-[#f3f4f6]">
              <Link
                href="/"
                onClick={closeMobile}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6b7280] hover:bg-[#f9fafb] hover:text-[#111827] transition-all duration-200"
              >
                <span>View Store</span>
              </Link>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div
        className="min-h-screen transition-[margin-left] duration-250"
        style={{ marginLeft: sidebarWidth }}
      >
        <main className="p-4 sm:p-6 lg:p-8 pt-[72px] lg:pt-8 max-w-[1200px]">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SidebarProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </SidebarProvider>
    </ToastProvider>
  );
}
