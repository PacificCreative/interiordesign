import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { getOrder } from '@/lib/actions/products';
import { formatCurrency } from '@/lib/utils';
import OrderDetailClient from './OrderDetailClient';

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/login');

  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/orders" className="hover:text-slate-600">Orders</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{order.orderNumber}</span>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-3xl text-slate-900">{order.orderNumber}</h1>
            <StatusBadge status={order.status} />
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            {order.vendorName && <span>{order.vendorName}</span>}
            {order.project && <><span>·</span><span>{order.project.name}</span></>}
            <span>·</span>
            <span>{order.products.length} items</span>
          </div>
        </div>
      </div>

      {/* Status tracking */}
      <OrderDetailClient orderId={order.id} currentStatus={order.status} />

      {/* Products */}
      <div className="card mt-6">
        <h3 className="font-medium text-slate-900 px-5 pt-5 pb-3 border-b border-slate-50">Products</h3>
        <div className="divide-y divide-slate-50">
          {order.products.map((product) => (
            <div key={product.id} className="flex items-center justify-between px-5 py-3">
              <Link href={`/products/${product.id}`} className="text-sm text-slate-900 hover:text-wood-700">
                {product.name}
              </Link>
              <div className="flex items-center gap-3">
                {product.retailPrice && (
                  <span className="text-sm text-slate-600">{formatCurrency(Number(product.retailPrice))}</span>
                )}
                <StatusBadge status={product.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order info */}
      <div className="card p-5 mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-slate-400">Vendor: </span>
          <span className="text-slate-700">{order.vendorName || '—'}</span>
        </div>
        <div>
          <span className="text-slate-400">Contact: </span>
          <span className="text-slate-700">{order.vendorContact || '—'}</span>
        </div>
        <div>
          <span className="text-slate-400">Tracking: </span>
          <span className="text-slate-700">
            {order.trackingUrl ? (
              <a href={order.trackingUrl} target="_blank" rel="noopener noreferrer" className="text-wood-600 hover:underline">Track</a>
            ) : '—'}
          </span>
        </div>
        <div>
          <span className="text-slate-400">Est. Delivery: </span>
          <span className="text-slate-700">
            {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : '—'}
          </span>
        </div>
      </div>

      {order.notes && (
        <div className="card p-5 mt-4">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Notes</h3>
          <p className="text-sm text-slate-600">{order.notes}</p>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'badge-draft', CONFIRMED: 'badge-active', PROCESSING: 'badge-pending',
    SHIPPED: 'badge-active', DELIVERED: 'badge-completed', CANCELLED: 'badge-draft',
  };
  return <span className={colors[status] || 'badge-draft'}>{status}</span>;
}