'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StorefrontLayout from '../storefront-layout';

const USER_KEY = 'user-secret-key-2026';

interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt: string;
  type: 'primary' | 'gallery' | 'thumbnail';
  sort_order: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  price: number;
  sale_price: number | null;
  stock: number;
  category: string;
  gender: string;
  subcategory: string;
  collection: string;
  brand: string;
  status: string;
  visibility: string;
  featured: number;
  tags: string;
  sizes: string;
  colors: string;
  materials: string;
  weight: number;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  primary_image?: string;
  gallery_images?: string[];
}

const GENDER_CATEGORIES: Record<string, { label: string; slug: string }[]> = {
  WOMEN: [
    { label: 'All', slug: '' },
    { label: 'Summer Collection', slug: 'summer-collection' },
    { label: 'Co-ords', slug: 'co-ords' },
    { label: 'Ready to Wear', slug: 'ready-to-wear' },
    { label: 'Unstitched', slug: 'unstitched' },
    { label: 'Formals', slug: 'formals' },
    { label: 'Accessories', slug: 'accessories' },
  ],
  MEN: [
    { label: 'All', slug: '' },
    { label: 'Ready to Wear', slug: 'ready-to-wear' },
    { label: 'Formals', slug: 'formals' },
    { label: 'Co-ords', slug: 'co-ords' },
    { label: 'Accessories', slug: 'accessories' },
  ],
  TEENS: [
    { label: 'All', slug: '' },
    { label: 'Girls', slug: 'summer-collection' },
    { label: 'Boys', slug: 'ready-to-wear' },
  ],
};

const GENDER_LABELS: Record<string, string> = {
  WOMEN: "Women's Collection",
  MEN: "Men's Collection",
  TEENS: "Teens Collection",
};

function getPrimaryImage(product: Product): string | null {
  if (product.images && product.images.length > 0) {
    const primary = product.images.find(img => img.type === 'primary');
    if (primary) return primary.url;
    return product.images[0].url;
  }
  return null;
}

function formatPrice(price: number, salePrice: number | null): string {
  if (salePrice !== null && salePrice !== undefined && salePrice < price) {
    return `<span class="text-base font-bold text-[#111827]">PKR ${Number(salePrice).toLocaleString()}</span> <span class="text-sm text-[#dc2626] line-through">PKR ${Number(price).toLocaleString()}</span>`;
  }
  return `PKR ${Number(price).toLocaleString()}`;
}

