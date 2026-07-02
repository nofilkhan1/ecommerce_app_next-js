'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import StorefrontLayout from '../../storefront-layout';

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
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${id}`, { headers: { 'X-API-Key': USER_KEY } })
      .then(async (r) => {
        const text = await r.text();
        if (!text) throw new Error('Empty response');
        try { return JSON.parse(text); } catch { throw new Error('Invalid response'); }
      })
      .then((data) => {
        if (data && (data.detail || data.message) && !data.id) throw new Error(data.detail || data.message);
        setProduct(data);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen flex items-center justify-center text-[#6b7280] text-sm">
          Loading...
        </div>
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#eff6ff] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <p className="text-[#6b7280] text-sm font-medium">Product not found.</p>
          <Link href="/products" className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] border-b border-[#2563eb] hover:border-[#1d4ed8] pb-0.5 transition">
            Back to products
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      {/* Breadcrumb */}
      <div className="bg-[#f9fafb] border-b border-[#f3f4f6] py-3">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-1.5 text-[11px] text-[#9ca3af]">
            <Link href="/" className="hover:text-[#111827] transition">HOME</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#111827] transition">SHOP</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#111827] transition">
                  {product.category}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#374151] font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-square bg-[#f9fafb] rounded-2xl overflow-hidden border border-[#f3f4f6]">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#d1d5db]">
                No Image Available
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.category && (
              <p className="text-[10px] text-[#9ca3af] tracking-[0.1em] uppercase mb-2">
                {product.category}
              </p>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-[#111827] mb-3" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              {product.name}
            </h1>

            <div className="mb-5">
              <p className="text-xl font-bold text-[#111827]">PKR {Number(product.price).toLocaleString()}</p>
            </div>

            <div className="mb-5">
              {product.stock > 0 ? (
                <p className="text-xs text-[#065f46] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full" />
                  In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-xs text-[#991b1b] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#ef4444] rounded-full" />
                  Out of Stock
                </p>
              )}
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold tracking-[0.05em] text-[#111827] mb-2">DESCRIPTION</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-[#374151]">Quantity:</label>
                <div className="flex items-center border border-[#d1d5db] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm hover:bg-[#f3f4f6] transition"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-sm font-medium min-w-[36px] text-center border-x border-[#d1d5db]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-sm hover:bg-[#f3f4f6] transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                disabled={product.stock === 0}
                className="w-full bg-[#2563eb] text-white py-3 text-xs font-semibold tracking-[0.1em] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed transition rounded-xl"
              >
                {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
              </button>

              <button className="w-full border border-[#2563eb] text-[#2563eb] py-3 text-xs font-semibold tracking-[0.1em] hover:bg-[#eff6ff] transition rounded-xl">
                BUY NOW
              </button>
            </div>

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-[#f3f4f6] grid grid-cols-2 gap-3 text-[11px] text-[#6b7280]">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                Free Delivery on PKR 5,000+
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
                Delivery in 3-5 Days
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Easy Returns
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
                Secure Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
