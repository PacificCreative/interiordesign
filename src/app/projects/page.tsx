import Link from 'next/link';

export default function ProjectsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Projects</h1>
          <p className="text-slate-500">Manage your design projects room by room.</p>
        </div>
        <Link href="/projects/new" className="btn-primary">
          + New Project
        </Link>
      </div>

      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">🏠</div>
        <h3 className="font-serif text-xl text-slate-900 mb-2">No projects yet</h3>
        <p className="text-slate-500 mb-6">Create your first project to start managing rooms, tasks, and products.</p>
        <Link href="/projects/new" className="btn-primary inline-block">
          Create Your First Project
        </Link>
      </div>
    </div>
  );
}