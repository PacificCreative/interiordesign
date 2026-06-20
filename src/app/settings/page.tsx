export default function SettingsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-slate-900 mb-1">Settings</h1>
        <p className="text-slate-500">Manage your account and preferences.</p>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="card p-6">
          <h3 className="font-serif text-lg text-slate-900 mb-1">Profile</h3>
          <p className="text-sm text-slate-500 mb-4">Update your personal information and avatar.</p>
          <div className="h-24 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 text-sm">
            Profile settings — coming soon
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-serif text-lg text-slate-900 mb-1">Billing & Plan</h3>
          <p className="text-sm text-slate-500 mb-4">Manage your subscription and payment methods.</p>
          <div className="h-24 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 text-sm">
            Billing settings — coming soon
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-serif text-lg text-slate-900 mb-1">Preferences</h3>
          <p className="text-sm text-slate-500 mb-4">Customize your design experience and notifications.</p>
          <div className="h-24 bg-slate-50 rounded-lg flex items-center justify-center text-slate-300 text-sm">
            Preferences — coming soon
          </div>
        </div>
      </div>
    </div>
  );
}