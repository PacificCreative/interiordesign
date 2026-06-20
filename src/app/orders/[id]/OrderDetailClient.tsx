'use client';

import { useState, useTransition } from 'react';
import { updateOrderStatus } from '@/lib/actions/products';

export default function OrderDetailClient({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(currentStatus);
  const [trackingUrl, setTrackingUrl] = useState('');
  const [showTracking, setShowTracking] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    setSaved(false);

    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus, {
          trackingUrl: trackingUrl || undefined,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        if (newStatus === 'SHIPPED') setShowTracking(true);
      } catch {
        setStatus(currentStatus);
      }
    });
  };

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-slate-900">Order Status</h3>
        {saved && <span className="text-xs text-sage-600">✓ Updated</span>}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((s) => (
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
            {s}
          </button>
        ))}
      </div>

      {showTracking && (
        <div className="mt-3">
          <label className="label text-xs">Tracking URL</label>
          <input
            type="url"
            className="input-field text-sm"
            placeholder="https://..."
            value={trackingUrl}
            onChange={(e) => setTrackingUrl(e.target.value)}
            onBlur={() => {
              if (trackingUrl) {
                startTransition(async () => {
                  await updateOrderStatus(orderId, status, { trackingUrl });
                });
              }
            }}
          />
        </div>
      )}
    </div>
  );
}