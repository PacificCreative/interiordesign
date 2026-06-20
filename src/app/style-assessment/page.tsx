import Link from 'next/link';

export default function StyleAssessmentPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-slate-900 mb-1">Style Assessment</h1>
          <p className="text-slate-500">Interactive quizzes to discover your client&apos;s design preferences.</p>
        </div>
        <Link href="/style-assessment/new" className="btn-primary">
          + New Assessment
        </Link>
      </div>

      <div className="card p-12 text-center">
        <div className="text-5xl mb-4">✧</div>
        <h3 className="font-serif text-xl text-slate-900 mb-2">No assessments yet</h3>
        <p className="text-slate-500 mb-6">Create a style assessment to capture your client&apos;s aesthetic preferences and color palette.</p>
        <Link href="/style-assessment/new" className="btn-primary inline-block">
          Create Assessment
        </Link>
      </div>
    </div>
  );
}