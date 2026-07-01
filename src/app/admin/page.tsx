'use client';

import { useEffect, useState } from 'react';

const ADMIN_KEY = 'admin-secret-key-2026';

interface Product {
  id: number;
  name: string;
  category: string;
  stock: number;
  price: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, categories: 0, stock: 0 });
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/products', { headers: { 'X-API-Key': ADMIN_KEY } })
      .then((res) => res.json())
      .then((products: Product[]) => {
        setStats({
          total: products.length,
          categories: new Set(products.map((p) => p.category).filter(Boolean)).size,
          stock: products.reduce((sum, p) => sum + (p.stock || 0), 0),
        });
      })
      .catch(() => setError(true));
  }, []);

  const cards = [
    { label: 'Total Products', value: error ? 'Err' : stats.total },
    { label: 'Categories', value: error ? 'Err' : stats.categories },
    { label: 'Total Stock', value: error ? 'Err' : stats.stock },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border">
            <p className="text-sm text-neutral-500 uppercase tracking-wide mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-neutral-900">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h3 className="font-semibold mb-4">API Keys</h3>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-medium mr-2">Admin Key:</span>
            <code className="bg-neutral-100 px-2 py-1 rounded text-xs">admin-secret-key-2026</code>
          </div>
          <div>
            <span className="font-medium mr-2">User Key:</span>
            <code className="bg-neutral-100 px-2 py-1 rounded text-xs">user-secret-key-2026</code>
          </div>
          <p className="text-neutral-500 text-xs mt-3">Send key via <code className="bg-neutral-100 px-1 rounded">X-API-Key</code> header.</p>
        </div>
      </div>
    </div>
  );
}
