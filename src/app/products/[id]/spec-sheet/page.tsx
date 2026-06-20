import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { getProduct } from '@/lib/actions/products';
import { formatCurrency } from '@/lib/utils';

export default async function SpecSheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/login');

  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const retail = product.retailPrice ? Number(product.retailPrice) : null;
  const trade = product.tradePrice ? Number(product.tradePrice) : null;
  const savings = retail && trade ? Math.round((1 - trade / retail) * 100) : null;

  let specLines: [string, string][] = [];
  if (product.specifications) {
    try {
      specLines = Object.entries(JSON.parse(product.specifications));
    } catch {
      specLines = [['Raw', product.specifications]];
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between no-print">
        <Link href={`/products/${id}`} className="btn-ghost text-sm">← Back to Product</Link>
        <button onClick={() => window.print()} className="btn-secondary text-sm">
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Spec Sheet */}
      <div className="bg-white border border-slate-200 rounded-xl p-10 print:border-none print:p-0">
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Product Specification Sheet</p>
              <h1 className="font-serif text-3xl text-slate-900">{product.name}</h1>
              {product.brand && <p className="text-slate-500 mt-1">{product.brand}</p>}
            </div>
            {product.sku && (
              <div className="text-right">
                <p className="text-xs text-slate-400">SKU</p>
                <p className="font-mono text-sm">{product.sku}</p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-6">
            <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-slate-700 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Specs Grid */}
        {specLines.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-3">Specifications</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {specLines.map(([key, value]) => (
                <div key={key} className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-sm text-slate-500 capitalize">{key.replace(/_/g, ' ')}</span>
                  <span className="text-sm text-slate-800 font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="mb-6">
          <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-3">Pricing</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg text-center">
              <p className="text-xs text-slate-400 mb-1">Retail Price</p>
              <p className="text-xl font-serif">{retail ? formatCurrency(retail) : '—'}</p>
            </div>
            <div className="p-4 bg-sage-50 rounded-lg text-center">
              <p className="text-xs text-slate-400 mb-1">Trade Price</p>
              <p className="text-xl font-serif text-sage-700">{trade ? formatCurrency(trade) : '—'}</p>
            </div>
            <div className="p-4 bg-cream-50 rounded-lg text-center">
              <p className="text-xs text-slate-400 mb-1">Savings</p>
              <p className="text-xl font-serif text-wood-700">{savings ? `${savings}%` : '—'}</p>
            </div>
          </div>
        </div>

        {/* Vendor & Project Info */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Sourcing</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-slate-400">Vendor: </span>{product.vendorName || '—'}</p>
              {product.url && (
                <p><span className="text-slate-400">URL: </span>
                  <a href={product.url} target="_blank" rel="noopener noreferrer"
                    className="text-wood-600 hover:underline">{product.url}</a>
                </p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Project</h3>
            <div className="space-y-1 text-sm">
              <p><span className="text-slate-400">Project: </span>{product.project?.name || '—'}</p>
              <p><span className="text-slate-400">Room: </span>{product.room?.name || '—'}</p>
              <p><span className="text-slate-400">Quantity: </span>{product.quantity}</p>
            </div>
          </div>
        </div>

        {/* Notes */}
        {product.notes && (
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-xs text-slate-400 uppercase tracking-wider mb-2">Notes</h3>
            <p className="text-sm text-slate-600 whitespace-pre-wrap">{product.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-100 pt-4 mt-8 text-xs text-slate-400 flex justify-between">
          <span>Generated by Spatial — {new Date().toLocaleDateString()}</span>
          <span>{product.status}</span>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
        }
      `}</style>
    </div>
  );
}