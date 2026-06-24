import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { getProject } from '@/lib/actions/projects';
import { formatCurrency, formatDate } from '@/lib/utils';
import ProjectDetailClient from './ProjectDetailClient';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/login');

  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/projects" className="hover:text-slate-600 transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{project.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-serif text-3xl text-slate-900">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {project.client && <span>Client: {project.client.name}</span>}
            {project.style && <span>Style: {project.style}</span>}
            {project.budget && <span>Budget: {formatCurrency(Number(project.budget))}</span>}
            {project.startDate && <span>Started: {formatDate(project.startDate)}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/projects/${id}/edit`} className="btn-secondary text-sm">
            Edit
          </Link>
          <Link href={`/moodboards/new?projectId=${id}`} className="btn-secondary text-sm">
            + Mood Board
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="text-2xl font-serif text-slate-900">{project.rooms.length}</p>
          <p className="text-xs text-slate-500">Rooms</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-serif text-slate-900">{project.tasks.length}</p>
          <p className="text-xs text-slate-500">Tasks</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-serif text-slate-900">{project._count.products}</p>
          <p className="text-xs text-slate-500">Products</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-serif text-slate-900">{project._count.moodBoards}</p>
          <p className="text-xs text-slate-500">Mood Boards</p>
        </div>
      </div>

      {/* Description */}
      {project.description && (
        <div className="card p-6 mb-8">
          <h3 className="section-heading">Description</h3>
          <p className="text-slate-600 leading-relaxed">{project.description}</p>
        </div>
      )}

      {/* Client-side interactive content */}
      <ProjectDetailClient project={project} />
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    DRAFT: 'badge-draft',
    ACTIVE: 'badge-active',
    ON_HOLD: 'badge-pending',
    COMPLETED: 'badge-completed',
    CANCELLED: 'badge-draft',
  };

  return (
    <span className={styles[status] || 'badge-draft'}>
      {status.replace('_', ' ')}
    </span>
  );
}