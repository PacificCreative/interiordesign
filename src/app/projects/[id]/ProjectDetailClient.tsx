'use client';

import { useState, useTransition } from 'react';
import { createRoom, createTask, updateTask, deleteTask, deleteRoom } from '@/lib/actions/projects';
import { formatDate } from '@/lib/utils';

type ProjectData = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  style: string | null;
  client: { id: string; name: string } | null;
  rooms: (RoomWithTasks & { _count: { products: number } })[];
  tasks: TaskData[];
};

type RoomWithTasks = {
  id: string;
  name: string;
  description: string | null;
  roomType: string | null;
  dimensions: string | null;
  notes: string | null;
  order: number;
  tasks: TaskData[];
};

type TaskData = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  order: number;
  roomId: string | null;
};

export default function ProjectDetailClient({ project }: { project: ProjectData }) {
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<'rooms' | 'tasks'>('rooms');
  const [showNewRoomForm, setShowNewRoomForm] = useState(false);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomType, setNewRoomType] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskRoomId, setNewTaskRoomId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        await createRoom({
          name: newRoomName.trim(),
          roomType: newRoomType || undefined,
          projectId: project.id,
        });
        setNewRoomName('');
        setNewRoomType('');
        setShowNewRoomForm(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create room');
      }
    });
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        await createTask({
          title: newTaskTitle.trim(),
          projectId: project.id,
          roomId: newTaskRoomId || undefined,
        });
        setNewTaskTitle('');
        setNewTaskRoomId('');
        setShowNewTaskForm(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create task');
      }
    });
  };

  const handleDeleteRoom = async (roomId: string) => {
    startTransition(async () => {
      try {
        await deleteRoom(roomId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete room');
      }
    });
  };

  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    startTransition(async () => {
      try {
        await updateTask(taskId, { status: newStatus });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update task');
      }
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    startTransition(async () => {
      try {
        await deleteTask(taskId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
      }
    });
  };

  const roomsByType: Record<string, RoomWithTasks[]> = {};
  project.rooms.forEach((room) => {
    const type = room.roomType || 'Other';
    if (!roomsByType[type]) roomsByType[type] = [];
    roomsByType[type].push(room);
  });

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-slate-100">
        <button
          onClick={() => setActiveTab('rooms')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'rooms'
              ? 'border-wood-600 text-wood-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          Rooms ({project.rooms.length})
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'tasks'
              ? 'border-wood-600 text-wood-700'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          All Tasks ({project.tasks.length})
        </button>
      </div>

      {/* Rooms Tab */}
      {activeTab === 'rooms' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-heading mb-0">Room-by-Room Plan</h3>
            <button
              onClick={() => setShowNewRoomForm(!showNewRoomForm)}
              className="btn-ghost text-sm"
            >
              + Add Room
            </button>
          </div>

          {showNewRoomForm && (
            <form onSubmit={handleCreateRoom} className="card p-4 mb-4 flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  className="input-field text-sm"
                  placeholder="Room name (e.g., Living Room)"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  autoFocus
                />
                <select
                  className="input-field text-sm"
                  value={newRoomType}
                  onChange={(e) => setNewRoomType(e.target.value)}
                >
                  <option value="">Room type...</option>
                  <option value="Living Room">Living Room</option>
                  <option value="Bedroom">Bedroom</option>
                  <option value="Kitchen">Kitchen</option>
                  <option value="Bathroom">Bathroom</option>
                  <option value="Dining Room">Dining Room</option>
                  <option value="Home Office">Home Office</option>
                  <option value="Entryway">Entryway</option>
                  <option value="Outdoor">Outdoor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <button type="submit" className="btn-primary text-sm" disabled={isPending}>
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowNewRoomForm(false)}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
            </form>
          )}

          {project.rooms.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-3xl mb-3">🚪</div>
              <p className="text-slate-500 mb-1">No rooms yet</p>
              <p className="text-sm text-slate-400">
                Add rooms to organize your project space by space.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {project.rooms.map((room) => (
                <div key={room.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-slate-900">{room.name}</h4>
                      {room.roomType && (
                        <span className="text-xs text-slate-400">{room.roomType}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {room.dimensions && (
                        <span className="text-xs text-slate-400">{room.dimensions}</span>
                      )}
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors text-xs"
                        title="Delete room"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Tasks in this room */}
                  <div className="space-y-1 mb-3">
                    {room.tasks.length === 0 ? (
                      <p className="text-xs text-slate-300">No tasks yet</p>
                    ) : (
                      room.tasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-2 py-1"
                        >
                          <input
                            type="checkbox"
                            checked={task.status === 'COMPLETED'}
                            onChange={() => handleToggleTaskStatus(task.id, task.status)}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-wood-600 focus:ring-wood-300"
                          />
                          <span
                            className={`text-sm flex-1 ${
                              task.status === 'COMPLETED'
                                ? 'line-through text-slate-300'
                                : 'text-slate-700'
                            }`}
                          >
                            {task.title}
                          </span>
                          <PriorityBadge priority={task.priority} />
                        </div>
                      ))
                    )}
                  </div>

                  {room._count && (
                    <div className="text-xs text-slate-400">
                      {room._count.products} specified products
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-heading mb-0">All Tasks</h3>
            <button
              onClick={() => setShowNewTaskForm(!showNewTaskForm)}
              className="btn-ghost text-sm"
            >
              + Add Task
            </button>
          </div>

          {showNewTaskForm && (
            <form onSubmit={handleCreateTask} className="card p-4 mb-4 flex items-start gap-3">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  className="input-field text-sm"
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  autoFocus
                />
                <select
                  className="input-field text-sm"
                  value={newTaskRoomId}
                  onChange={(e) => setNewTaskRoomId(e.target.value)}
                >
                  <option value="">No room (general task)</option>
                  {project.rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary text-sm" disabled={isPending}>
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowNewTaskForm(false)}
                className="btn-ghost text-sm"
              >
                Cancel
              </button>
            </form>
          )}

          {project.tasks.length === 0 ? (
            <div className="card p-8 text-center">
              <div className="text-3xl mb-3">✓</div>
              <p className="text-slate-500 mb-1">No tasks yet</p>
              <p className="text-sm text-slate-400">
                Add tasks to track what needs to be done.
              </p>
            </div>
          ) : (
            <div className="card divide-y divide-slate-50">
              {project.tasks.map((task) => {
                const room = project.rooms.find((r) => r.id === task.roomId);
                return (
                  <div key={task.id} className="flex items-center gap-3 p-3">
                    <input
                      type="checkbox"
                      checked={task.status === 'COMPLETED'}
                      onChange={() => handleToggleTaskStatus(task.id, task.status)}
                      className="w-4 h-4 rounded border-slate-300 text-wood-600 focus:ring-wood-300"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm ${
                          task.status === 'COMPLETED'
                            ? 'line-through text-slate-300'
                            : 'text-slate-700'
                        }`}
                      >
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {room && (
                          <span className="text-xs text-slate-400">{room.name}</span>
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-slate-400">
                            Due {formatDate(task.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriorityBadge priority={task.priority} />
                      <StatusBadge status={task.status} />
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-slate-300 hover:text-red-500 transition-colors text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    LOW: 'bg-slate-100 text-slate-500',
    MEDIUM: 'bg-cream-100 text-cream-700',
    HIGH: 'bg-terracotta-100 text-terracotta-700',
    URGENT: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${colors[priority] || colors.LOW}`}>
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    TODO: 'bg-slate-100 text-slate-500',
    IN_PROGRESS: 'bg-sage-100 text-sage-700',
    REVIEW: 'bg-cream-100 text-cream-700',
    COMPLETED: 'bg-wood-100 text-wood-700',
  };

  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${colors[status] || colors.TODO}`}>
      {status.replace('_', ' ')}
    </span>
  );
}