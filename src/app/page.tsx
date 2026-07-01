'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import StorefrontLayout from './storefront-layout';

const USER_KEY = 'user-secret-key-2026';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

const CATEGORIES = [
  { name: 'SUMMER COLLECTION', image: '/images/categories/summer.jpg' },
  { name: 'CO-ORDS', image: '/images/categories/coords.jpg' },
  { name: 'READY TO WEAR', image: '/images/categories/women-1.jpg' },
  { name: 'UNSTITCHED', image: '/images/categories/unstitched.jpg' },
  { name: 'FORMALS', image: '/images/categories/formal.jpg' },
  { name: 'ACCESSORIES', image: '/images/categories/accessories.jpg' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products', { headers: { 'X-API-Key': USER_KEY } })
      .then((r) => r.json())
      .then((data) => setFeatured(data.slice(0, 8)))
      .catch(() => {});
  }, []);

  return (
    <StorefrontLayout>
      {/* Hero Section */}
      <section className="relative h-[60vh] lg:h-[80vh] bg-neutral-100 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/categories/signature.jpg"
            alt="Junaid Jamshed Collection"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/20" />
        </div>
        <div className="relative z-10 h-full flex items-center max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="max-w-lg">
            <p className="text-white/80 text-xs tracking-[0.3em] mb-4 uppercase">New Arrivals 2026</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Summer Collection
            </h1>
            <p className="text-white/70 text-sm md:text-base mb-8 leading-relaxed">
              Discover the essence of elegance with our curated collection of premium fashion.
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-[#111] px-8 py-3 text-xs font-semibold tracking-[0.1em] hover:bg-[#111] hover:text-white transition-all duration-300"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="max-w-[1400px] mx-auto px-4 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-bold tracking-[0.05em] text-[#111]">SHOP BY CATEGORY</h2>
          <div className="w-12 h-[2px] bg-[#111] mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="group relative aspect-[3/4] overflow-hidden bg-neutral-100"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white text-[11px] font-semibold tracking-[0.05em] text-center">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-[#fafafa] py-16">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tracking-[0.05em] text-[#111]">FEATURED PRODUCTS</h2>
              <div className="w-12 h-[2px] bg-[#111] mt-3" />
            </div>
            <Link href="/products" className="text-xs font-semibold tracking-[0.05em] text-[#666] hover:text-[#111] transition border-b border-[#666] hover:border-[#111] pb-0.5">
              VIEW ALL
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#888] text-sm">No products yet. Add some from the admin panel.</p>
              <Link href="/admin" className="inline-block mt-4 text-xs font-semibold text-[#111] border-b border-[#111] pb-0.5">
                Go to Admin
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="product-card group bg-white">
                  <div className="product-card-image aspect-[3/4] bg-neutral-100 overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#ccc] text-sm">
                        No Image
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
      </section>

      {/* Banner */}
      <section className="relative h-[40vh] bg-[#111] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/categories/luxe.jpg"
            alt="Store"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <div>
            <p className="text-white/60 text-xs tracking-[0.3em] mb-3 uppercase">Visit Our Store</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              Find a Store Near You
            </h2>
            <Link
              href="#"
              className="inline-block border border-white text-white px-8 py-3 text-xs font-semibold tracking-[0.1em] hover:bg-white hover:text-[#111] transition-all duration-300"
            >
              STORE LOCATOR
            </Link>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
}
