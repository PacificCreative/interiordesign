'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { createOrder, getProducts } from '@/lib/actions/products';

export default function NewOrderPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [vendorName, setVendorName] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string; brand: string | null; retailPrice: number | null }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useState(() => {
    if (!loaded) {
      getProducts().then((p) => {
        setProducts(p.map((p) => ({ ...p, retailPrice: Number(p.retailPrice) })));
        setLoaded(true);
      });
    }
  });

  const toggleProduct = (id: string) => {
    setSelectedProducts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProducts.length === 0) { setError('Select at least one product'); return; }
    setError(null);

    startTransition(async () => {
      try {
        await createOrder({
          vendorName: vendorName.trim() || undefined,
          notes: notes.trim() || undefined,
          productIds: selectedProducts,
        });
        window.location.href = '/orders';
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create order');
      }
    });
  };

  const totalRetail = products
    .filter((p) => selectedProducts.includes(p.id))
    .reduce((sum, p) => sum + (p.retailPrice || 0), 0);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/orders" className="btn-ghost text-sm mb-2 inline-flex items-center gap-1">← Back to Orders</Link>
        <h1 className="font-serif text-3xl text-slate-900">New Order</h1>
        <p className="text-slate-500 mt-1">Create a purchase order for vendor products.</p>
      </div>

      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h3 className="font-serif text-lg text-slate-900">Order Details</h3>
          <div>
            <label className="label">Vendor Name</label>
            <input type="text" className="input-field" placeholder="Vendor or showroom name"
              value={vendorName} onChange={(e) => setVendorName(e.target.value)} />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea className="input-field min-h-[80px] resize-y" placeholder="Order notes..."
              value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg text-slate-900">Products to Order</h3>
            <span className="text-sm text-slate-400">{selectedProducts.length} selected</span>
          </div>

          {!loaded ? (
            <p className="text-sm text-slate-400">Loading products...</p>
          ) : products.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-slate-500 mb-2">No products available</p>
              <Link href="/products/new" className="btn-ghost text-sm">Add products first</Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {products.map((product) => (
                <label
                  key={product.id}
                  className={`flex items-center gap-3 py-3 px-2 rounded-lg cursor-pointer transition-colors ${
                    selectedProducts.includes(product.id) ? 'bg-wood-50' : 'hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => toggleProduct(product.id)}
                    className="w-4 h-4 rounded border-slate-300 text-wood-600 focus:ring-wood-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-400">{product.brand || '—'}</p>
                  </div>
                  <span className="text-sm text-slate-600">
                    {product.retailPrice ? `$${product.retailPrice.toFixed(2)}` : '—'}
                  </span>
                </label>
              ))}
            </div>
          )}

          {selectedProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
              <span className="text-slate-500">Total retail value</span>
              <span className="font-medium text-slate-900">${totalRetail.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 justify-end">
          <Link href="/orders" className="btn-secondary">Cancel</Link>
          <button type="submit" disabled={isPending || selectedProducts.length === 0}
            className="btn-primary disabled:opacity-50">
            {isPending ? 'Creating...' : `Place Order (${selectedProducts.length} items)`}
          </button>
        </div>
      </form>
    </div>
  );
}