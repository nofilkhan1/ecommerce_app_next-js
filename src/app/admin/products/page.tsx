'use client';

import { useEffect, useState, useCallback } from 'react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Input, { Textarea, Select } from '@/components/ui/input';
import Modal from '@/components/ui/modal';
import EmptyState from '@/components/ui/empty-state';
import Table, { TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { TableSkeleton } from '@/components/ui/skeleton';

const ADMIN_KEY = 'admin-secret-key-2026';
const API = '/api/products';

const CATEGORIES = [
  { value: '', label: 'Select category...' },
  { value: 'SUMMER COLLECTION', label: 'Summer Collection' },
  { value: 'CO-ORDS', label: 'Co-ords' },
  { value: 'READY TO WEAR', label: 'Ready to Wear' },
  { value: 'UNSTITCHED', label: 'Unstitched' },
  { value: 'FORMALS', label: 'Formals' },
  { value: 'ACCESSORIES', label: 'Accessories' },
];

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  created_at: string;
  updated_at: string;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  discount: string;
  tax: string;
  stock: string;
  sku: string;
  barcode: string;
  category: string;
  brand: string;
  tags: string;
  image_url: string;
  slug: string;
  meta_title: string;
  meta_description: string;
}

const EMPTY_FORM: FormData = {
  name: '', description: '', price: '', discount: '', tax: '',
  stock: '0', sku: '', barcode: '', category: '', brand: '', tags: '',
  image_url: '', slug: '', meta_title: '', meta_description: '',
};

function getStatus(product: Product) {
  if (product.stock === 0) return { label: 'Out of Stock', variant: 'danger' as const };
  if (product.stock <= 5) return { label: 'Low Stock', variant: 'warning' as const };
  return { label: 'Active', variant: 'success' as const };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const load = useCallback(() => {
    fetch(API, { headers: { 'X-API-Key': ADMIN_KEY } })
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  let filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  if (filterCategory) {
    filtered = filtered.filter((p) => p.category === filterCategory);
  }

  if (sortBy === 'newest') filtered.sort((a, b) => (b.id || 0) - (a.id || 0));
  else if (sortBy === 'oldest') filtered.sort((a, b) => (a.id || 0) - (b.id || 0));
  else if (sortBy === 'price-high') filtered.sort((a, b) => Number(b.price) - Number(a.price));
  else if (sortBy === 'price-low') filtered.sort((a, b) => Number(a.price) - Number(b.price));
  else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setImagePreview('');
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setEditing(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      discount: '',
      tax: '',
      stock: String(p.stock),
      sku: '',
      barcode: '',
      category: p.category,
      brand: '',
      tags: '',
      image_url: p.image_url,
      slug: p.name.toLowerCase().replace(/\s+/g, '-'),
      meta_title: p.name,
      meta_description: p.description,
    });
    setImagePreview(p.image_url);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    setImagePreview('');
  }

  function updateForm(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'image_url') setImagePreview(value);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const body = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
      category: form.category.trim(),
      image_url: form.image_url.trim(),
    };

    const url = editing ? `${API}/${editing}` : API;
    const method = editing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-API-Key': ADMIN_KEY },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json();
        alert('Error: ' + (err.detail || 'Unknown'));
        return;
      }
      closeModal();
      load();
    } catch (err: unknown) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE', headers: { 'X-API-Key': ADMIN_KEY } });
      load();
    } catch (err: unknown) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111]">Products</h1>
          <p className="text-sm text-[#6b7280] mt-1">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
        </div>
        <Button onClick={openCreate}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#f9fafb] border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5e7eb] focus:border-[#111] transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2.5 text-sm bg-white border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5e7eb] focus:border-[#111] transition-all"
            >
              <option value="">All Categories</option>
              {CATEGORIES.filter((c) => c.value).map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2.5 text-sm bg-white border border-[#e5e7eb] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5e7eb] focus:border-[#111] transition-all"
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
          <div className="p-6">
            <TableSkeleton rows={5} cols={6} />
          </div>
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
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => {
                const status = getStatus(p);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#f3f4f6] overflow-hidden flex-shrink-0">
                          {p.image_url ? (
                            <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[#d1d5db] text-xs">—</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-[#111]">{p.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-[#6b7280]">{p.category || '—'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[#111]">PKR {Number(p.price).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className={p.stock <= 5 ? 'text-[#d97706] font-medium' : 'text-[#6b7280]'}>{p.stock}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg text-[#6b7280] hover:text-[#111] hover:bg-[#f3f4f6] transition-colors"
                          title="Edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          className="p-2 rounded-lg text-[#6b7280] hover:text-[#ef4444] hover:bg-[#fef2f2] transition-colors"
                          title="Delete"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        maxWidth="max-w-[700px]"
      >
        <form onSubmit={save} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">Basic Information</h3>
            <div className="space-y-4">
              <Input
                label="Product Name"
                required
                value={form.name}
                onChange={(e) => updateForm('name', e.target.value)}
                placeholder="Enter product name"
              />
              <Textarea
                label="Description"
                rows={3}
                value={form.description}
                onChange={(e) => updateForm('description', e.target.value)}
                placeholder="Product description"
              />
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">Pricing</h3>
            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={form.price}
                onChange={(e) => updateForm('price', e.target.value)}
                placeholder="0.00"
              />
              <Input
                label="Discount"
                type="number"
                step="0.01"
                min="0"
                value={form.discount}
                onChange={(e) => updateForm('discount', e.target.value)}
                placeholder="0.00"
                hint="Optional"
              />
              <Input
                label="Tax"
                type="number"
                step="0.01"
                min="0"
                value={form.tax}
                onChange={(e) => updateForm('tax', e.target.value)}
                placeholder="0.00"
                hint="Optional"
              />
            </div>
          </div>

          {/* Inventory */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">Inventory</h3>
            <div className="grid grid-cols-3 gap-4">
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
                placeholder="Optional"
              />
              <Input
                label="Barcode"
                value={form.barcode}
                onChange={(e) => updateForm('barcode', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Organization */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">Organization</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Category"
                value={form.category}
                onChange={(e) => updateForm('category', e.target.value)}
                options={CATEGORIES}
              />
              <Input
                label="Brand"
                value={form.brand}
                onChange={(e) => updateForm('brand', e.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>

          {/* Media */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">Media</h3>
            <Input
              label="Image URL"
              type="url"
              value={form.image_url}
              onChange={(e) => updateForm('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
              hint="Paste a direct image URL"
            />
            {imagePreview && (
              <div className="mt-3">
                <div className="w-24 h-24 rounded-xl border border-[#e5e7eb] overflow-hidden bg-[#f9fafb]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" onError={() => setImagePreview('')} />
                </div>
              </div>
            )}
          </div>

          {/* SEO */}
          <div>
            <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-3">SEO</h3>
            <div className="space-y-4">
              <Input
                label="Slug"
                value={form.slug}
                onChange={(e) => updateForm('slug', e.target.value)}
                placeholder="auto-generated-from-name"
                hint="URL-friendly identifier"
              />
              <Input
                label="Meta Title"
                value={form.meta_title}
                onChange={(e) => updateForm('meta_title', e.target.value)}
                placeholder="SEO title"
              />
              <Textarea
                label="Meta Description"
                rows={2}
                value={form.meta_description}
                onChange={(e) => updateForm('meta_description', e.target.value)}
                placeholder="SEO description"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f3f4f6]">
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