function ProductGrid() {
  const searchParams = useSearchParams();
  const gender = searchParams.get('gender') || '';
  const categoryFilter = searchParams.get('category') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const params = new URLSearchParams();
    if (gender) params.set('gender', gender);
    if (categoryFilter) params.set('subcategory', categoryFilter);
    const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
    fetch(url, { headers: { 'X-API-Key': USER_KEY } })
      .then(async (r) => {
        const text = await r.text();
        if (!text) return { data: [] };
        try { 
          const parsed = JSON.parse(text);
          return parsed.data || parsed; 
        } catch { 
          return { data: [] }; 
        }
      })
      .then((data) => { 
        if (Array.isArray(data)) setProducts(data); 
        else if (data && Array.isArray(data.data)) setProducts(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [gender, categoryFilter]);

  let filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.tags || '').toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy === 'price-high') filtered.sort((a, b) => Number(b.price) - Number(a.price));
  else if (sortBy === 'price-low') filtered.sort((a, b) => Number(a.price) - Number(b.price));
  else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else filtered.sort((a, b) => (b.id || 0) - (a.id || 0));

  const pageTitle = gender ? (GENDER_LABELS[gender] || 'All Products') : 'All Products';
  const categories = gender ? (GENDER_CATEGORIES[gender] || []) : [];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#6b7280]">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#f9fafb] border-b border-[#f3f4f6] py-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.02em] text-[#111827]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
          {pageTitle}
        </h1>
        <div className="w-10 h-[2px] bg-[#2563eb] mx-auto mt-3 rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        <div className="flex flex-col gap-4 mb-8">
          {/* Gender Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Link
              href="/products"
              className={`px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.05em] border transition-all rounded-lg ${
                !gender
                  ? 'bg-[#111827] text-white border-[#111827] shadow-sm'
                  : 'bg-white text-[#374151] border-[#d1d5db] hover:border-[#111827] hover:text-[#111827]'
              }`}
            >
              ALL
            </Link>
            {['WOMEN', 'MEN', 'TEENS'].map((g) => (
              <Link
                key={g}
                href={`/products?gender=${g}`}
                className={`px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.05em] border transition-all rounded-lg ${
                  gender === g
                    ? 'bg-[#111827] text-white border-[#111827] shadow-sm'
                    : 'bg-white text-[#374151] border-[#d1d5db] hover:border-[#111827] hover:text-[#111827]'
                }`}
              >
                {g}
              </Link>
            ))}
          </div>

          {/* Subcategory Pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={cat.slug ? `/products?gender=${gender}&category=${cat.slug}` : `/products?gender=${gender}`}
                  className={`px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.05em] border transition-all rounded-lg ${
                    categoryFilter === cat.slug
                      ? 'bg-[#2563eb] text-white border-[#2563eb] shadow-sm'
                      : 'bg-white text-[#374151] border-[#d1d5db] hover:border-[#2563eb] hover:text-[#2563eb]'
                  }`}
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          )}

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-sm text-[#6b7280]">
              Showing <span className="font-semibold text-[#111827]">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2 text-sm border border-[#d1d5db] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#2563eb] transition w-full sm:w-[240px]"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-[#d1d5db] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#2563eb] transition cursor-pointer bg-white"
              >
                <option value="newest">Newest</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-[#f3f4f6] flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
            <p className="text-[#374151] text-base font-medium mb-1">
              {products.length === 0 ? 'Collection coming soon' : 'No products match your search'}
            </p>
            <p className="text-[#9ca3af] text-sm">
              {products.length === 0 ? 'Check back soon for new arrivals.' : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p) => {
              const primaryImage = getPrimaryImage(p);
              const salePrice = p.sale_price && p.sale_price < p.price ? p.sale_price : null;
              return (
                <Link key={p.id} href={`/products/${p.id}`} className="group bg-white rounded-xl border border-[#f3f4f6] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
                  <div className="relative aspect-[4/5] bg-[#f3f4f6] overflow-hidden">
                    {primaryImage ? (
                      <img src={primaryImage} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#d1d5db]">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {p.stock === 0 && (
                        <span className="bg-[#dc2626] text-white text-[9px] font-bold px-2 py-0.5 tracking-wider rounded-md">OUT OF STOCK</span>
                      )}
                      {p.stock > 0 && p.stock <= 5 && (
                        <span className="bg-[#d97706] text-white text-[9px] font-bold px-2 py-0.5 tracking-wider rounded-md">LOW STOCK</span>
                      )}
                    </div>
                    {p.stock > 0 && (
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                        <button className="w-full bg-white/95 backdrop-blur-sm text-[#111827] py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg hover:bg-white transition-colors">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                          </svg>
                          Add to Cart
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] text-[#9ca3af] mb-1 tracking-[0.08em] uppercase font-medium">{p.category}</p>
                    <h3 className="text-sm font-semibold text-[#374151] mb-2 line-clamp-2 group-hover:text-[#2563eb] transition-colors">{p.name}</h3>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        {salePrice ? (
                          <>
                            <span className="text-base font-bold text-[#111827]">PKR {Number(salePrice).toLocaleString()}</span>
                            <span className="text-sm text-[#dc2626] line-through">PKR {Number(p.price).toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="text-base font-bold text-[#111827]">PKR {Number(p.price).toLocaleString()}</span>
                        )}
                      </div>
                      {p.stock > 0 && (
                        <span className="text-[10px] text-[#16a34a] font-medium bg-[#f0fdf4] px-1.5 py-0.5 rounded">In Stock</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
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
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#6b7280]">Loading products...</p>
          </div>
        </div>
      }>
        <ProductGrid />
      </Suspense>
    </StorefrontLayout>
  );
}