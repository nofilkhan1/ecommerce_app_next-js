'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const USER_KEY = 'user-secret-key-2026';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
}

function ProductGrid() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const url = categoryFilter ? `/api/products?category=${encodeURIComponent(categoryFilter)}` : '/api/products';
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          {categoryFilter && (
            <p className="text-sm text-neutral-500 mt-1">Category: {categoryFilter}</p>
          )}
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-neutral-300 rounded-lg px-3 py-2 text-sm max-w-xs focus:outline-none focus:border-neutral-900"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-400 text-sm py-12 text-center">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
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
              {p.stock === 0 && <p className="text-xs text-red-500 mt-1">Out of stock</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
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

      <main className="max-w-6xl mx-auto px-6 py-8 flex-1">
        <Suspense fallback={<p className="text-neutral-500">Loading...</p>}>
          <ProductGrid />
        </Suspense>
      </main>

      <footer className="border-t py-8 text-center text-sm text-neutral-500">
        <p>&copy; {new Date().getFullYear()} J. E-Commerce. All rights reserved.</p>
      </footer>
    </>
  );
}
