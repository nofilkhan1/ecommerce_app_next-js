'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StorefrontLayout from '../storefront-layout';

const USER_KEY = 'user-secret-key-2026';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

const ALL_CATEGORIES = [
  'SUMMER COLLECTION',
  'CO-ORDS',
  'READY TO WEAR',
  'UNSTITCHED',
  'FORMALS',
  'ACCESSORIES',
];

function ProductGrid() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const url = categoryFilter
      ? `/api/products?category=${encodeURIComponent(categoryFilter)}`
      : '/api/products';
    fetch(url, { headers: { 'X-API-Key': USER_KEY } })
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {});
  }, [categoryFilter]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Page Header */}
      <div className="bg-[#f9fafb] border-b border-[#f3f4f6] py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.05em] text-[#111827]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
          {categoryFilter || 'ALL PRODUCTS'}
        </h1>
        <div className="w-12 h-[2px] bg-[#2563eb] mx-auto mt-3 rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href="/products"
              className={`px-3 py-1.5 text-[11px] font-semibold tracking-[0.05em] border transition rounded-lg ${
                !categoryFilter
                  ? 'bg-[#2563eb] text-white border-[#2563eb]'
                  : 'bg-white text-[#374151] border-[#d1d5db] hover:border-[#2563eb] hover:text-[#2563eb]'
              }`}
            >
              ALL
            </Link>
            {ALL_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className={`px-3 py-1.5 text-[11px] font-semibold tracking-[0.05em] border transition rounded-lg ${
                  categoryFilter === cat
                    ? 'bg-[#2563eb] text-white border-[#2563eb]'
                    : 'bg-white text-[#374151] border-[#d1d5db] hover:border-[#2563eb] hover:text-[#2563eb]'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-[#d1d5db] rounded-xl px-3 py-2 text-sm max-w-[280px] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#2563eb] transition"
          />
        </div>

        {/* Product Count */}
        <p className="text-xs text-[#9ca3af] mb-6">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {products.length === 0 ? (
                  <>
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 01-8 0"/>
                  </>
                ) : (
                  <>
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </>
                )}
              </svg>
            </div>
            <p className="text-[#6b7280] text-sm font-medium">
              {products.length === 0 ? 'Our latest collection will be available shortly.' : 'No products match your search.'}
            </p>
            <p className="text-[#9ca3af] text-xs mt-1">
              {products.length === 0 ? 'Check back soon for new arrivals.' : 'Try adjusting your search criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group bg-white rounded-xl border border-[#f3f4f6] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="aspect-[3/4] bg-[#f3f4f6] overflow-hidden relative">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#d1d5db] text-sm">
                      No Image
                    </div>
                  )}
                  {p.stock === 0 && (
                    <div className="absolute top-2 left-2 bg-[#dc2626] text-white text-[9px] font-bold px-2 py-0.5 tracking-wider rounded-md">
                      OUT OF STOCK
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-[#9ca3af] mb-1 tracking-[0.05em] uppercase">{p.category}</p>
                  <p className="text-sm font-medium text-[#374151] truncate mb-1">{p.name}</p>
                  <p className="text-sm font-bold text-[#111827]">PKR {Number(p.price).toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <StorefrontLayout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center text-[#6b7280] text-sm">
          Loading...
        </div>
      }>
        <ProductGrid />
      </Suspense>
    </StorefrontLayout>
  );
}
