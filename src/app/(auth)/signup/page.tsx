import { SignUp } from '@clerk/nextjs';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-wood-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-serif font-bold text-xl">S</span>
          </div>
          <h1 className="font-serif text-2xl text-slate-900">Create your account</h1>
          <p className="text-slate-500 text-sm mt-1">Start streamlining your design practice</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'shadow-soft border border-slate-100 rounded-xl',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
              socialButtonsBlockButton: 'border border-slate-200 hover:bg-slate-50',
              formFieldInput: 'input-field',
              formButtonPrimary: 'btn-primary w-full',
              footerActionLink: 'text-wood-600 hover:text-wood-700',
            },
          }}
          path="/signup"
          routing="path"
          signInUrl="/login"
        />
      </div>
    </div>
  );
}