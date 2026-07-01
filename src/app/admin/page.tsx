'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card, { CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Table, { TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { CardSkeleton } from '@/components/ui/skeleton';

const ADMIN_KEY = 'admin-secret-key-2026';

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
  image_url: string;
  created_at: string;
}

function getStatus(product: Product) {
  if (product.stock === 0) return { label: 'Out of Stock', variant: 'danger' as const };
  if (product.stock <= 5) return { label: 'Low Stock', variant: 'warning' as const };
  return { label: 'Active', variant: 'success' as const };
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products', { headers: { 'X-API-Key': ADMIN_KEY } })
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: products.length,
    categories: new Set(products.map((p) => p.category).filter(Boolean)).size,
    stock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
    value: products.reduce((sum, p) => sum + (Number(p.price) * (p.stock || 0)), 0),
    outOfStock: products.filter((p) => p.stock === 0).length,
    lowStock: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
  };

  const statCards = [
    { label: 'Total Products', value: stats.total, icon: '📦', bg: 'bg-[#eff6ff]', iconColor: 'text-[#2563eb]', sub: '+0 this month' },
    { label: 'Categories', value: stats.categories, icon: '🏷️', bg: 'bg-[#f0fdf4]', iconColor: 'text-[#16a34a]', sub: `${stats.categories} active` },
    { label: 'Total Stock', value: stats.stock, icon: '📊', bg: 'bg-[#fffbeb]', iconColor: 'text-[#d97706]', sub: `${stats.outOfStock} out of stock` },
    { label: 'Inventory Value', value: `PKR ${stats.value.toLocaleString()}`, icon: '💰', bg: 'bg-[#fdf4ff]', iconColor: 'text-[#9333ea]', sub: `${stats.lowStock} low stock` },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Dashboard</h1>
        <p className="text-sm text-[#6b7280] mt-1">Welcome back. Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="p-0"><div className="p-6"><CardSkeleton /></div></CardContent></Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat) => (
            <Card key={stat.label} hover>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#6b7280] uppercase tracking-wider">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#111827] tracking-tight">{stat.value}</p>
                    <p className="text-xs text-[#9ca3af]">{stat.sub}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center text-xl`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-[#111827] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/admin/products" className="group">
            <Card hover>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#2563eb] flex items-center justify-center text-white group-hover:bg-[#1d4ed8] transition-colors shadow-sm">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Add Product</p>
                    <p className="text-xs text-[#9ca3af]">Create a new product</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin/products" className="group">
            <Card hover>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-[#4b5563] group-hover:bg-[#e5e7eb] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Manage Products</p>
                    <p className="text-xs text-[#9ca3af]">Edit existing products</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/products" className="group">
            <Card hover>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-[#4b5563] group-hover:bg-[#e5e7eb] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">View Store</p>
                    <p className="text-xs text-[#9ca3af]">Preview your store</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/admin" className="group">
            <Card hover>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-[#4b5563] group-hover:bg-[#e5e7eb] transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.32 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">Settings</p>
                    <p className="text-xs text-[#9ca3af]">Configure your store</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <Card>
        <div className="px-6 py-5 border-b border-[#f3f4f6] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#111827]">Recent Products</h2>
            <p className="text-xs text-[#9ca3af] mt-0.5">Latest additions to your store</p>
          </div>
          <Link href="/admin/products">
            <Button variant="ghost" size="sm">View all</Button>
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 skeleton rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 skeleton rounded-lg w-1/3" />
                  <div className="h-3 skeleton rounded-lg w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#f3f4f6] flex items-center justify-center text-2xl mx-auto mb-4">📦</div>
            <p className="text-sm font-medium text-[#111827]">No products yet</p>
            <p className="text-xs text-[#9ca3af] mt-1">Get started by adding your first product.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
            </TableHeader>
            <TableBody>
              {products.slice(0, 5).map((p) => {
                const status = getStatus(p);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-[#f3f4f6] overflow-hidden flex-shrink-0 border border-[#e5e7eb]">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#d1d5db] text-xs">—</div>
                          )}
                        </div>
                        <span className="font-medium text-[#111827]">{p.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[#6b7280]">{p.category || '—'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold text-[#111827]">PKR {Number(p.price).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className={p.stock <= 5 ? 'text-[#d97706] font-semibold' : 'text-[#6b7280]'}>{p.stock}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} dot>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
