import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { getOrders } from '@/lib/actions/products';
import { formatCurrency } from '@/lib/utils';

export default async function OrdersPage() {
  const { userId } = await auth();
  if (!userId) redirect('/login');

  const orders = await getOrders();

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Orders</h1>
          <p className="text-slate-500">Track vendor orders from placement to delivery.</p>
        </div>
        <Link href="/orders/new" className="btn-primary">
          + New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="font-serif text-xl text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-6">Place your first order to start tracking products through procurement.</p>
          <Link href="/orders/new" className="btn-primary inline-block">Place Your First Order</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="card p-5 flex items-center justify-between hover:shadow-card transition-shadow"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-slate-900">{order.orderNumber}</h3>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  {order.vendorName && <span>{order.vendorName}</span>}
                  {order.project && <><span>·</span><span>{order.project.name}</span></>}
                  <span>·</span>
                  <span>{order.products.length} items</span>
                </div>
              </div>
              <div className="text-right">
                {order.total && (
                  <p className="font-medium text-slate-900">{formatCurrency(Number(order.total))}</p>
                )}
                <p className="text-xs text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: 'badge-draft',
    CONFIRMED: 'badge-active',
    PROCESSING: 'badge-pending',
    SHIPPED: 'badge-active',
    DELIVERED: 'badge-completed',
    CANCELLED: 'badge-draft',
  };
  return <span className={colors[status] || 'badge-draft'}>{status}</span>;
}