'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import StorefrontLayout from '../storefront-layout';

const USER_KEY = 'user-secret-key-2026';
const DISCOUNT = 0.70;

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

function getDiscountedPrice(price: number): number {
  return Math.round(price * (1 - DISCOUNT));
}

function ProductGrid() {
  const searchParams = useSearchParams();
  const gender = searchParams.get('gender') || '';
  const categoryFilter = searchParams.get('category') || searchParams.get('subcategory') || '';
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
        if (!text) return [];
        try { const p = JSON.parse(text); return Array.isArray(p.data) ? p.data : []; } catch { return []; }
      })
      .then((data) => { if (Array.isArray(data)) setProducts(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [gender, categoryFilter]);

  let filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.tags || '').toLowerCase().includes(search.toLowerCase())
  );

  if (sortBy === 'price-high') filtered.sort((a, b) => getDiscountedPrice(b.price) - getDiscountedPrice(a.price));
  else if (sortBy === 'price-low') filtered.sort((a, b) => getDiscountedPrice(a.price) - getDiscountedPrice(b.price));
  else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
  else filtered.sort((a, b) => (b.id || 0) - (a.id || 0));

  const pageTitle = gender ? (GENDER_LABELS[gender] || 'All Products') : 'All Products';
  const categories = gender ? (GENDER_CATEGORIES[gender] || []) : [];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-[13px] text-text-muted">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="bg-text-primary py-10 lg:py-14 text-center">
        <div className="inline-flex items-center gap-2 bg-sale/20 border border-sale/40 text-sale text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-4">
          <span className="w-1.5 h-1.5 bg-sale rounded-full animate-pulse" />
          Flash Sale &mdash; 70% Off Everything
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-baskerville">
          {pageTitle}
        </h1>
        <div className="w-10 h-[2px] bg-sale mx-auto mt-3 rounded-full" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Gender Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link href="/products" className={`chip ${!gender ? 'chip-active' : ''}`}>
              ALL
            </Link>
            {['WOMEN', 'MEN', 'TEENS'].map((g) => (
              <Link key={g} href={`/products?gender=${g}`} className={`chip ${gender === g ? 'chip-active' : ''}`}>
                {g}
              </Link>
            ))}
          </div>

          {/* Subcategory Pills */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <Link key={cat.slug} href={cat.slug ? `/products?gender=${gender}&subcategory=${cat.slug}` : `/products?gender=${gender}`} className={`chip ${categoryFilter === cat.slug ? 'chip-sale' : ''}`}>
                  {cat.label}
                </Link>
              ))}
            </div>
          )}

          {/* Toolbar: Count + Filters | Search + Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-3">
              <p className="text-[13px] text-text-muted">
                Showing <span className="font-semibold text-text-primary">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}
              </p>
              <span className="badge badge-sale">70% OFF</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-faint" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="toolbar-input"
                  style={{ width: '220px' }}
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="toolbar-select"
              >
                <option value="newest">Newest</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-surface-overlay flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-faint">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </div>
            <p className="text-text-secondary text-base font-medium mb-1">No products match your search</p>
            <p className="text-text-faint text-[13px]">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
            {filtered.map((p) => {
              const img = getPrimaryImage(p);
              const salePrice = getDiscountedPrice(p.price);
              const discount = Math.round(DISCOUNT * 100);
              return (
                <Link key={p.id} href={`/products/${p.id}`} className="product-card group bg-white rounded-xl border border-border-light overflow-hidden flex flex-col">
                  <div className="relative aspect-[4/5] bg-surface-overlay overflow-hidden">
                    {img ? (
                      <img src={img} alt={p.name} className="product-card-image w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-faint">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                      <span className="badge badge-sale">-{discount}%</span>
                      {p.stock === 0 && (
                        <span className="badge badge-out">SOLD OUT</span>
                      )}
                      {p.stock > 0 && p.stock <= 5 && (
                        <span className="badge badge-low">LOW STOCK</span>
                      )}
                    </div>
                  </div>
                  <div className="p-3.5 flex flex-col flex-1">
                    <p className="text-[10px] text-text-faint mb-1 tracking-[0.06em] uppercase font-medium">{p.gender} &middot; {p.subcategory?.replace(/-/g, ' ')}</p>
                    <h3 className="text-[13px] font-semibold text-text-secondary mb-2 line-clamp-2 group-hover:text-sale transition-colors leading-snug">{p.name}</h3>
                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-sale">PKR {salePrice.toLocaleString()}</span>
                        <span className="text-[11px] text-text-faint line-through">PKR {p.price.toLocaleString()}</span>
                      </div>
                      {p.stock > 0 && (
                        <span className="text-[10px] text-success font-medium bg-success-light px-1.5 py-0.5 rounded">In Stock</span>
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
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] text-text-muted">Loading products...</p>
          </div>
        </div>
      }>
        <ProductGrid />
      </Suspense>
    </StorefrontLayout>
  );
}
