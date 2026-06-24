'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/api';

// ─── Projects ───────────────────────────────────────────────────────────────

export async function createProject(data: {
  name: string;
  description?: string;
  clientId?: string;
  style?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
}) {
  const userId = await requireAuth();

  const project = await prisma.project.create({
    data: {
      name: data.name,
      description: data.description || null,
      clientId: data.clientId || null,
      style: data.style || null,
      budget: data.budget || null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      userId,
    },
    include: {
      client: true,
      rooms: true,
    },
  });

  revalidatePath('/projects');
  return project;
}

export async function updateProject(
  id: string,
  data: {
    name?: string;
    description?: string;
    status?: string;
    clientId?: string;
    style?: string;
    budget?: number;
    startDate?: string;
    endDate?: string;
    coverImage?: string;
    colorPalette?: string;
  }
) {
  await requireAuth();

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status !== undefined && { status: data.status as any }),
      ...(data.clientId !== undefined && { clientId: data.clientId }),
      ...(data.style !== undefined && { style: data.style }),
      ...(data.budget !== undefined && { budget: data.budget }),
      ...(data.startDate !== undefined && {
        startDate: data.startDate ? new Date(data.startDate) : null,
      }),
      ...(data.endDate !== undefined && {
        endDate: data.endDate ? new Date(data.endDate) : null,
      }),
      ...(data.coverImage !== undefined && { coverImage: data.coverImage }),
      ...(data.colorPalette !== undefined && { colorPalette: data.colorPalette }),
    },
    include: {
      client: true,
      rooms: true,
    },
  });

  revalidatePath(`/projects/${id}`);
  revalidatePath('/projects');
  return project;
}

export async function deleteProject(id: string) {
  await requireAuth();

  await prisma.project.delete({ where: { id } });

  revalidatePath('/projects');
  return { success: true };
}

export async function getProject(id: string) {
  await requireAuth();

  return prisma.project.findUnique({
    where: { id },
    include: {
      client: true,
      rooms: {
        orderBy: { order: 'asc' },
        include: {
          tasks: {
            orderBy: { order: 'asc' },
          },
          _count: {
            select: { products: true },
          },
        },
      },
      tasks: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: {
          products: true,
          moodBoards: true,
          invoices: true,
        },
      },
    },
  });
}

export async function getProjects() {
  const userId = await requireAuth();

  return prisma.project.findMany({
    where: { userId },
    include: {
      client: true,
      _count: {
        select: {
          rooms: true,
          tasks: true,
          products: true,
        },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
}

// ─── Rooms ──────────────────────────────────────────────────────────────────

export async function createRoom(data: {
  name: string;
  description?: string;
  roomType?: string;
  dimensions?: string;
  projectId: string;
}) {
  await requireAuth();

  // Get the highest order for this project
  const lastRoom = await prisma.room.findFirst({
    where: { projectId: data.projectId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const room = await prisma.room.create({
    data: {
      name: data.name,
      description: data.description || null,
      roomType: data.roomType || null,
      dimensions: data.dimensions || null,
      projectId: data.projectId,
      order: (lastRoom?.order ?? -1) + 1,
    },
  });

  revalidatePath(`/projects/${data.projectId}`);
  return room;
}

export async function updateRoom(
  id: string,
  data: {
    name?: string;
    description?: string;
    roomType?: string;
    dimensions?: string;
    notes?: string;
  }
) {
  await requireAuth();

  const room = await prisma.room.update({
    where: { id },
    data,
  });

  revalidatePath(`/projects/${room.projectId}`);
  return room;
}

export async function deleteRoom(id: string) {
  await requireAuth();

  const room = await prisma.room.findUnique({ where: { id }, select: { projectId: true } });
  if (!room) throw new Error('Room not found');

  await prisma.room.delete({ where: { id } });

  revalidatePath(`/projects/${room.projectId}`);
  return { success: true };
}

export async function reorderRooms(roomIds: string[]) {
  await requireAuth();

  await Promise.all(
    roomIds.map((id, index) =>
      prisma.room.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  return { success: true };
}

// ─── Tasks ──────────────────────────────────────────────────────────────────

export async function createTask(data: {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  projectId: string;
  roomId?: string;
}) {
  await requireAuth();

  const lastTask = await prisma.task.findFirst({
    where: { projectId: data.projectId },
    orderBy: { order: 'desc' },
    select: { order: true },
  });

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description || null,
      priority: (data.priority as any) || 'MEDIUM',
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      projectId: data.projectId,
      roomId: data.roomId || null,
      order: (lastTask?.order ?? -1) + 1,
    },
  });

  revalidatePath(`/projects/${data.projectId}`);
  return task;
}

export async function updateTask(
  id: string,
  data: {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    dueDate?: string;
    roomId?: string;
  }
) {
  await requireAuth();

  const updateData: any = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.status !== undefined) {
    updateData.status = data.status;
    if (data.status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }
  }
  if (data.priority !== undefined) updateData.priority = data.priority;
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }
  if (data.roomId !== undefined) updateData.roomId = data.roomId;

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
  });

  revalidatePath(`/projects/${task.projectId}`);
  return task;
}

export async function deleteTask(id: string) {
  await requireAuth();

  const task = await prisma.task.findUnique({ where: { id }, select: { projectId: true } });
  if (!task) throw new Error('Task not found');

  await prisma.task.delete({ where: { id } });

  revalidatePath(`/projects/${task.projectId}`);
  return { success: true };
}

export async function reorderTasks(taskIds: string[]) {
  await requireAuth();

  await Promise.all(
    taskIds.map((id, index) =>
      prisma.task.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  return { success: true };
}