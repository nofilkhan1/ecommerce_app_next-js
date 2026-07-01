'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const USER_KEY = 'user-secret-key-2026';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

const CATEGORIES = [
  { name: 'SUMMER COLLECTION', color: 'bg-amber-100 text-amber-800' },
  { name: 'CO-ORDS', color: 'bg-rose-100 text-rose-800' },
  { name: 'READY TO WEAR', color: 'bg-sky-100 text-sky-800' },
  { name: 'UNSTITCHED', color: 'bg-emerald-100 text-emerald-800' },
  { name: 'FORMALS', color: 'bg-violet-100 text-violet-800' },
  { name: 'ACCESSORIES', color: 'bg-orange-100 text-orange-800' },
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
    <>
      <header className="border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">J.</Link>
          <nav className="flex gap-6 text-sm">
            <Link href="/" className="hover:text-neutral-600">Home</Link>
            <Link href="/products" className="hover:text-neutral-600">Shop</Link>
            <Link href="/admin" className="hover:text-neutral-600">Admin</Link>
          </nav>
        </div>
      </header>

      <section className="bg-neutral-900 text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Junaid Jamshed</h1>
          <p className="text-lg text-neutral-400 mb-8">Premium fashion for the modern individual</p>
          <Link
            href="/products"
            className="inline-block bg-white text-neutral-900 px-8 py-3 rounded-full text-sm font-semibold hover:bg-neutral-200 transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className={`${cat.color} rounded-xl p-6 text-center font-semibold text-sm hover:scale-[1.02] transition`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-sm text-neutral-600 hover:text-neutral-900 underline">View All</Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-neutral-400 text-sm">No products yet. Add some from the admin panel.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group">
                <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden mb-3">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-300 text-sm">No image</div>
                  )}
                </div>
                <p className="font-medium text-sm truncate">{p.name}</p>
                <p className="text-sm text-neutral-600">${Number(p.price).toFixed(2)}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t py-8 text-center text-sm text-neutral-500">
        <p>&copy; {new Date().getFullYear()} J. E-Commerce. All rights reserved.</p>
      </footer>
    </>
  );
}
