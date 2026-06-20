import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-wood-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-serif font-bold text-sm">S</span>
            </div>
            <span className="font-serif text-xl font-medium text-slate-900">Spatial</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="btn-ghost text-sm">
              Sign In
            </Link>
            <Link href="/signup" className="btn-primary text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 pt-24 pb-16">
          <div className="max-w-3xl">
            <h1 className="text-5xl lg:text-6xl font-serif text-slate-900 leading-tight mb-6">
              The business operating system{' '}
              <span className="text-wood-600">for interior designers</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
              One elegant workspace to manage projects, assess client style,
              source products, create mood boards, and run your entire
              design practice — no more spreadsheets and disconnected tools.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="bg-wood-600 text-white px-8 py-3.5 rounded-lg font-medium
                           hover:bg-wood-700 transition-all duration-200 shadow-soft text-lg"
              >
                Start Your Free Trial
              </Link>
              <Link
                href="/login"
                className="btn-secondary text-lg px-8 py-3.5"
              >
                Watch Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white border-y border-slate-100 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="section-heading text-center text-3xl mb-16">
              Everything you need to run your design practice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="card p-8 hover:shadow-card transition-shadow">
                  <div className="w-12 h-12 bg-cream-100 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <h3 className="font-serif text-xl font-medium text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-serif text-3xl text-slate-900 mb-4">
              Ready to streamline your practice?
            </h2>
            <p className="text-slate-600 mb-8">
              Join interior designers who&apos;ve replaced ten tools with one.
            </p>
            <Link href="/signup" className="btn-terracotta text-lg px-10 py-3.5">
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-400">
          &copy; {new Date().getFullYear()} Spatial. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: '📋',
    title: 'Project Management',
    description: 'Room-by-room planning, timelines, deliverables, and milestones — all in one place.',
  },
  {
    icon: '🎨',
    title: 'Style Assessment',
    description: 'Interactive quizzes that capture your client\'s aesthetic preferences and create style profiles.',
  },
  {
    icon: '🛋️',
    title: 'Product Sourcing',
    description: 'Curate products, compare pricing, track vendor orders, and manage specifications.',
  },
  {
    icon: '🖼️',
    title: 'Mood Board Creator',
    description: 'Drag-and-drop canvas for building beautiful inspiration boards with colors, materials, and products.',
  },
  {
    icon: '💬',
    title: 'Client Portal',
    description: 'Share updates, get approvals, message clients, and handle invoices seamlessly.',
  },
  {
    icon: '📊',
    title: 'Business Insights',
    description: 'Track project profitability, client history, and key metrics to grow your practice.',
  },
];