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
      <div className="bg-[#fafafa] border-b border-neutral-100 py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.05em] text-[#111]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
          {categoryFilter || 'ALL PRODUCTS'}
        </h1>
        <div className="w-12 h-[2px] bg-[#111] mx-auto mt-3" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href="/products"
              className={`px-3 py-1.5 text-[11px] font-semibold tracking-[0.05em] border transition ${
                !categoryFilter
                  ? 'bg-[#111] text-white border-[#111]'
                  : 'bg-white text-[#222] border-neutral-200 hover:border-[#111]'
              }`}
            >
              ALL
            </Link>
            {ALL_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${encodeURIComponent(cat)}`}
                className={`px-3 py-1.5 text-[11px] font-semibold tracking-[0.05em] border transition ${
                  categoryFilter === cat
                    ? 'bg-[#111] text-white border-[#111]'
                    : 'bg-white text-[#222] border-neutral-200 hover:border-[#111]'
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
            className="border border-neutral-200 px-3 py-2 text-sm max-w-[280px] focus:outline-none focus:border-[#111] transition"
          />
        </div>

        {/* Product Count */}
        <p className="text-xs text-[#888] mb-6">
          {filtered.length} product{filtered.length !== 1 ? 's' : ''}
        </p>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">{products.length === 0 ? '✨' : '🔍'}</div>
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
              <Link key={p.id} href={`/products/${p.id}`} className="product-card group bg-white">
                <div className="product-card-image aspect-[3/4] bg-neutral-100 overflow-hidden relative">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#ccc] text-sm">
                      No Image
                    </div>
                  )}
                  {p.stock === 0 && (
                    <div className="absolute top-2 left-2 bg-[#d32f2f] text-white text-[9px] font-bold px-2 py-0.5 tracking-wider">
                      OUT OF STOCK
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-[#888] mb-1 tracking-[0.05em] uppercase">{p.category}</p>
                  <p className="text-sm font-medium text-[#222] truncate mb-1">{p.name}</p>
                  <p className="text-sm font-bold text-[#111]">PKR {Number(p.price).toLocaleString()}</p>
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
        <div className="min-h-screen flex items-center justify-center text-[#888] text-sm">
          Loading...
        </div>
      }>
        <ProductGrid />
      </Suspense>
    </StorefrontLayout>
  );
}
