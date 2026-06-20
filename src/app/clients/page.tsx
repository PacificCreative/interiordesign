import Link from 'next/link';

export default function ClientsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Clients</h1>
          <p className="text-slate-500">Manage your client relationships.</p>
        </div>
        <Link href="/clients/new" className="btn-primary">
          + Add Client
        </Link>
      </div>

      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">👥</div>
        <h3 className="font-serif text-xl text-slate-900 mb-2">No clients yet</h3>
        <p className="text-slate-500 mb-6">Add your first client to link them to projects and invoices.</p>
        <Link href="/clients/new" className="btn-primary inline-block">
          Add a Client
        </Link>
      </div>
    </div>
  );
}