import Link from 'next/link';

export default function MoodBoardsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Mood Boards</h1>
          <p className="text-slate-500">Build beautiful inspiration boards for every room.</p>
        </div>
        <Link href="/moodboards/new" className="btn-primary">
          + New Mood Board
        </Link>
      </div>

      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">🎨</div>
        <h3 className="font-serif text-xl text-slate-900 mb-2">No mood boards yet</h3>
        <p className="text-slate-500 mb-6">Create your first mood board to visualize colors, materials, and products.</p>
        <Link href="/moodboards/new" className="btn-primary inline-block">
          Create a Mood Board
        </Link>
      </div>
    </div>
  );
}