'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <nav className="bg-[#111] text-white sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 flex items-center h-14 gap-8">
          <Link href="/admin" className="font-bold text-lg tracking-wide">
            J. Admin
          </Link>
          <div className="flex gap-1">
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-md text-sm transition ${
                path === '/admin'
                  ? 'bg-[#333] text-white'
                  : 'text-[#aaa] hover:bg-[#222] hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`px-4 py-2 rounded-md text-sm transition ${
                path.startsWith('/admin/products')
                  ? 'bg-[#333] text-white'
                  : 'text-[#aaa] hover:bg-[#222] hover:text-white'
              }`}
            >
              Products
            </Link>
          </div>
          <div className="ml-auto">
            <Link
              href="/"
              className="text-[#aaa] text-sm hover:text-white transition"
            >
              View Store
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-[1200px] mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
