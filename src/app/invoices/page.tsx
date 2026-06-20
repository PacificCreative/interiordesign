import Link from 'next/link';

export default function InvoicesPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Invoices</h1>
          <p className="text-slate-500">Manage billing and payments for your projects.</p>
        </div>
        <Link href="/invoices/new" className="btn-primary">
          + New Invoice
        </Link>
      </div>

      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">📄</div>
        <h3 className="font-serif text-xl text-slate-900 mb-2">No invoices yet</h3>
        <p className="text-slate-500 mb-6">Create your first invoice to bill clients for design services and products.</p>
        <Link href="/invoices/new" className="btn-primary inline-block">
          Create an Invoice
        </Link>
      </div>
    </div>
  );
}