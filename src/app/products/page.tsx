import Link from 'next/link';

export default function ProductsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Products</h1>
          <p className="text-slate-500">Source, specify, and track products for your projects.</p>
        </div>
        <Link href="/products/new" className="btn-primary">
          + Add Product
        </Link>
      </div>

      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">🛋️</div>
        <h3 className="font-serif text-xl text-slate-900 mb-2">No products yet</h3>
        <p className="text-slate-500 mb-6">Start building your product library with specifications and pricing.</p>
        <Link href="/products/new" className="btn-primary inline-block">
          Add Your First Product
        </Link>
      </div>
    </div>
  );
}