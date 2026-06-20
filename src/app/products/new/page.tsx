'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { createProduct } from '@/lib/actions/products';
import { getProjects } from '@/lib/actions/projects';

type ProjectOption = { id: string; name: string };

export default function NewProductPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    sku: '',
    category: '',
    brand: '',
    vendorName: '',
    retailPrice: '',
    tradePrice: '',
    url: '',
    specifications: '',
    notes: '',
    quantity: '1',
    projectId: '',
    roomId: '',
  });

  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);

  // Load projects
  useState(() => {
    if (!loaded) {
      getProjects().then((p) => {
        setProjects(p.map(({ id, name }) => ({ id, name })));
        setLoaded(true);
      });
    }
  });

  // Load rooms when project changes
  const handleProjectChange = async (projectId: string) => {
    setForm((prev) => ({ ...prev, projectId, roomId: '' }));
    if (projectId) {
      const { prisma } = await import('@/lib/prisma');
      const { requireAuth } = await import('@/lib/api');
      // Can't use prisma directly in client, use fetch
      const res = await fetch(`/api/projects/${projectId}/rooms`);
      const data = await res.json();
      setRooms(data.data || []);
    } else {
      setRooms([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        await createProduct({
          name: form.name.trim(),
          description: form.description.trim() || undefined,
          sku: form.sku.trim() || undefined,
          category: form.category || undefined,
          brand: form.brand.trim() || undefined,
          vendorName: form.vendorName.trim() || undefined,
          retailPrice: form.retailPrice ? parseFloat(form.retailPrice) : undefined,
          tradePrice: form.tradePrice ? parseFloat(form.tradePrice) : undefined,
          url: form.url.trim() || undefined,
          specifications: form.specifications.trim() || undefined,
          notes: form.notes.trim() || undefined,
          quantity: parseInt(form.quantity) || 1,
          projectId: form.projectId,
          roomId: form.roomId || undefined,
        });
        window.location.href = '/products';
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create product');
      }
    });
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/products" className="btn-ghost text-sm mb-2 inline-flex items-center gap-1">
          ← Back to Products
        </Link>
        <h1 className="font-serif text-3xl text-slate-900">Add Product</h1>
        <p className="text-slate-500 mt-1">Specify a product for your project.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h3 className="font-serif text-lg text-slate-900">Product Details</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Product Name *</label>
              <input type="text" className="input-field" placeholder="e.g., Eames Lounge Chair"
                value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <label className="label">SKU</label>
              <input type="text" className="input-field" placeholder="e.g., DSW-001"
                value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} />
            </div>
            <div>
              <label className="label">Brand</label>
              <input type="text" className="input-field" placeholder="e.g., Herman Miller"
                value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="input-field min-h-[80px] resize-y" placeholder="Product description..."
              value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                <option value="">Select...</option>
                <option value="Furniture">Furniture</option>
                <option value="Lighting">Lighting</option>
                <option value="Textiles">Textiles</option>
                <option value="Decor">Decor</option>
                <option value="Flooring">Flooring</option>
                <option value="Wallcovering">Wallcovering</option>
                <option value="Kitchen & Bath">Kitchen & Bath</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Art">Art</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="label">Quantity</label>
              <input type="number" className="input-field" min="1"
                value={form.quantity} onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-serif text-lg text-slate-900">Pricing & Sourcing</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Retail Price ($)</label>
              <input type="number" step="0.01" className="input-field" placeholder="0.00"
                value={form.retailPrice} onChange={(e) => setForm((p) => ({ ...p, retailPrice: e.target.value }))} />
            </div>
            <div>
              <label className="label">Trade Price ($)</label>
              <input type="number" step="0.01" className="input-field" placeholder="0.00"
                value={form.tradePrice} onChange={(e) => setForm((p) => ({ ...p, tradePrice: e.target.value }))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Vendor</label>
              <input type="text" className="input-field" placeholder="Vendor name"
                value={form.vendorName} onChange={(e) => setForm((p) => ({ ...p, vendorName: e.target.value }))} />
            </div>
            <div>
              <label className="label">Product URL</label>
              <input type="url" className="input-field" placeholder="https://..."
                value={form.url} onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-serif text-lg text-slate-900">Project Assignment</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Project</label>
              <select className="input-field" value={form.projectId}
                onChange={(e) => handleProjectChange(e.target.value)}>
                <option value="">Select project...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Room</label>
              <select className="input-field" value={form.roomId}
                onChange={(e) => setForm((p) => ({ ...p, roomId: e.target.value }))}>
                <option value="">Select room...</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h3 className="font-serif text-lg text-slate-900">Specifications & Notes</h3>

          <div>
            <label className="label">Specifications (JSON)</label>
            <textarea className="input-field min-h-[100px] resize-y font-mono text-xs"
              placeholder='{"dimensions": "30x32x31 in", "material": "Walnut", "color": "Black"}'
              value={form.specifications}
              onChange={(e) => setForm((p) => ({ ...p, specifications: e.target.value }))} />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea className="input-field min-h-[80px] resize-y" placeholder="Any additional notes..."
              value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <Link href="/products" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={isPending} className="btn-primary disabled:opacity-50">
            {isPending ? 'Saving...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}