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
  const [saving, setSaving] = useState(false);

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

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
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
        <button
          onClick={openCreate}
          className="bg-[#111] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#333] transition"
        >
          + Add Product
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-[360px] px-4 py-2.5 border border-[#ddd] rounded-lg text-sm outline-none focus:border-[#111] transition"
        />
      </div>

      {loading ? (
        <p className="text-[#888] text-sm">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <p className="text-[#888]">
            {products.length === 0 ? 'No products yet. Click "+ Add Product" to get started.' : 'No products match your search.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#888] uppercase text-xs bg-[#fafafa] border-b border-[#eee]">
                <th className="px-4 py-3 font-medium">ID</th>
                <th className="px-4 py-3 font-medium">Image</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa] transition">
                  <td className="px-4 py-3 text-[#888]">{p.id}</td>
                  <td className="px-4 py-3">
                    {p.image_url ? (
                      <img src={p.image_url} alt="" className="w-12 h-12 object-cover rounded-md bg-[#f0f0f0]" />
                    ) : (
                      <span className="text-[#ccc] text-lg">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-[#888]">{p.category || '—'}</td>
                  <td className="px-4 py-3">PKR {Number(p.price).toLocaleString()}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs bg-[#eee] hover:bg-[#ddd] px-3 py-1.5 rounded-md transition mr-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p.id)}
                      className="text-xs bg-[#d32f2f] text-white hover:bg-[#b71c1c] px-3 py-1.5 rounded-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[200]" onClick={closeModal} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-7 w-[90%] max-w-[520px] z-[201] shadow-[0_8px_32px_rgba(0,0,0,0.15)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={closeModal} className="text-[#888] hover:text-[#222] text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={save} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[#222]">Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[#ddd] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#111] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[#222]">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-[#ddd] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#111] transition resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#222]">Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full border border-[#ddd] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#111] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-[#222]">Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full border border-[#ddd] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#111] transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-[#222]">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-[#ddd] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#111] transition bg-white cursor-pointer"
                >
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
                <label className="block text-xs font-semibold mb-1.5 text-[#222]">Image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full border border-[#ddd] rounded-md px-3 py-2.5 text-sm outline-none focus:border-[#111] transition"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-sm bg-[#eee] hover:bg-[#ddd] rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2.5 text-sm bg-[#111] text-white hover:bg-[#333] rounded-lg transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : editing ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
