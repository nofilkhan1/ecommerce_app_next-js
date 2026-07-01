'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const USER_KEY = 'user-secret-key-2026';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  created_at: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${id}`, { headers: { 'X-API-Key': USER_KEY } })
      .then((r) => r.json())
      .then((data) => {
        if (data.detail) throw new Error(data.detail);
        setProduct(data);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">Product not found.</p>
        <Link href="/products" className="text-sm underline">Back to products</Link>
      </div>
    );
  }

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
        <Link href="/products" className="text-sm text-neutral-500 hover:text-neutral-900 mb-4 inline-block">
          &larr; Back to products
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-neutral-100 rounded-xl overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-300">No image</div>
            )}
          </div>

          <div>
            {product.category && (
              <span className="text-xs font-semibold bg-neutral-100 px-3 py-1 rounded-full text-neutral-600">
                {product.category}
              </span>
            )}
            <h1 className="text-2xl font-bold mt-3 mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-neutral-900 mb-4">${Number(product.price).toFixed(2)}</p>

            {product.stock > 0 ? (
              <p className="text-sm text-emerald-600 mb-4">In stock ({product.stock} available)</p>
            ) : (
              <p className="text-sm text-red-500 mb-4">Out of stock</p>
            )}

            {product.description && (
              <p className="text-neutral-600 text-sm leading-relaxed mb-6">{product.description}</p>
            )}

            <button
              disabled={product.stock === 0}
              className="w-full bg-neutral-900 text-white py-3 rounded-xl text-sm font-semibold hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t py-8 text-center text-sm text-neutral-500">
        <p>&copy; {new Date().getFullYear()} J. E-Commerce. All rights reserved.</p>
      </footer>
    </>
  );
}
