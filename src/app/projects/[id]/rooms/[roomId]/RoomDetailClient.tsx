'use client';

import { useState, useTransition } from 'react';
import { createTask, updateTask, deleteTask } from '@/lib/actions/projects';
import { formatDate } from '@/lib/utils';

type RoomData = {
  id: string;
  name: string;
  description: string | null;
  roomType: string | null;
  dimensions: string | null;
  notes: string | null;
  projectId: string;
};

type TaskData = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueDate: Date | null;
  order: number;
};

export default function RoomDetailClient({
  room,
  initialTasks,
  projectName,
}: {
  room: RoomData;
  initialTasks: TaskData[];
  projectName: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [tasks, setTasks] = useState(initialTasks);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    setError(null);

    startTransition(async () => {
      try {
        const task = await createTask({
          title: newTaskTitle.trim(),
          projectId: room.projectId,
          roomId: room.id,
        });
        setTasks((prev) => [
          ...prev,
          {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            order: task.order,
          },
        ]);
        setNewTaskTitle('');
        setShowNewTask(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create task');
      }
    });
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'COMPLETED' ? 'TODO' : 'COMPLETED';

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: newStatus } : t
      )
    );

    startTransition(async () => {
      try {
        await updateTask(taskId, { status: newStatus });
      } catch {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? { ...t, status: currentStatus } : t
          )
        );
      }
    });
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    startTransition(async () => {
      try {
        await deleteTask(taskId);
      } catch {
        setTasks(initialTasks);
      }
    });
  };

  const pendingTasks = tasks.filter((t) => t.status !== 'COMPLETED');
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Tasks Section */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="section-heading mb-0">
          Tasks
          <span className="text-sm font-normal text-slate-400 ml-2">
            ({pendingTasks.length} remaining)
          </span>
        </h3>
        <button
          onClick={() => setShowNewTask(!showNewTask)}
          className="btn-ghost text-sm"
        >
          + Add Task
        </button>
      </div>

      {showNewTask && (
        <form onSubmit={handleCreateTask} className="card p-4 mb-4 flex items-start gap-3">
          <div className="flex-1">
            <input
              type="text"
              className="input-field text-sm"
              placeholder="Task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" className="btn-primary text-sm" disabled={isPending}>
            Add
          </button>
          <button
            type="button"
            onClick={() => setShowNewTask(false)}
            className="btn-ghost text-sm"
          >
            Cancel
          </button>
        </form>
      )}

      {tasks.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-slate-500 mb-2">No tasks for this room yet</p>
          <p className="text-sm text-slate-400">
            Add tasks to track what needs to be done in this space.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pending Tasks */}
          {pendingTasks.length > 0 && (
            <div className="card divide-y divide-slate-50">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => handleToggleStatus(task.id, task.status)}
                    className="w-4 h-4 rounded border-slate-300 text-wood-600 focus:ring-wood-300"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-slate-400 truncate">{task.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                    {task.dueDate && (
                      <span className="text-xs text-slate-400">
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mb-2 font-medium">
                Completed ({completedTasks.length})
              </p>
              <div className="card divide-y divide-slate-50">
                {completedTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3">
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggleStatus(task.id, task.status)}
                      className="w-4 h-4 rounded border-slate-300 text-wood-600 focus:ring-wood-300"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 line-through">{task.title}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
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