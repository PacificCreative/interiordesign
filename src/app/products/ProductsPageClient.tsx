'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

type ProductItem = {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  category: string | null;
  brand: string | null;
  vendorName: string | null;
  retailPrice: number | null;
  tradePrice: number | null;
  status: string;
  quantity: number;
  imageUrl: string | null;
  createdAt: string;
  project: { name: string } | null;
  room: { name: string } | null;
};

export default function ProductsPageClient({
  products,
  categories,
  vendors,
}: {
  products: ProductItem[];
  categories: string[];
  vendors: string[];
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || p.category === categoryFilter;
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1">
          <input
            type="text"
            className="input-field text-sm"
            placeholder="Search products, brands, SKUs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="input-field text-sm w-40"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          className="input-field text-sm w-36"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="SPECIFIED">Specified</option>
          <option value="QUOTED">Quoted</option>
          <option value="ORDERED">Ordered</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
        </select>
      </div>

      {/* Results count */}
      <p className="text-sm text-slate-400 mb-4">{filtered.length} products</p>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">🛋️</div>
          <h3 className="font-serif text-xl text-slate-900 mb-2">
            {products.length === 0 ? 'No products yet' : 'No products match your filters'}
          </h3>
          <p className="text-slate-500 mb-6">
            {products.length === 0
              ? 'Start building your product library with specifications and pricing.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
          {products.length === 0 && (
            <Link href="/products/new" className="btn-primary inline-block">
              Add Your First Product
            </Link>
          )}
        </div>
      )}

      {/* Product Table */}
      {filtered.length > 0 && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Vendor</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Retail</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Trade</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-medium text-slate-400 uppercase tracking-wider">Project</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-cream-50 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/products/${product.id}`}
                >
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-400">
                      {[product.brand, product.sku].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {product.category || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {product.vendorName || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700 font-medium">
                    {product.retailPrice ? formatCurrency(product.retailPrice) : '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-700">
                    {product.tradePrice ? formatCurrency(product.tradePrice) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">
                    {product.project?.name || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    SPECIFIED: 'badge-draft',
    QUOTED: 'badge-active',
    ORDERED: 'badge-pending',
    SHIPPED: 'badge-active',
    DELIVERED: 'badge-completed',
    RETURNED: 'badge-draft',
  };
  return <span className={colors[status] || 'badge-draft'}>{status}</span>;
}