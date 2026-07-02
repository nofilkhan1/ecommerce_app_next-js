'use client';

import Link from 'next/link';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import StorefrontLayout from '../../storefront-layout';

const USER_KEY = 'user-secret-key-2026';

interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt: string;
  type: 'primary' | 'gallery' | 'thumbnail';
  sort_order: number;
  width: number;
  height: number;
  file_size: number;
  created_at: string;
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

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  sale_price: number | null;
  images?: ProductImage[];
  primary_image?: string;
  category: string;
  gender: string;
  subcategory: string;
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

function getPrimaryImage(product: { images?: ProductImage[] }): string | null {
  if (product.images && product.images.length > 0) {
    const primary = product.images.find(img => img.type === 'primary');
    return primary?.url || product.images[0]?.url || null;
  }
  return null;
}

function getGalleryImages(product: Product): string[] {
  if (product.images && product.images.length > 0) {
    return product.images
      .filter(img => img.type !== 'primary')
      .map(img => img.url);
  }
  return product.gallery_images || [];
}

function formatPrice(price: number): string {
  return `PKR ${Number(price).toLocaleString()}`;
}

function getDiscountedPrice(price: number): number {
  return Math.round(price * 0.30);
}

function getSalePrice(product: { price: number; sale_price: number | null }): number {
  return getDiscountedPrice(product.price);
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showZoom, setShowZoom] = useState(false);
  const zoomRef = useRef<HTMLImageElement>(null);

  const loadProduct = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${id}`, { headers: { 'X-API-Key': USER_KEY } });
      const text = await res.text();
      if (!text) throw new Error('Empty response');
      const data = JSON.parse(text);
      if (data && (data.detail || data.message) && !data.id) throw new Error(data.detail || data.message);
      const productData = data.data || data;
      setProduct(productData);

      if (productData?.gender && productData?.subcategory) {
        const catRes = await fetch(`/api/products?gender=${productData.gender}&subcategory=${productData.subcategory}`, { headers: { 'X-API-Key': USER_KEY } });
        const catText = await catRes.text();
        if (catText) {
          try {
            const catData = JSON.parse(catText);
            const products = catData.data || catData;
            if (Array.isArray(products)) {
              setRelated(products.filter((p: RelatedProduct) => p.id !== productData.id).slice(0, 4));
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

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [product]);

  // Compute image count before any early return (React hooks rule)
  const allImagesCount = product
    ? (getPrimaryImage(product) ? [getPrimaryImage(product), ...getGalleryImages(product)] : getGalleryImages(product)).length
    : 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowZoom(false);
      if (e.key === 'ArrowLeft') setSelectedImageIndex(prev => Math.max(0, prev - 1));
      if (e.key === 'ArrowRight') setSelectedImageIndex(prev => Math.min(allImagesCount - 1, prev + 1));
    };
    if (showZoom) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.classList.add('drawer-open');
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('drawer-open');
    };
  }, [showZoom, allImagesCount]);

  if (loading) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] text-text-muted">Loading product...</p>
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (!product) {
    return (
      <StorefrontLayout>
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
          <div className="w-20 h-20 rounded-2xl bg-surface-overlay flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-faint">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <p className="text-text-secondary text-base font-medium">Product not found</p>
          <p className="text-text-faint text-[13px]">The product you are looking for does not exist or has been removed.</p>
          <Link href="/products" className="mt-2 inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-primary-hover transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const primaryImage = getPrimaryImage(product);
  const galleryImages = getGalleryImages(product);
  const allImages = primaryImage ? [primaryImage, ...galleryImages] : galleryImages;
  const genderLabel = GENDER_LABELS[product.gender] || product.gender;
  const subcatLabel = SUBCATEGORY_LABELS[product.subcategory] || product.category;
  const salePrice = getSalePrice(product);

  const genderParam = product.gender ? `gender=${product.gender}` : '';
  const catParam = product.subcategory ? `&subcategory=${product.subcategory}` : '';
  const browseUrl = `/products?${genderParam}${catParam}`;

  return (
    <StorefrontLayout>
      {/* Breadcrumb */}
      <div className="bg-surface-raised border-b border-border">
        <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-[11px] text-text-faint">
            <Link href="/" className="hover:text-text-primary transition">HOME</Link>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <Link href="/products" className="hover:text-text-primary transition">SHOP</Link>
            {product.gender && (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                <Link href={`/products?gender=${product.gender}`} className="hover:text-text-primary transition">{genderLabel}</Link>
              </>
            )}
            {product.subcategory && (
              <>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                <Link href={browseUrl} className="hover:text-text-primary transition">{subcatLabel}</Link>
              </>
            )}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
            <span className="text-text-secondary font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Product Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square bg-surface-raised rounded-xl overflow-hidden border border-border cursor-zoom-in"
              role="button"
              tabIndex={0}
              onClick={() => allImages.length > 0 && setShowZoom(true)}
              onKeyDown={(e) => e.key === 'Enter' && allImages.length > 0 && setShowZoom(true)}
            >
              {allImages.length > 0 ? (
                <img
                  src={allImages[selectedImageIndex]}
                  alt={`${product.name} - View ${selectedImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-text-faint">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p className="text-[13px] text-text-faint">No Image Available</p>
                  </div>
                </div>
              )}
              {allImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(i); }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === selectedImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                      }`}
                      aria-label={`View image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide" role="list" aria-label="Product images">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`flex-shrink-0 w-[72px] h-[72px] rounded-lg overflow-hidden border-2 transition-all ${
                      i === selectedImageIndex ? 'border-primary' : 'border-transparent hover:border-text-faint'
                    }`}
                    aria-label={`View image ${i + 1}`}
                    aria-current={i === selectedImageIndex ? 'true' : 'false'}
                  >
                    <img src={img} alt={`${product.name} - View ${i + 1}`} className="w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </button>
                ))}
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {product.gender && (
                <span className="badge" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                  {genderLabel}
                </span>
              )}
              {product.subcategory && (
                <span className="badge" style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-text-muted)' }}>
                  {subcatLabel}
                </span>
              )}
              {product.featured === 1 && (
                <span className="badge" style={{ background: 'var(--color-success-light)', color: '#166534' }}>
                  Featured
                </span>
              )}
              {product.brand && (
                <span className="badge" style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-text-muted)' }}>
                  {product.brand}
                </span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start space-y-5">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary leading-tight font-baskerville">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl font-bold text-sale">{formatPrice(salePrice)}</span>
              <span className="text-lg text-text-faint line-through">{formatPrice(product.price)}</span>
              <span className="badge badge-sale">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                70% OFF
              </span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              {product.stock > 0 ? (
                <div className="inline-flex items-center gap-2 bg-success-light border border-green-200 text-green-800 px-4 py-2 rounded-lg text-[13px] font-medium">
                  <span className="w-2 h-2 bg-success rounded-full flex-shrink-0" />
                  <span>In Stock</span>
                  <span className="text-[11px] opacity-70">({product.stock} available)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-danger-light border border-red-200 text-red-800 px-4 py-2 rounded-lg text-[13px] font-medium">
                  <span className="w-2 h-2 bg-danger rounded-full flex-shrink-0" />
                  <span>Out of Stock</span>
                </div>
              )}
              {product.sku && (
                <span className="text-[11px] text-text-faint font-mono ml-auto">SKU: {product.sku}</span>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-text-muted text-[13px] leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Description */}
            {product.description && (
              <div className="border-t border-border pt-5">
                <h3 className="text-[11px] font-semibold tracking-[0.08em] text-text-secondary uppercase mb-3">Description</h3>
                <div className="text-[13px] text-text-muted leading-relaxed whitespace-pre-wrap">
                  {product.description}
                </div>
              </div>
            )}

            {/* Product Details */}
            {(product.sizes || product.colors || product.materials) && (
              <div className="border-t border-border pt-5 space-y-4">
                <h3 className="text-[11px] font-semibold tracking-[0.08em] text-text-secondary uppercase mb-3">Details</h3>
                <dl className="space-y-3">
                  {product.sizes && (
                    <div>
                      <dt className="text-[11px] font-medium text-text-faint uppercase tracking-wide mb-1.5">Sizes</dt>
                      <dd className="text-[13px] text-text-secondary flex flex-wrap gap-1.5">
                        {product.sizes.split(',').map(s => s.trim()).filter(Boolean).map((size, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-text-muted bg-surface-overlay rounded-lg">{size}</span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {product.colors && (
                    <div>
                      <dt className="text-[11px] font-medium text-text-faint uppercase tracking-wide mb-1.5">Colors</dt>
                      <dd className="text-[13px] text-text-secondary flex flex-wrap gap-1.5">
                        {product.colors.split(',').map(c => c.trim()).filter(Boolean).map((color, i) => (
                          <span key={i} className="inline-flex items-center px-2.5 py-1 text-[11px] font-medium text-text-muted bg-surface-overlay rounded-lg">{color}</span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {product.materials && (
                    <div>
                      <dt className="text-[11px] font-medium text-text-faint uppercase tracking-wide mb-1.5">Materials</dt>
                      <dd className="text-[13px] text-text-secondary">{product.materials}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="border-t border-border pt-5">
              <label className="text-[11px] font-semibold text-text-secondary mb-3 block">Quantity</label>
              <div className="inline-flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                  className="w-11 h-11 flex items-center justify-center text-text-secondary hover:bg-surface-overlay transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock || 99}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 99, parseInt(e.target.value) || 1)))}
                  className="w-14 h-11 flex items-center justify-center text-[13px] font-semibold text-text-primary border-x border-border focus:outline-none focus:ring-2 focus:ring-primary/30 text-center"
                  aria-label="Quantity"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  disabled={product.stock === 0 || quantity >= (product.stock || 99)}
                  className="w-11 h-11 flex items-center justify-center text-text-secondary hover:bg-surface-overlay transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {product.stock > 0 && product.stock <= 10 && (
                <p className="mt-2 text-[11px] text-warning">Only {product.stock} left in stock!</p>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-4 border-t border-border">
              <button
                disabled={product.stock === 0}
                className="w-full bg-primary text-white py-3.5 text-[13px] font-semibold tracking-wide hover:bg-primary-hover active:bg-primary-active disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
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
                className="w-full border-2 border-primary text-primary py-3.5 text-[13px] font-semibold tracking-wide hover:bg-primary-light active:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all rounded-xl"
              >
                BUY NOW
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-5 border-t border-border grid grid-cols-2 gap-4">
              {[
                { icon: '🚚', text: 'Free Delivery on PKR 5,000+' },
                { icon: '⏱', text: 'Delivery in 3-5 Days' },
                { icon: '↩', text: 'Easy 30-Day Returns' },
                { icon: '🔒', text: 'Secure Payment' },
              ].map((f) => (
                <div key={f.text} className="flex items-center gap-2.5 text-[11px] text-text-muted">
                  <span className="text-sm">{f.icon}</span>
                  {f.text}
                </div>
              ))}
            </div>

            {/* Share */}
            <div className="pt-5 border-t border-border">
              <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wide mb-3">Share this product</p>
              <div className="flex gap-2">
                {[
                  { label: 'Facebook', path: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
                  { label: 'Twitter', path: <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" /> },
                  { label: 'WhatsApp', path: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.152-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.466-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378 9.86 9.86 0 01.39-5.662h-.084c-1.446.83-2.463 2.384-2.463 4.229 0 3.785 2.8 6.848 6.253 6.848 2.066 0 3.902-.797 5.008-2.071l-.625-.622a3.18 3.18 0 01-2.125.613c-.526 0-1.008-.247-1.298-.566l-.12-.134-1.003.827c-.293.24-.579.372-.898.438s-.646.054-.953-.086c-.42-.198-.724-.57-.724-1.015 0-.54.383-.834.734-1.054.203-.128.406-.26.554-.442.15-.177.28-.368.388-.566.1-.198.05-.384-.025-.521-.075-.148-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.478 0 1.463 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.227 1.36.194 1.871.118.571-.085 1.759-.719 2.007-1.413.248-.695.248-1.289.173-1.413-.075-.124-.272-.198-.57-.347z" /> },
                ].map((s) => (
                  <button key={s.label} className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-text-muted hover:bg-surface-overlay hover:text-text-primary transition" aria-label={`Share on ${s.label}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">{s.path}</svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-text-primary font-baskerville">You May Also Like</h2>
                <div className="w-8 h-[2px] bg-primary mt-2 rounded-full" />
              </div>
              <Link href={browseUrl} className="text-[11px] font-bold text-primary hover:text-primary-hover transition tracking-wide">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => {
                const pPrimaryImage = getPrimaryImage(p);
                const pSalePrice = getSalePrice(p);
                return (
                  <Link key={p.id} href={`/products/${p.id}`} className="product-card group bg-white rounded-xl border border-border-light overflow-hidden">
                    <div className="aspect-square bg-surface-overlay overflow-hidden">
                      {pPrimaryImage ? (
                        <img src={pPrimaryImage} alt={p.name} className="product-card-image w-full h-full object-cover" loading="lazy" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-text-faint text-[11px]">No Image</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] text-text-faint mb-1 tracking-[0.05em] uppercase">{p.category}</p>
                      <p className="text-[13px] font-medium text-text-secondary truncate mb-1">{p.name}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[13px] font-bold text-sale">{formatPrice(pSalePrice)}</span>
                        <span className="text-[11px] text-text-faint line-through">{formatPrice(p.price)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Image Zoom Modal */}
      {showZoom && allImages.length > 0 && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90"
          onClick={() => setShowZoom(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image zoom"
        >
          <div className="relative w-full max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowZoom(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Close zoom"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="relative aspect-square">
              <img
                ref={zoomRef}
                src={allImages[selectedImageIndex]}
                alt={`${product.name} - Zoomed view ${selectedImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
            {allImages.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === selectedImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </StorefrontLayout>
  );
}
