'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import StorefrontLayout from '../../storefront-layout';

const USER_KEY = 'user-secret-key-2026';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  gender: string;
  subcategory: string;
  image_url: string;
  stock: number;
  created_at: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  image_url: string;
  category: string;
}

const GENDER_LABELS: Record<string, string> = {
  WOMEN: "Women",
  MEN: "Men",
  TEENS: "Teens",
};

const SUBCATEGORY_LABELS: Record<string, string> = {
  'summer-collection': 'Summer Collection',
  'co-ords': 'Co-ords',
  'ready-to-wear': 'Ready to Wear',
  'unstitched': 'Unstitched',
  'formals': 'Formals',
  'accessories': 'Accessories',
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const loadProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${id}`, { headers: { 'X-API-Key': USER_KEY } });
      const text = await res.text();
      if (!text) throw new Error('Empty response');
      const data = JSON.parse(text);
      if (data && (data.detail || data.message) && !data.id) throw new Error(data.detail || data.message);
      setProduct(data);

      if (data?.gender && data?.subcategory) {
        const catRes = await fetch(`/api/products?gender=${data.gender}&category=${data.subcategory}`, { headers: { 'X-API-Key': USER_KEY } });
        const catText = await catRes.text();
        if (catText) {
          try {
            const catData = JSON.parse(catText);
            if (Array.isArray(catData)) {
              setRelated(catData.filter((p: RelatedProduct) => p.id !== data.id).slice(0, 4));
            }
          } catch { /* ignore */ }
        }
      }
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadProduct(); }, [loadProduct]);

  if (loading) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#6b7280]">Loading product...</p>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
          <div className="w-20 h-20 rounded-2xl bg-[#f3f4f6] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <p className="text-[#6b7280] text-base font-medium">Product not found</p>
          <p className="text-[#9ca3af] text-sm">The product you are looking for does not exist or has been removed.</p>
          <Link href="/products" className="mt-2 inline-flex items-center gap-2 bg-[#2563eb] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#1d4ed8] transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const images = product.image_url ? [product.image_url] : [];
  const genderLabel = GENDER_LABELS[product.gender] || product.gender;
  const subcatLabel = SUBCATEGORY_LABELS[product.subcategory] || product.category;

  const genderParam = product.gender ? `gender=${product.gender}` : '';
  const catParam = product.subcategory ? `&category=${product.subcategory}` : '';
  const browseUrl = `/products?${genderParam}${catParam}`;

  return (
    <StorefrontLayout>
      <div className="bg-[#f9fafb] border-b border-[#f3f4f6]">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-[11px] text-[#9ca3af]">
            <Link href="/" className="hover:text-[#111827] transition">HOME</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <Link href="/products" className="hover:text-[#111827] transition">SHOP</Link>
            {product.gender && (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                <Link href={`/products?gender=${product.gender}`} className="hover:text-[#111827] transition">{genderLabel}</Link>
              </>
            )}
            {product.subcategory && (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                <Link href={browseUrl} className="hover:text-[#111827] transition">{subcatLabel}</Link>
              </>
            )}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span className="text-[#374151] font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          <div className="space-y-3">
            <div className="aspect-square bg-[#f9fafb] rounded-2xl overflow-hidden border border-[#f3f4f6]">
              {images.length > 0 ? (
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#d1d5db]">
                  <div className="text-center">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p className="text-sm">No Image Available</p>
                  </div>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${
                      selectedImage === i ? 'border-[#2563eb]' : 'border-transparent hover:border-[#d1d5db]'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              {product.gender && (
                <span className="inline-block text-[10px] font-semibold text-[#2563eb] tracking-[0.1em] uppercase bg-[#eff6ff] px-2.5 py-1 rounded-md">
                  {genderLabel}
                </span>
              )}
              {product.subcategory && (
                <span className="inline-block text-[10px] font-semibold text-[#6b7280] tracking-[0.1em] uppercase bg-[#f3f4f6] px-2.5 py-1 rounded-md">
                  {subcatLabel}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] mb-3 leading-tight" style={{ fontFamily: 'Libre Baskerville, serif' }}>
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-5">
              <p className="text-2xl font-bold text-[#111827]">PKR {Number(product.price).toLocaleString()}</p>
            </div>

            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="inline-flex items-center gap-2 bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] px-3 py-1.5 rounded-lg text-xs font-medium">
                  <span className="w-2 h-2 bg-[#16a34a] rounded-full flex-shrink-0" />
                  In Stock ({product.stock} available)
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-[#fef2f2] border border-[#fecaca] text-[#991b1b] px-3 py-1.5 rounded-lg text-xs font-medium">
                  <span className="w-2 h-2 bg-[#dc2626] rounded-full flex-shrink-0" />
                  Out of Stock
                </div>
              )}
            </div>

            {product.description && (
              <div className="mb-6 pb-6 border-b border-[#f3f4f6]">
                <h3 className="text-xs font-semibold tracking-[0.05em] text-[#374151] uppercase mb-2">Description</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <div className="mb-5">
              <label className="text-xs font-semibold text-[#374151] mb-2 block">Quantity</label>
              <div className="inline-flex items-center border border-[#d1d5db] rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#374151] hover:bg-[#f3f4f6] transition text-sm font-medium"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-semibold text-[#111827] border-x border-[#d1d5db]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#374151] hover:bg-[#f3f4f6] transition text-sm font-medium"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-3 mt-auto">
              <button
                disabled={product.stock === 0}
                className="w-full bg-[#2563eb] text-white py-3.5 text-sm font-semibold tracking-wide hover:bg-[#1d4ed8] active:bg-[#1e40af] disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-xl flex items-center justify-center gap-2"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" />
                </svg>
                {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
              </button>
              <button
                disabled={product.stock === 0}
                className="w-full border-2 border-[#2563eb] text-[#2563eb] py-3.5 text-sm font-semibold tracking-wide hover:bg-[#eff6ff] active:bg-[#dbeafe] disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-xl"
              >
                BUY NOW
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[#f3f4f6] grid grid-cols-2 gap-4">
              {[
                { icon: '🚚', text: 'Free Delivery on PKR 5,000+' },
                { icon: '⏱', text: 'Delivery in 3-5 Days' },
                { icon: '↩', text: 'Easy Returns' },
                { icon: '🔒', text: 'Secure Payment' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-2.5 text-xs text-[#6b7280]">
                  <span className="text-base">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 pt-12 border-t border-[#f3f4f6]">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold tracking-[0.02em] text-[#111827]">You May Also Like</h2>
                <div className="w-8 h-[2px] bg-[#2563eb] mt-2 rounded-full" />
              </div>
              <Link href={browseUrl} className="text-xs font-semibold text-[#2563eb] hover:text-[#1d4ed8] transition">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="group bg-white rounded-xl border border-[#f3f4f6] overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <div className="aspect-square bg-[#f3f4f6] overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#d1d5db] text-xs">No Image</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-[#9ca3af] mb-1 tracking-[0.05em] uppercase">{p.category}</p>
                    <p className="text-sm font-medium text-[#374151] truncate mb-1">{p.name}</p>
                    <p className="text-sm font-bold text-[#111827]">PKR {Number(p.price).toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
