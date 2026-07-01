'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-neutral-900 text-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-8">
          <span className="font-bold text-lg tracking-wide">J. Admin</span>
          <div className="flex gap-1">
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-md text-sm transition ${
                path === '/admin' ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/products"
              className={`px-4 py-2 rounded-md text-sm transition ${
                path.startsWith('/admin/products') ? 'bg-neutral-700 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              Products
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
