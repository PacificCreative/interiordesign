'use client';

import { useCallback, useOptimistic, useState, useTransition } from 'react';
import Link from 'next/link';
import { createProject } from '@/lib/actions/projects';

type ProjectFormData = {
  name: string;
  description: string;
  clientName: string;
  clientEmail: string;
  style: string;
  budget: string;
};

type FormErrors = {
  name?: string;
};

export default function NewProjectPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    clientName: '',
    clientEmail: '',
    style: '',
    budget: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.name.trim()) errors.name = 'Project name is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setError(null);

    startTransition(async () => {
      try {
        await createProject({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          style: formData.style || undefined,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
        });
        window.location.href = '/projects';
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create project');
      }
    });
  };

  const handleChange = (field: keyof ProjectFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/projects" className="btn-ghost text-sm mb-2 inline-flex items-center gap-1">
          ← Back to Projects
        </Link>
        <h1 className="font-serif text-3xl text-slate-900">New Project</h1>
        <p className="text-slate-500 mt-1">Set up a new design project with rooms, tasks, and products.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h3 className="font-serif text-lg text-slate-900">Project Details</h3>

          <div>
            <label htmlFor="name" className="label">Project Name *</label>
            <input
              id="name"
              type="text"
              className={`input-field ${formErrors.name ? 'ring-2 ring-red-300 border-red-300' : ''}`}
              placeholder="e.g., Hamilton Residence"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="description" className="label">Description</label>
            <textarea
              id="description"
              className="input-field min-h-[100px] resize-y"
              placeholder="Describe the scope and vision for this project..."
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="style" className="label">Design Style</label>
            <select
              id="style"
              className="input-field"
              value={formData.style}
              onChange={(e) => handleChange('style', e.target.value)}
            >
              <option value="">Select a style...</option>
              <option value="modern">Modern</option>
              <option value="traditional">Traditional</option>
              <option value="transitional">Transitional</option>
              <option value="bohemian">Bohemian</option>
              <option value="mid-century">Mid-Century Modern</option>
              <option value="scandinavian">Scandinavian</option>
              <option value="industrial">Industrial</option>
              <option value="coastal">Coastal</option>
              <option value="farmhouse">Farmhouse</option>
              <option value="contemporary">Contemporary</option>
            </select>
          </div>

          <div>
            <label htmlFor="budget" className="label">Budget ($)</label>
            <input
              id="budget"
              type="number"
              className="input-field"
              placeholder="e.g., 50000"
              value={formData.budget}
              onChange={(e) => handleChange('budget', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <Link href="/projects" className="btn-secondary">Cancel</Link>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}