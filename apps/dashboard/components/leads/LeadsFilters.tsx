'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import type { Project } from '@habitta/types';
import { Button } from '@/components/ui/button';

interface LeadsFiltersProps {
  projects: Project[];
  currentStatus?: string;
  currentProjectId?: string;
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'Nuevos' },
  { value: 'contacted', label: 'Contactados' },
  { value: 'negotiating', label: 'En negociación' },
  { value: 'converted', label: 'Convertidos' },
  { value: 'lost', label: 'Perdidos' },
];

const LeadsFilters = ({ projects, currentStatus, currentProjectId }: LeadsFiltersProps) => {
  const router = useRouter();
  const hasFilters = !!(currentStatus || currentProjectId);

  const updateFilter = (key: 'status' | 'project_id', value: string) => {
    const params = new URLSearchParams();
    if (key !== 'status' && currentStatus) params.set('status', currentStatus);
    if (key !== 'project_id' && currentProjectId) params.set('project_id', currentProjectId);
    if (value) params.set(key, value);
    const query = params.toString();
    router.push(`/leads${query ? `?${query}` : ''}`);
  };

  const clearFilters = () => router.push('/leads');

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      {/* Status filter */}
      <select
        value={currentStatus ?? ''}
        onChange={(e) => updateFilter('status', e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Todos los estados</option>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Project filter */}
      <select
        value={currentProjectId ?? ''}
        onChange={(e) => updateFilter('project_id', e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 font-sans text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Todos los proyectos</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>

      {/* Clear filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Limpiar filtros
        </Button>
      )}
    </div>
  );
};

export default LeadsFilters;
