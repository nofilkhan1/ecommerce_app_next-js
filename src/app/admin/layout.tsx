'use client';

import AdminSidebar from '@/components/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <AdminSidebar />
      <div className="ml-[260px]">
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
