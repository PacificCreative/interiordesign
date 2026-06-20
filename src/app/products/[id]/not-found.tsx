import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="p-8">
      <div className="card p-12 text-center max-w-lg mx-auto mt-12">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="font-serif text-2xl text-slate-900 mb-2">Product not found</h2>
        <p className="text-slate-500 mb-6">This product doesn&apos;t exist or you don&apos;t have access to it.</p>
        <Link href="/products" className="btn-primary inline-block">Back to Products</Link>
      </div>
    </div>
  );
}