import Link from 'next/link';

export default function ProjectNotFound() {
  return (
    <div className="p-8">
      <div className="card p-12 text-center max-w-lg mx-auto mt-12">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="font-serif text-2xl text-slate-900 mb-2">Project not found</h2>
        <p className="text-slate-500 mb-6">
          This project doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Link href="/projects" className="btn-primary inline-block">
          Back to Projects
        </Link>
      </div>
    </div>
  );
}