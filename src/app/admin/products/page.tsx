'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Input, { Textarea, Select } from '@/components/ui/input';
import Modal from '@/components/ui/modal';
import EmptyState from '@/components/ui/empty-state';
import Table, { TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { TableSkeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';

const ADMIN_KEY = 'admin-secret-key-2026';
const API = '/api/products';
const IMAGES_API = '/api/images';

const GENDERS = [
  { value: '', label: 'Select gender...' },
  { value: 'WOMEN', label: 'Women' },
  { value: 'MEN', label: 'Men' },
  { value: 'TEENS', label: 'Teens' },
];

const SUBCATEGORIES = [
  { value: '', label: 'Select subcategory...' },
  { value: 'summer-collection', label: 'Summer Collection' },
  { value: 'co-ords', label: 'Co-ords' },
  { value: 'ready-to-wear', label: 'Ready to Wear' },
  { value: 'unstitched', label: 'Unstitched' },
  { value: 'formals', label: 'Formals' },
  { value: 'accessories', label: 'Accessories' },
];

const CATEGORY_DISPLAY: Record<string, string> = {
  'summer-collection': 'SUMMER COLLECTION',
  'co-ords': 'CO-ORDS',
  'ready-to-wear': 'READY TO WEAR',
  'unstitched': 'UNSTITCHED',
  'formals': 'FORMALS',
  'accessories': 'ACCESSORIES',
};

const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

const VISIBILITIES = [
  { value: 'visible', label: 'Visible' },
  { value: 'hidden', label: 'Hidden' },
];

const COLLECTIONS = [
  { value: '', label: 'Select collection...' },
  { value: 'summer-2026', label: 'Summer 2026' },
  { value: 'premium', label: 'Premium' },
  { value: 'signature', label: 'Signature' },
  { value: 'essentials', label: 'Essentials' },
  { value: 'bridal', label: 'Bridal' },
  { value: 'festive', label: 'Festive' },
  { value: 'resort', label: 'Resort' },
  { value: 'winter-2026', label: 'Winter 2026' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'fragrance', label: 'Fragrance' },
];

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

interface FormData {
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string;
  price: string;
  sale_price: string;
  stock: string;
  category: string;
  gender: string;
  subcategory: string;
  collection: string;
  brand: string;
  status: string;
  visibility: string;
  featured: boolean;
  tags: string;
  sizes: string;
  colors: string;
  materials: string;
  weight: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  meta_title: string;
  meta_description: string;
  images: ProductImage[];
  primary_image_url: string;
}

const EMPTY_FORM: FormData = {
  name: '', slug: '', sku: '', description: '', short_description: '',
  price: '', sale_price: '', stock: '0', category: '', gender: '', subcategory: '', collection: '', brand: '',
  status: 'draft', visibility: 'visible', featured: false, tags: '',
  sizes: '', colors: '', materials: '', weight: '0',
  seo_title: '', seo_description: '', seo_keywords: '',
  meta_title: '', meta_description: '',
  images: [],
  primary_image_url: '',
};

function getStatus(product: Product) {
  if (product.stock === 0) return { label: 'Out of Stock', variant: 'danger' as const };
  if (product.stock <= 5) return { label: 'Low Stock', variant: 'warning' as const };
  return { label: 'Active', variant: 'success' as const };
}

async function safeJson(response: Response): Promise<Record<string, unknown> | null> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function getErrorMessage(response: Response, data: Record<string, unknown> | null): string {
  if (data && typeof data.message === 'string') return data.message;
  if (data && typeof data.detail === 'string') return data.detail;
  switch (response.status) {
    case 400: return 'Invalid request. Please check your input.';
    case 401: return 'Unauthorized. Invalid API key.';
    case 404: return 'Resource not found.';
    case 500: return 'Server error. Please try again later.';
    default: return `Request failed (${response.status})`;
  }
}

function formatPrice(price: number): string {
  return `PKR ${Number(price).toLocaleString()}`;
}

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function AdminProducts() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(API, { headers: { 'X-API-Key': ADMIN_KEY } });
      const data = await safeJson(res);
      if (data && Array.isArray(data.data)) {
        setProducts(data.data as Product[]);
      } else if (Array.isArray(data)) {
        setProducts(data as Product[]);
      } else if (!res.ok) {
        toast('error', getErrorMessage(res, data));
      }
    } catch {
      toast('error', 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  let filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.gender || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(search.toLowerCase())
  );

  if (filterGender) {
    filtered = filtered.filter((p) => p.gender === filterGender);
  }
  if (filterCategory) {
    filtered = filtered.filter((p) => p.subcategory === filterCategory);
  }
  if (filterStatus) {
    filtered = filtered.filter((p) => p.status === filterStatus);
  }

  if (sortBy === 'newest') filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
  else if (sortBy === 'oldest') filtered.sort((a, b) => (a.id || 0) - (b.id || 0));
  else if (sortBy === 'price-high') filtered.sort((a, b) => Number(b.price) - Number(a.price));
  else if (sortBy === 'price-low') filtered.sort((a, b) => Number(a.price) - Number(b.price));
  else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  function openCreate() {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setEditing(p.id);
    const primaryImage = p.images?.find(img => img.type === 'primary') || p.images?.[0];
    setForm({
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      short_description: p.short_description,
      price: String(p.price),
      sale_price: p.sale_price !== null ? String(p.sale_price) : '',
      stock: String(p.stock),
      category: CATEGORY_DISPLAY[p.subcategory] || p.category,
      gender: p.gender || '',
      subcategory: p.subcategory || '',
      collection: p.collection || '',
      brand: p.brand || '',
      status: p.status || 'draft',
      visibility: p.visibility || 'visible',
      featured: p.featured === 1,
      tags: p.tags,
      sizes: p.sizes,
      colors: p.colors,
      materials: p.materials,
      weight: String(p.weight || 0),
      seo_title: p.seo_title,
      seo_description: p.seo_description,
      seo_keywords: p.seo_keywords,
      meta_title: p.meta_title,
      meta_description: p.meta_description,
      images: p.images || [],
      primary_image_url: primaryImage?.url || '',
    });
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
  }

  function updateForm(field: keyof FormData, value: string | boolean | ProductImage[]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slug || generateSlug(value),
      seo_title: prev.seo_title || `${value} | J. (Junaid Jamshed)`,
      meta_title: prev.meta_title || `${value} | J. (Junaid Jamshed)`,
    }));
  }

  function handleShortDescriptionChange(value: string) {
    setForm((prev) => ({
      ...prev,
      short_description: value,
      seo_description: prev.seo_description || value,
      meta_description: prev.meta_description || value,
    }));
  }

  async function uploadImages(files: FileList) {
    if (!editing) {
      toast('error', 'Please save the product first before uploading images');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }
    formData.append('product_id', String(editing));

    try {
      const res = await fetch(IMAGES_API, {
        method: 'POST',
        headers: { 'X-API-Key': ADMIN_KEY },
        body: formData,
      });

      const data = await safeJson(res);
      if (!res.ok) {
        toast('error', getErrorMessage(res, data));
        return;
      }

      toast('success', `${files.length} image(s) uploaded successfully`);
      load();
      closeModal();
      openEdit(products.find(p => p.id === editing)!);
    } catch {
      toast('error', 'Network error during upload');
    } finally {
      setUploading(false);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadImages(e.dataTransfer.files);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadImages(e.target.files);
      e.target.value = '';
    }
  }

  async function deleteImage(imageId: number) {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch(`${IMAGES_API}?id=${imageId}`, {
        method: 'DELETE',
        headers: { 'X-API-Key': ADMIN_KEY },
      });
      const data = await safeJson(res);
      if (!res.ok) {
        toast('error', getErrorMessage(res, data));
        return;
      }
      toast('success', 'Image deleted');
      load();
      if (editing) {
        closeModal();
        openEdit(products.find(p => p.id === editing)!);
      }
    } catch {
      toast('error', 'Network error');
    }
  }

  async function setPrimaryImage(imageId: number) {
    try {
      const res = await fetch(IMAGES_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-API-Key': ADMIN_KEY },
        body: JSON.stringify({ id: imageId, type: 'primary' }),
      });
      const data = await safeJson(res);
      if (!res.ok) {
        toast('error', getErrorMessage(res, data));
        return;
      }
      toast('success', 'Primary image updated');
      if (editing) {
        closeModal();
        openEdit(products.find(p => p.id === editing)!);
      }
    } catch {
      toast('error', 'Network error');
    }
  }

  async function reorderImages(newImages: ProductImage[]) {
    if (!editing) return;
    try {
      for (let i = 0; i < newImages.length; i++) {
        await fetch(IMAGES_API, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': ADMIN_KEY },
          body: JSON.stringify({ id: newImages[i].id, sort_order: i, type: i === 0 ? 'primary' : 'gallery' }),
        });
      }
      toast('success', 'Image order updated');
      load();
      closeModal();
      openEdit(products.find(p => p.id === editing)!);
    } catch {
      toast('error', 'Network error');
    }
  }

  function moveImage(images: ProductImage[], fromIndex: number, toIndex: number) {
    const newImages = [...images];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    return newImages;
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const body = {
      name: form.name.trim(),
      slug: form.slug.trim() || generateSlug(form.name),
      sku: form.sku.trim(),
      description: form.description.trim(),
      short_description: form.short_description.trim(),
      price: parseFloat(form.price),
      sale_price: form.sale_price ? parseFloat(form.sale_price) : null,
      stock: parseInt(form.stock) || 0,
      category: CATEGORY_DISPLAY[form.subcategory] || form.subcategory.trim(),
      gender: form.gender.trim(),
      subcategory: form.subcategory.trim(),
      collection: form.collection.trim(),
      brand: form.brand.trim(),
      status: form.status,
      visibility: form.visibility,
      featured: form.featured ? 1 : 0,
      tags: form.tags.trim(),
      sizes: form.sizes.trim(),
      colors: form.colors.trim(),
      materials: form.materials.trim(),
      weight: parseFloat(form.weight) || 0,
      seo_title: form.seo_title.trim(),
      seo_description: form.seo_description.trim(),
      seo_keywords: form.seo_keywords.trim(),
      meta_title: form.meta_title.trim(),
      meta_description: form.meta_description.trim(),
    };

    const url = editing ? `${API}/${editing}` : API;
    const method = editing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-API-Key': ADMIN_KEY },
        body: JSON.stringify(body),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        toast('error', getErrorMessage(res, data));
        return;
      }

      toast('success', editing ? 'Product updated successfully' : 'Product created successfully');
      closeModal();
      load();
    } catch {
      toast('error', 'Network error. Please check your connection.');
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    try {
      const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: { 'X-API-Key': ADMIN_KEY } });
      const data = await safeJson(res);

      if (!res.ok) {
        toast('error', getErrorMessage(res, data));
        return;
      }

      toast('success', 'Product deleted successfully');
      load();
    } catch {
      toast('error', 'Network error. Please check your connection.');
    }
  }

  const primaryImage = form.images.find(img => img.type === 'primary');
  const galleryImages = form.images.filter(img => img.type !== 'primary');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Products</h1>
          <p className="text-sm text-[#6b7280] mt-1">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={openCreate} size="md">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Product
        </Button>
      </div>

      {/* Toolbar */}
      <Card>
        <div className="px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search products by name, SKU, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#f9fafb] border border-[#d1d5db] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#2563eb] focus:bg-white transition-all placeholder:text-[#9ca3af]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="px-3.5 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#2563eb] transition-all cursor-pointer"
            >
              <option value="">All Genders</option>
              {GENDERS.filter((g) => g.value).map((g) => (
                <option key={g.value} value={g.value}>{g.label}</option>
              ))}
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3.5 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#2563eb] transition-all cursor-pointer"
            >
              <option value="">All Categories</option>
              {SUBCATEGORIES.filter((c) => c.value).map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3.5 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#2563eb] transition-all cursor-pointer"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2.5 text-sm bg-white border border-[#d1d5db] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:border-[#2563eb] transition-all cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        {loading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={products.length === 0 ? '📦' : '🔍'}
            title={products.length === 0 ? 'No products yet' : 'No products found'}
            description={products.length === 0 ? 'Get started by adding your first product to the store.' : 'Try adjusting your search or filter criteria.'}
            action={products.length === 0 ? <Button onClick={openCreate}>Add Product</Button> : undefined}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const status = getStatus(p);
                const primaryImg = p.images?.find(img => img.type === 'primary') || p.images?.[0];
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-xl bg-[#f3f4f6] overflow-hidden flex-shrink-0 border border-[#e5e7eb]">
                          {primaryImg?.url ? (
                            <img src={primaryImg.url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#d1d5db] text-xs">—</div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-[#111827] block">{p.name}</span>
                          <span className="text-xs text-[#9ca3af]">{p.gender} • {p.subcategory}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[#6b7280] font-mono text-xs">{p.sku || '—'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-[#6b7280]">{p.category || '—'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-[#111827]">{formatPrice(p.price)}</span>
                        {p.sale_price !== null && p.sale_price !== undefined && (
                          <span className="text-sm text-[#dc2626] line-through">{formatPrice(p.sale_price)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={p.stock <= 5 ? 'text-[#d97706] font-semibold' : 'text-[#6b7280]'}>{p.stock}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} dot>{status.label}</Badge>
                      <Badge variant={p.featured === 1 ? 'success' : 'outline'} className="ml-1 text-[10px]">
                        {p.featured === 1 ? 'Featured' : 'Normal'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2.5 rounded-xl text-[#6b7280] hover:text-[#2563eb] hover:bg-[#eff6ff] transition-colors"
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          className="p-2.5 rounded-xl text-[#6b7280] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-colors"
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        open={showModal}
        onClose={closeModal}
        title={editing ? 'Edit Product' : 'Add Product'}
        description={editing ? 'Update the product details below.' : 'Fill in the details to create a new product.'}
        maxWidth="max-w-[900px]"
      >
        <form onSubmit={save} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-4">Basic Information</h3>
            <div className="space-y-4">
              <Input
                label="Product Name"
                required
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Enter product name"
              />
              <Textarea
                label="Description"
                rows={4}
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Full product description for product page"
              />
              <Textarea
                label="Short Description"
                rows={2}
                value={form.short_description}
                onChange={(e) => handleShortDescriptionChange(e.target.value)}
                placeholder="Brief summary for product cards and listings"
                hint="Used in product listings and category pages"
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-4">Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Price (PKR)"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={form.price}
                onChange={(e) => updateForm('price', e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Sale Price (PKR)"
                type="number"
                step="0.01"
                min="0"
                value={form.sale_price}
                onChange={(e) => updateForm('sale_price', e.target.value)}
                placeholder="0.00"
                hint="Optional - must be less than regular price"
              />
              <Input
                label="Cost Price (PKR)"
                type="number"
                step="0.01"
                min="0"
                value={form.weight}
                onChange={(e) => updateForm('weight', e.target.value)}
                placeholder="0.00"
                hint="Optional - for internal reference"
              />
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-4">Inventory</h3>
            <div className="grid grid-cols-4 gap-4">
              <Input
                label="Stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => updateForm('stock', e.target.value)}
              />
              <Input
                label="SKU"
                value={form.sku}
                onChange={(e) => updateForm('sku', e.target.value)}
                placeholder="Auto-generated if empty"
                hint="Unique product identifier"
              />
              <Input
                label="Weight (kg)"
                type="number"
                step="0.01"
                min="0"
                value={form.weight}
                onChange={(e) => updateForm('weight', e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Barcode"
                value={''}
                onChange={() => {}}
                placeholder="Optional"
                hint="EAN/UPC barcode"
              />
            </div>
          </div>

          {/* Organization */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-4">Organization</h3>
            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Gender"
                value={form.gender}
                onChange={(e) => updateForm('gender', e.target.value)}
                options={GENDERS}
              />
              <Select
                label="Subcategory"
                value={form.subcategory}
                onChange={(e) => updateForm('subcategory', e.target.value)}
                options={SUBCATEGORIES}
              />
              <Select
                label="Collection"
                value={form.collection}
                onChange={(e) => updateForm('collection', e.target.value)}
                options={COLLECTIONS}
              />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <Input
                label="Brand"
                value={form.brand}
                onChange={(e) => updateForm('brand', e.target.value)}
                placeholder="J."
              />
              <Select
                label="Status"
                value={form.status}
                onChange={(e) => updateForm('status', e.target.value)}
                options={STATUSES}
              />
              <Select
                label="Visibility"
                value={form.visibility}
                onChange={(e) => updateForm('visibility', e.target.value)}
                options={VISIBILITIES}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Input
                label="Sizes (comma-separated)"
                value={form.sizes}
                onChange={(e) => updateForm('sizes', e.target.value)}
                placeholder="S,M,L,XL or 39,40,41,42"
              />
              <Input
                label="Colors (comma-separated)"
                value={form.colors}
                onChange={(e) => updateForm('colors', e.target.value)}
                placeholder="Black,White,Blue,Red"
              />
            </div>
            <div className="mt-4">
              <Input
                label="Materials"
                value={form.materials}
                onChange={(e) => updateForm('materials', e.target.value)}
                placeholder="Cotton, Silk, Leather, etc."
              />
            </div>
            <div className="mt-4">
              <Input
                label="Tags (comma-separated)"
                value={form.tags}
                onChange={(e) => updateForm('tags', e.target.value)}
                placeholder="summer, casual, printed, women"
                hint="Used for filtering and search"
              />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => updateForm('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-[#d1d5db] text-[#2563eb] focus:ring-2 focus:ring-[#bfdbfe]"
                />
                <span className="text-sm text-[#374151]">Featured Product</span>
              </label>
            </div>
          </div>

          {/* Media / Images */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-4">Media & Images</h3>
            
            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragOver 
                  ? 'border-[#2563eb] bg-[#eff6ff]' 
                  : 'border-[#d1d5db] hover:border-[#2563eb]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="mx-auto mb-3">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <p className="text-sm text-[#6b7280] mb-1">
                {uploading ? 'Uploading...' : 'Drag & drop images here, or click to browse'}
              </p>
              <p className="text-xs text-[#9ca3af]">JPEG, PNG, WebP, GIF • Max 10MB each</p>
            </div>

            {/* Primary Image Preview */}
            {primaryImage && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[#374151]">Primary Image</p>
                  <Badge variant="success" dot className="text-[10px]">Primary</Badge>
                </div>
                <div className="relative w-48 h-48 rounded-xl border border-[#e5e7eb] overflow-hidden bg-[#f9fafb]">
                  <img src={primaryImage.url} alt="Primary" className="w-full h-full object-cover" onError={() => updateForm('primary_image_url', '')} />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => setPrimaryImage(primaryImage.id)}
                      className="p-2 rounded-lg bg-white/90 text-[#6b7280] hover:text-[#2563eb] hover:bg-white transition-colors"
                      title="Set as primary"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteImage(primaryImage.id)}
                      className="p-2 rounded-lg bg-white/90 text-[#6b7280] hover:text-[#dc2626] hover:bg-white transition-colors"
                      title="Delete"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Gallery Images */}
            {galleryImages.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-[#374151]">Gallery Images ({galleryImages.length})</p>
                  <p className="text-xs text-[#9ca3af]">Drag to reorder • First image becomes primary</p>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {galleryImages.map((img, index) => (
                    <div key={img.id} className="relative flex-shrink-0 w-32 h-32 rounded-xl border border-[#e5e7eb] overflow-hidden bg-[#f9fafb]">
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setPrimaryImage(img.id)}
                          className="p-2 rounded-lg bg-white text-[#6b7280] hover:text-[#2563eb] transition-colors"
                          title="Set as primary"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 6v6l4 2" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteImage(img.id)}
                          className="p-2 rounded-lg bg-white text-[#6b7280] hover:text-[#dc2626] transition-colors"
                          title="Delete"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <span className="absolute bottom-1 left-1 right-1 text-center text-xs font-medium text-white bg-black/50 px-1 rounded">
                        {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {form.images.length === 0 && !editing && (
              <p className="mt-4 text-sm text-[#9ca3af] text-center">
                Save the product first, then upload images.
              </p>
            )}
          </div>

          {/* SEO */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-widest mb-4">SEO</h3>
            <div className="space-y-4">
              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => updateForm('slug', e.target.value)}
                placeholder="auto-generated-from-name"
                hint="URL-friendly identifier (auto-generated from name)"
              />
              <Input
                label="Meta Title"
                value={form.meta_title}
                onChange={(e) => updateForm('meta_title', e.target.value)}
                placeholder="SEO title"
                hint="Max 60 characters for best results"
              />
              <Textarea
                label="Meta Description"
                rows={2}
                value={form.meta_description}
                onChange={(e) => updateForm('meta_description', e.target.value)}
                placeholder="SEO description"
                hint="Max 160 characters for best results"
              />
              <Input
                label="SEO Keywords"
                value={form.seo_keywords}
                onChange={(e) => updateForm('seo_keywords', e.target.value)}
                placeholder="comma, separated, keywords"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#f3f4f6]">
            <Button type="button" variant="secondary" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              {editing ? 'Update Product' : 'Save Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}