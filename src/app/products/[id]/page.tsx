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
      <StorefrontLayout>
        <div className="min-h-screen flex items-center justify-center text-[#888] text-sm">
          Loading...
        </div>
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          <p className="text-[#888]">Product not found.</p>
          <Link href="/products" className="text-xs font-semibold text-[#111] border-b border-[#111] pb-0.5">
            Back to products
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      {/* Breadcrumb */}
      <div className="bg-[#fafafa] border-b border-neutral-100 py-3">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-1.5 text-[11px] text-[#888]">
            <Link href="/" className="hover:text-black transition">HOME</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-black transition">SHOP</Link>
            <span>/</span>
            {product.category && (
              <>
                <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-black transition">
                  {product.category}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-[#222] font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="aspect-square bg-[#fafafa] overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#ccc]">
                No Image Available
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.category && (
              <p className="text-[10px] text-[#888] tracking-[0.1em] uppercase mb-2">
                {product.category}
              </p>
            )}
            <h1 className="text-xl md:text-2xl font-bold text-[#111] mb-3" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              {product.name}
            </h1>

            <div className="mb-5">
              <p className="text-xl font-bold text-[#111]">PKR {Number(product.price).toLocaleString()}</p>
            </div>

            <div className="mb-5">
              {product.stock > 0 ? (
                <p className="text-xs text-[#2e7d32] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#2e7d32] rounded-full" />
                  In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-xs text-[#d32f2f] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#d32f2f] rounded-full" />
                  Out of Stock
                </p>
              )}
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="text-xs font-semibold tracking-[0.05em] text-[#111] mb-2">DESCRIPTION</h3>
                <p className="text-[#666] text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="mt-auto space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-xs font-semibold text-[#222]">Quantity:</label>
                <div className="flex items-center border border-neutral-200">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm hover:bg-[#fafafa] transition"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-sm font-medium min-w-[36px] text-center border-x border-neutral-200">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-sm hover:bg-[#fafafa] transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                disabled={product.stock === 0}
                className="w-full bg-[#111] text-white py-3 text-xs font-semibold tracking-[0.1em] hover:bg-[#333] disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
              </button>

              <button className="w-full border border-[#111] text-[#111] py-3 text-xs font-semibold tracking-[0.1em] hover:bg-[#111] hover:text-white transition">
                BUY NOW
              </button>
            </div>

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-neutral-100 grid grid-cols-2 gap-3 text-[11px] text-[#666]">
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                Free Delivery on PKR 5,000+
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0z"/>
                  <path d="M12 8v4l3 3"/>
                </svg>
                Delivery in 3-5 Days
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Easy Returns
              </div>
              <div className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
