import Link from 'next/link';

export default function OrdersPage() {
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

      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">📦</div>
        <h3 className="font-serif text-xl text-slate-900 mb-2">No orders yet</h3>
        <p className="text-slate-500 mb-6">Place your first order to start tracking products through procurement.</p>
        <Link href="/orders/new" className="btn-primary inline-block">
          Place Your First Order
        </Link>
      </div>
    </div>
  );
}