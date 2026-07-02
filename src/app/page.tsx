'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import StorefrontLayout from './storefront-layout';

const USER_KEY = 'user-secret-key-2026';
const SALE_END = new Date('2026-07-03T00:00:00+05:00');
const DISCOUNT = 0.70;

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

function getDiscountedPrice(price: number): number {
  return Math.round(price * (1 - DISCOUNT));
}

function useCountdown(target: Date) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target.getTime() - now);
  return {
    expired: diff <= 0,
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showAll, setShowAll] = useState(false);
  const countdown = useCountdown(SALE_END);

  useEffect(() => {
    fetch('/api/products?limit=20', { headers: { 'X-API-Key': USER_KEY } })
      .then(async (r) => {
        const text = await r.text();
        if (!text) return [];
        try { const p = JSON.parse(text); return Array.isArray(p.data) ? p.data : []; } catch { return []; }
      })
      .then((data) => { if (Array.isArray(data)) setProducts(data); })
      .catch(() => {});
  }, []);

  const displayProducts = showAll ? products : products.slice(0, 8);

  return (
    <StorefrontLayout>
      {/* FLASH SALE HERO */}
      <section className="relative bg-text-primary overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/categories/signature.jpg" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-sale/90 via-text-primary/80 to-text-primary/90" />
        </div>
        <div className="relative z-10 max-w-[1400px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-sale text-white text-[10px] font-bold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-6 animate-pulse">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                Limited Time Only
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 font-baskerville">
                Flash Sale
              </h1>
              <div className="flex items-baseline gap-3 justify-center lg:justify-start mb-5">
                <span className="text-5xl md:text-7xl font-extrabold text-sale">70%</span>
                <span className="text-xl md:text-2xl font-bold text-white">OFF</span>
              </div>
              <p className="text-white/60 text-sm md:text-base mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed">
                On the entire collection. Premium fashion at unbeatable prices. Hurry, offer ends tonight!
              </p>

              {/* Countdown */}
              {!countdown.expired ? (
                <div className="flex items-center gap-3 justify-center lg:justify-start mb-8">
                  {[
                    { val: countdown.hours, label: 'HRS' },
                    { val: countdown.minutes, label: 'MIN' },
                    { val: countdown.seconds, label: 'SEC' },
                  ].map((t, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl w-16 h-16 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white tabular-nums">{String(t.val).padStart(2, '0')}</span>
                        </div>
                        <span className="text-[9px] text-white/50 font-semibold tracking-wider mt-1.5">{t.label}</span>
                      </div>
                      {i < 2 && <span className="text-white/30 text-xl font-bold -mt-4">:</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mb-8">
                  <span className="bg-sale/20 border border-sale/40 text-sale text-[11px] font-bold px-4 py-2 rounded-full">
                    Sale has ended
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <Link href="/products" className="inline-flex items-center gap-2 bg-white text-text-primary px-8 py-3.5 text-[11px] font-bold tracking-[0.1em] hover:bg-surface-overlay transition-all rounded-xl shadow-lg hover:shadow-xl">
                  SHOP THE SALE
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link href="/products?gender=WOMEN" className="inline-flex items-center gap-2 border border-white/30 text-white px-6 py-3.5 text-[11px] font-semibold tracking-[0.1em] hover:bg-white/10 transition-all rounded-xl">
                  VIEW CATALOG
                </Link>
              </div>
            </div>

            {/* Featured sale item */}
            {products.length > 0 && (
              <div className="flex-shrink-0 hidden lg:block">
                <div className="relative">
                  <div className="absolute -top-3 -right-3 badge badge-sale text-[11px] px-3 py-1 shadow-lg z-10">
                    70% OFF
                  </div>
                  <div className="w-64 h-72 rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl">
                    {getPrimaryImage(products[0]) ? (
                      <img src={getPrimaryImage(products[0])!} alt={products[0].name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center text-white/30 text-[13px]">No Image</div>
                    )}
                  </div>
                  <div className="mt-3 text-center">
                    <p className="text-white/50 text-[10px] tracking-wider uppercase">{products[0].name}</p>
                    <p className="text-white font-bold text-[13px] mt-1">
                      <span className="text-sale">PKR {getDiscountedPrice(products[0].price).toLocaleString()}</span>
                      <span className="text-white/40 line-through text-[11px] ml-2">PKR {products[0].price.toLocaleString()}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="text-center mb-10">
          <span className="text-[10px] font-semibold text-sale tracking-[0.2em] uppercase">Shop Now</span>
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary mt-2 font-baskerville">Shop by Category</h2>
          <div className="w-10 h-[2px] bg-sale mx-auto mt-3 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.name} href={cat.href} className="group relative aspect-[3/4] overflow-hidden bg-surface-overlay rounded-xl">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3.5">
                <p className="text-white text-[11px] font-bold tracking-[0.06em] text-center drop-shadow-sm">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Sale Products */}
      <section className="bg-surface-raised py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] font-semibold text-sale tracking-[0.2em] uppercase">70% Off</span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-text-primary mt-2 font-baskerville">Flash Sale Picks</h2>
              <div className="w-8 h-[2px] bg-sale mt-3 rounded-full" />
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold text-sale hover:text-sale-hover transition tracking-wide">
              VIEW ALL
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {displayProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-muted text-[13px] font-medium">Loading sale items...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {displayProducts.map((p) => {
                const img = getPrimaryImage(p);
                const salePrice = getDiscountedPrice(p.price);
                const discount = Math.round(DISCOUNT * 100);
                return (
                  <Link key={p.id} href={`/products/${p.id}`} className="product-card group bg-white rounded-xl border border-border-light overflow-hidden">
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
                      <div className="absolute top-2.5 left-2.5">
                        <span className="badge badge-sale">-{discount}%</span>
                      </div>
                      {p.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="badge badge-out text-[10px] px-3 py-1">OUT OF STOCK</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3.5">
                      <p className="text-[10px] text-text-faint mb-1 tracking-[0.06em] uppercase font-medium">{p.gender} &middot; {p.subcategory?.replace(/-/g, ' ')}</p>
                      <p className="text-[13px] font-semibold text-text-secondary truncate mb-2 group-hover:text-sale transition-colors leading-snug">{p.name}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-bold text-sale">PKR {salePrice.toLocaleString()}</span>
                        <span className="text-[11px] text-text-faint line-through">PKR {p.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/products" className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sale hover:text-sale-hover transition tracking-wide">
              VIEW ALL SALE ITEMS
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="border-y border-border bg-white">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a2 2 0 01-2 2h-1M6 21a2 2 0 100-4 2 2 0 000 4zM17 21a2 2 0 100-4 2 2 0 000 4z"/></svg>, title: 'Free Delivery', desc: 'On orders above PKR 5,000' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, title: 'Premium Quality', desc: 'Authentic J. products' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>, title: 'Easy Returns', desc: '30-day return policy' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-sale-light flex items-center justify-center text-sale">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[11px] font-bold text-text-primary">{item.title}</p>
                  <p className="text-[11px] text-text-faint">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative h-[35vh] min-h-[280px] bg-text-primary overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/categories/luxe.jpg" alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-sale/80 via-text-primary/60 to-text-primary/80" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div>
            <p className="text-white/50 text-[10px] tracking-[0.3em] mb-3 uppercase font-semibold">Don&apos;t Miss Out</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 font-baskerville">
              Sale Ends Tonight
            </h2>
            <p className="text-white/50 text-[13px] mb-6 max-w-md mx-auto">
              Grab your favorites before the clock strikes midnight. All products at 70% off.
            </p>
            <Link href="/products" className="inline-flex items-center gap-2 bg-white text-text-primary px-8 py-3.5 text-[11px] font-bold tracking-[0.1em] hover:bg-surface-overlay transition-all rounded-xl shadow-lg">
              SHOP NOW
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
}
