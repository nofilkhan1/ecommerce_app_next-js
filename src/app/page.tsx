'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import StorefrontLayout from './storefront-layout';

const USER_KEY = 'user-secret-key-2026';

interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt: string;
  type: string;
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

const CATEGORIES = [
  { name: "Women's Summer", href: '/products?gender=WOMEN&subcategory=summer-collection', image: '/images/categories/summer.jpg' },
  { name: "Women's Co-ords", href: '/products?gender=WOMEN&subcategory=co-ords', image: '/images/categories/coords.jpg' },
  { name: "Women's Ready to Wear", href: '/products?gender=WOMEN&subcategory=ready-to-wear', image: '/images/categories/women-1.jpg' },
  { name: "Men's Ready to Wear", href: '/products?gender=MEN&subcategory=ready-to-wear', image: '/images/categories/men-1.jpg' },
  { name: "Women's Unstitched", href: '/products?gender=WOMEN&subcategory=unstitched', image: '/images/categories/unstitched.jpg' },
  { name: "Accessories", href: '/products?gender=WOMEN&subcategory=accessories', image: '/images/categories/accessories.jpg' },
];

function getPrimaryImage(product: Product): string | null {
  if (product.images && product.images.length > 0) {
    const primary = product.images.find(img => img.type === 'primary');
    return primary?.url || product.images[0]?.url || null;
  }
  return null;
}

function formatPrice(price: number, salePrice: number | null): string {
  if (salePrice !== null && salePrice !== undefined && salePrice < price) {
    return `<span class="text-base font-bold text-[#111827]">PKR ${Number(salePrice).toLocaleString()}</span> <span class="text-sm text-[#dc2626] line-through">PKR ${Number(price).toLocaleString()}</span>`;
  }
  return `PKR ${Number(price).toLocaleString()}`;
}

function getSalePrice(product: Product): number | null {
  if (product.sale_price !== null && product.sale_price !== undefined && product.sale_price > 0 && product.sale_price < product.price) {
    return product.sale_price;
  }
  return null;
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products?featured=true&limit=8', { headers: { 'X-API-Key': USER_KEY } })
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
        if (Array.isArray(data)) setFeatured(data); 
        else if (data && Array.isArray(data.data)) setFeatured(data.data);
      })
      .catch(() => {});
  }, []);

  return (
    <StorefrontLayout>
      {/* Hero Section */}
      <section className="relative h-[60vh] lg:h-[80vh] bg-[#f3f4f6] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/categories/signature.jpg"
            alt="Junaid Jamshed Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 h-full flex items-center max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="max-w-lg">
            <span className="inline-block bg-[#2563eb]/90 text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1 rounded-md mb-5">New Arrivals 2026</span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-[1.1]" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Summer Collection
            </h1>
            <p className="text-white/80 text-sm md:text-base mb-8 leading-relaxed max-w-md">
              Discover the essence of elegance with our curated collection of premium fashion. Timeless designs for the modern wardrobe.
            </p>
            <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#2563eb] text-white px-8 py-3.5 text-xs font-semibold tracking-[0.1em] hover:bg-[#1d4ed8] transition-all duration-300 rounded-xl"
            >
              SHOP NOW
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/products?gender=WOMEN"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-6 py-3.5 text-xs font-semibold tracking-[0.1em] hover:bg-white/10 transition-all duration-300 rounded-xl"
            >
              VIEW CATALOG
            </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="text-[10px] font-semibold text-[#2563eb] tracking-[0.2em] uppercase">Explore</span>
          <h2 className="text-xl md:text-2xl font-bold tracking-[0.02em] text-[#111827] mt-2">Shop by Category</h2>
          <div className="w-10 h-[2px] bg-[#2563eb] mx-auto mt-3 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative aspect-[3/4] overflow-hidden bg-[#f3f4f6] rounded-xl"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-[11px] font-bold tracking-[0.08em] text-center drop-shadow-sm">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#f9fafb] py-16 lg:py-20">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-semibold text-[#2563eb] tracking-[0.2em] uppercase">Curated</span>
              <h2 className="text-xl md:text-2xl font-bold tracking-[0.02em] text-[#111827] mt-2">Featured Products</h2>
              <div className="w-8 h-[2px] bg-[#2563eb] mt-3 rounded-full" />
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition">
              VIEW ALL
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-[#eff6ff] flex items-center justify-center mx-auto mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p className="text-[#6b7280] text-sm font-medium">Our latest collection will be available shortly.</p>
              <p className="text-[#9ca3af] text-xs mt-1">Check back soon for new arrivals.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {featured.map((p) => {
                const primaryImage = getPrimaryImage(p);
                const salePrice = getSalePrice(p);
                return (
                  <Link key={p.id} href={`/products/${p.id}`} className="group bg-white rounded-xl border border-[#f3f4f6] overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
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
                      {p.stock === 0 && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-[#dc2626] text-white text-[9px] font-bold px-2 py-0.5 tracking-wider rounded-md">OUT OF STOCK</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <p className="text-[10px] text-[#9ca3af] mb-1 tracking-[0.08em] uppercase font-medium">{p.category}</p>
                      <p className="text-[10px] text-[#2563eb] mb-1 tracking-[0.05em] font-medium">{p.gender || ''}</p>
                      <p className="text-sm font-semibold text-[#374151] truncate mb-2 group-hover:text-[#2563eb] transition-colors">{p.name}</p>
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
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition">
              VIEW ALL PRODUCTS
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="relative h-[40vh] bg-[#111827] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/categories/luxe.jpg"
            alt="Store"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111827]/80 to-[#111827]/40" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div>
            <p className="text-white/60 text-[10px] tracking-[0.3em] mb-3 uppercase font-semibold">Experience</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Find a Store Near You
            </h2>
            <Link
              href="#"
              className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-3.5 text-xs font-semibold tracking-[0.1em] hover:bg-white hover:text-[#111827] transition-all duration-300 rounded-xl"
            >
              STORE LOCATOR
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
}