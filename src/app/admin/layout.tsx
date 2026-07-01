'use client';

import AdminSidebar from '@/components/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f9fafb]">
      <AdminSidebar />
      <div className="ml-[260px] min-h-screen">
        <main className="p-8 max-w-[1200px]">{children}</main>
      </div>
    </div>
  );
}
