import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { prisma } from '@/lib/prisma';
import RoomDetailClient from './RoomDetailClient';

export default async function RoomDetailPage({
  params,
}: {
  params: Promise<{ id: string; roomId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/login');

  const { id: projectId, roomId } = await params;

  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      tasks: { orderBy: { order: 'asc' } },
      products: { orderBy: { createdAt: 'desc' }, take: 10 },
      project: {
        select: { id: true, name: true, status: true },
      },
    },
  });

  if (!room || room.projectId !== projectId) {
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
        <Link
          href={`/projects/${room.project.id}`}
          className="hover:text-slate-600 transition-colors"
        >
          {room.project.name}
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium">{room.name}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-serif text-3xl text-slate-900">{room.name}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            {room.roomType && <span>{room.roomType}</span>}
            {room.dimensions && (
              <>
                <span>·</span>
                <span>{room.dimensions}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Room Description */}
      {(room.description || room.notes) && (
        <div className="card p-5 mb-6">
          {room.description && (
            <p className="text-slate-600 mb-2">{room.description}</p>
          )}
          {room.notes && (
            <p className="text-sm text-slate-400">{room.notes}</p>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-2xl font-serif text-slate-900">{room.tasks.length}</p>
          <p className="text-xs text-slate-500">Tasks</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-serif text-slate-900">{room.products.length}</p>
          <p className="text-xs text-slate-500">Products Specified</p>
        </div>
      </div>

      {/* Interactive Content */}
      <RoomDetailClient
        room={{
          id: room.id,
          name: room.name,
          description: room.description,
          roomType: room.roomType,
          dimensions: room.dimensions,
          notes: room.notes,
          projectId: room.projectId,
        }}
        initialTasks={room.tasks.map((t) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          status: t.status,
          priority: t.priority,
          dueDate: t.dueDate,
          order: t.order,
        }))}
        projectName={room.project.name}
      />
    </div>
  );
}