'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ADMIN_KEY = 'admin-secret-key-2026';

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, categories: 0, stock: 0, value: 0 });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/products', { headers: { 'X-API-Key': ADMIN_KEY } })
      .then((res) => res.json())
      .then((products: Product[]) => {
        setStats({
          total: products.length,
          categories: new Set(products.map((p) => p.category).filter(Boolean)).size,
          stock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
          value: products.reduce((sum, p) => sum + (Number(p.price) * (p.stock || 0)), 0),
        });
        setRecentProducts(products.slice(0, 5));
      })
      .catch(() => setError(true));
  }, []);

  const statCards = [
    { label: 'Total Products', value: error ? 'Err' : stats.total, icon: '📦' },
    { label: 'Categories', value: error ? 'Err' : stats.categories, icon: '🏷️' },
    { label: 'Total Stock', value: error ? 'Err' : stats.stock, icon: '📊' },
    { label: 'Inventory Value', value: error ? 'Err' : `PKR ${stats.value.toLocaleString()}`, icon: '💰' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/products"
          className="bg-[#111] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#333] transition"
        >
          Manage Products
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-sm text-[#888] uppercase tracking-wide mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-[#111]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <div className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Recent Products</h3>
            <Link href="/admin/products" className="text-sm text-[#888] hover:text-[#111] transition">
              View All
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <p className="text-[#888] text-sm py-4">No products yet.</p>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#f0f0f0] last:border-0">
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-[#888]">{p.category || 'Uncategorized'}</p>
                  </div>
                  <p className="text-sm font-semibold">PKR {Number(p.price).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* API Keys */}
        <div className="bg-white rounded-xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h3 className="font-semibold mb-4">API Keys</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-[#f0f0f0]">
              <span className="font-medium">Admin Key</span>
              <code className="bg-[#f0f0f0] px-3 py-1 rounded text-xs">admin-secret-key-2026</code>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#f0f0f0]">
              <span className="font-medium">User Key</span>
              <code className="bg-[#f0f0f0] px-3 py-1 rounded text-xs">user-secret-key-2026</code>
            </div>
          </div>
          <p className="text-[#888] text-xs mt-4">
            Send key via <code className="bg-[#f0f0f0] px-1 rounded">X-API-Key</code> header.
          </p>

          <div className="mt-6 pt-4 border-t border-[#f0f0f0]">
            <h4 className="font-medium text-sm mb-2">Quick Actions</h4>
            <div className="flex gap-2">
              <Link
                href="/admin/products"
                className="bg-[#111] text-white px-4 py-2 rounded-lg text-xs font-medium hover:bg-[#333] transition"
              >
                Add Product
              </Link>
              <Link
                href="/products"
                className="bg-[#eee] text-[#222] px-4 py-2 rounded-lg text-xs font-medium hover:bg-[#ddd] transition"
              >
                View Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
