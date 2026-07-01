'use client';

import { useEffect, useState, useCallback } from 'react';

const ADMIN_KEY = 'admin-secret-key-2026';
const API = '/api/products';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
}

const EMPTY_FORM = { name: '', description: '', price: '', stock: '0', category: '', image_url: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch(API, { headers: { 'X-API-Key': ADMIN_KEY } })
      .then((r) => r.json())
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setEditing(p.id);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
      category: p.category,
      image_url: p.image_url,
    });
    setShowModal(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
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
      setShowModal(false);
      load();
    } catch (err: unknown) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  }

  async function remove(id: number) {
    if (!confirm('Delete this product?')) return;
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE', headers: { 'X-API-Key': ADMIN_KEY } });
      load();
    } catch (err: unknown) {
      alert('Error: ' + (err instanceof Error ? err.message : 'Unknown'));
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Products</h1>
        <button onClick={openCreate} className="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition">
          + Add Product
        </button>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border border-neutral-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-neutral-900"
      />

      {loading ? (
        <p className="text-neutral-500 text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-neutral-500">
          {products.length === 0 ? 'No products yet. Click "+ Add Product" to get started.' : 'No products match your search.'}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-500 uppercase text-xs bg-neutral-50 border-b">
                <th className="p-3 font-medium">ID</th>
                <th className="p-3 font-medium">Image</th>
                <th className="p-3 font-medium">Name</th>
                <th className="p-3 font-medium">Category</th>
                <th className="p-3 font-medium">Price</th>
                <th className="p-3 font-medium">Stock</th>
                <th className="p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0 hover:bg-neutral-50">
                  <td className="p-3">{p.id}</td>
                  <td className="p-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="w-12 h-12 object-cover rounded-md bg-neutral-100" />
                    ) : (
                      <span className="text-neutral-300 text-lg">—</span>
                    )}
                  </td>
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-neutral-600">{p.category || '—'}</td>
                  <td className="p-3">${Number(p.price).toFixed(2)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3 space-x-2">
                    <button onClick={() => openEdit(p)} className="text-xs bg-neutral-100 hover:bg-neutral-200 px-3 py-1.5 rounded-md transition">
                      Edit
                    </button>
                    <button onClick={() => remove(p.id)} className="text-xs bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 rounded-md transition">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setShowModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-7 w-[90%] max-w-lg z-50 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setShowModal(false)} className="text-neutral-400 hover:text-neutral-700 text-2xl">&times;</button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-900" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-900" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Price *</label>
                  <input type="number" step="0.01" min="0.01" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-900" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-900 bg-white">
                  <option value="">Select category...</option>
                  <option value="SUMMER COLLECTION">SUMMER COLLECTION</option>
                  <option value="CO-ORDS">CO-ORDS</option>
                  <option value="READY TO WEAR">READY TO WEAR</option>
                  <option value="UNSTITCHED">UNSTITCHED</option>
                  <option value="FORMALS">FORMALS</option>
                  <option value="ACCESSORIES">ACCESSORIES</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Image URL</label>
                <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-neutral-900" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm bg-neutral-100 hover:bg-neutral-200 rounded-md transition">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 rounded-md transition">{editing ? 'Update' : 'Save'}</button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
