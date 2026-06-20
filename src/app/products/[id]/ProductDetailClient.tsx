'use client';

import { useState, useTransition } from 'react';
import { updateProduct } from '@/lib/actions/products';

export default function ProductDetailClient({
  product,
}: {
  product: { id: string; status: string; name: string };
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(product.status);
  const [saved, setSaved] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setSaved(false);

    startTransition(async () => {
      try {
        await updateProduct(product.id, { status: newStatus });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } catch {
        setStatus(product.status);
      }
    });
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-slate-900">Status Tracking</h3>
        {saved && <span className="text-xs text-sage-600">✓ Saved</span>}
      </div>
      <div className="flex items-center gap-2">
        {['SPECIFIED', 'QUOTED', 'ORDERED', 'SHIPPED', 'DELIVERED'].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            disabled={isPending}
            className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
              status === s
                ? 'bg-wood-600 text-white shadow-soft'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}