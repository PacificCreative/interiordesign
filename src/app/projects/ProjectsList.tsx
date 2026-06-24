'use client';

import Link from 'next/link';
import { formatDate } from '@/lib/utils';

type ProjectWithCounts = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  style: string | null;
  budget: number | null;
  coverImage: string | null;
  startDate: Date | null;
  endDate: Date | null;
  updatedAt: Date;
  client: { id: string; name: string } | null;
  _count: {
    rooms: number;
    tasks: number;
    products: number;
  };
};

export default function ProjectsList({ projects }: { projects: ProjectWithCounts[] }) {
  if (projects.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="card-interactive group"
        >
          {/* Cover Image Placeholder */}
          <div className="h-40 bg-gradient-to-br from-cream-100 to-wood-100 rounded-t-xl flex items-center justify-center relative overflow-hidden">
            {project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl">🏠</div>
            )}
            <div className="absolute top-3 right-3">
              <StatusBadge status={project.status} />
            </div>
          </div>

          <div className="p-5">
            <h3 className="font-serif text-lg text-slate-900 group-hover:text-wood-700 transition-colors mb-1">
              {project.name}
            </h3>
            {project.client && (
              <p className="text-sm text-slate-500 mb-2">{project.client.name}</p>
            )}
            {project.description && (
              <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                {project.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-400 mt-auto">
              <span>{project._count.rooms} rooms</span>
              <span>·</span>
              <span>{project._count.tasks} tasks</span>
              <span>·</span>
              <span>{project._count.products} products</span>
            </div>

            <div className="mt-2 text-xs text-slate-400">
              Updated {formatDate(project.updatedAt)}
            </div>

            {project.style && (
              <div className="mt-2">
                <span className="inline-block px-2 py-0.5 bg-cream-100 text-cream-700 rounded text-xs font-medium">
                  {project.style}
                </span>
              </div>
            )}
          </div>
        </Link>
      ))}
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