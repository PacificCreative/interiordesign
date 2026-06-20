import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { getProduct } from '@/lib/actions/products';
import { formatCurrency } from '@/lib/utils';
import ProductDetailClient from './ProductDetailClient';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/login');

  const { id } = await params;
  const product = await getProduct(id);

  if (!product) notFound();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/products" className="hover:text-slate-600">Products</Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{product.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-3xl text-slate-900">{product.name}</h1>
            <StatusBadge status={product.status} />
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            {product.brand && <span>{product.brand}</span>}
            {product.sku && <><span>·</span><span>SKU: {product.sku}</span></>}
            {product.quantity > 1 && <><span>·</span><span>Qty: {product.quantity}</span></>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/products/${id}/spec-sheet`} className="btn-secondary text-sm">
            📄 Spec Sheet
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {/* Description */}
          {product.description && (
            <div className="card p-6">
              <h3 className="section-heading">Description</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && (
            <div className="card p-6">
              <h3 className="section-heading">Specifications</h3>
              <SpecSheet specs={product.specifications} />
            </div>
          )}

          {/* Notes */}
          {product.notes && (
            <div className="card p-6">
              <h3 className="section-heading">Notes</h3>
              <p className="text-slate-600 text-sm whitespace-pre-wrap">{product.notes}</p>
            </div>
          )}

          {/* Interactive Client Component */}
          <ProductDetailClient product={{ id: product.id, status: product.status, name: product.name }} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {product.imageUrl && (
            <div className="card overflow-hidden">
              <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            </div>
          )}

          <div className="card p-5 space-y-4">
            <h3 className="font-medium text-slate-900">Pricing</h3>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Retail</span>
              <span className="font-medium">{product.retailPrice ? formatCurrency(Number(product.retailPrice)) : '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Trade</span>
              <span className="font-medium text-sage-700">{product.tradePrice ? formatCurrency(Number(product.tradePrice)) : '—'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Savings</span>
              <span className="font-medium text-sage-600">
                {product.retailPrice && product.tradePrice
                  ? `${Math.round((1 - Number(product.tradePrice) / Number(product.retailPrice)) * 100)}%`
                  : '—'}
              </span>
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <h3 className="font-medium text-slate-900">Details</h3>
            <div className="text-sm space-y-2">
              <DetailRow label="Category" value={product.category} />
              <DetailRow label="Vendor" value={product.vendorName} />
              <DetailRow label="Project" value={product.project?.name} />
              <DetailRow label="Room" value={product.room?.name} />
              {product.order && (
                <DetailRow label="Order" value={`${product.order.orderNumber} (${product.order.status})`} />
              )}
            </div>
          </div>

          {product.url && (
            <div className="card p-5">
              <a href={product.url} target="_blank" rel="noopener noreferrer"
                className="btn-secondary w-full text-sm text-center block">
                View Product Page →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    SPECIFIED: 'badge-draft', QUOTED: 'badge-active', ORDERED: 'badge-pending',
    SHIPPED: 'badge-active', DELIVERED: 'badge-completed', RETURNED: 'badge-draft',
  };
  return <span className={colors[status] || 'badge-draft'}>{status}</span>;
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-slate-700">{value || '—'}</span>
    </div>
  );
}

function SpecSheet({ specs }: { specs: string }) {
  try {
    const parsed = JSON.parse(specs);
    return (
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(parsed).map(([key, value]) => (
          <div key={key} className="text-sm">
            <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}</span>
            <p className="text-slate-700 font-medium">{String(value)}</p>
          </div>
        ))}
      </div>
    );
  } catch {
    return <p className="text-sm text-slate-500 font-mono">{specs}</p>;
  }
}