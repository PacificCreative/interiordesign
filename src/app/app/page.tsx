import Link from 'next/link';
import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect('/login');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-slate-900 mb-2">Welcome back</h1>
        <p className="text-slate-500">Here&apos;s what&apos;s happening across your practice.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="card p-6">
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-serif text-slate-900">{stat.value}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-xs font-medium ${stat.trend === 'up' ? 'text-sage-600' : 'text-terracotta-600'}`}>
                {stat.change}
              </span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/projects" className="card-interactive p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center text-xl">
              📋
            </div>
            <div>
              <h3 className="font-medium text-slate-900">New Project</h3>
              <p className="text-sm text-slate-500">Create a project</p>
            </div>
          </Link>
          <Link href="/clients" className="card-interactive p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center text-xl">
              👥
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Add Client</h3>
              <p className="text-sm text-slate-500">New client record</p>
            </div>
          </Link>
          <Link href="/style-assessment" className="card-interactive p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center text-xl">
              ✧
            </div>
            <div>
              <h3 className="font-medium text-slate-900">Style Quiz</h3>
              <p className="text-sm text-slate-500">Assess a client</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="section-heading">Recent Projects</h2>
        <div className="card p-8 text-center">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="font-serif text-xl text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-500 mb-4">Create your first design project to get started.</p>
          <Link href="/projects" className="btn-primary inline-block">
            Create a Project
          </Link>
        </div>
      </div>
    </div>
  );
}

const stats = [
  { label: 'Active Projects', value: '0', change: '0%', trend: 'up' as const },
  { label: 'Total Clients', value: '0', change: '0%', trend: 'up' as const },
  { label: 'Pending Orders', value: '0', change: '0%', trend: 'up' as const },
  { label: 'Outstanding Invoices', value: '$0', change: '0%', trend: 'up' as const },
];