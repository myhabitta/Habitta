'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import type { Project } from '@habitta/types';
import { Button } from '@/components/ui/button';

interface ClientsFiltersProps {
  projects: Project[];
  currentProjectId?: string;
}

const ClientsFilters = ({ projects, currentProjectId }: ClientsFiltersProps) => {
  const router = useRouter();
  const hasFilters = !!currentProjectId;

  const updateFilter = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set('project_id', value);
    const query = params.toString();
    router.push(`/dashboard/clients${query ? `?${query}` : ''}`);
  };

  const clearFilters = () => router.push('/dashboard/clients');

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      {/* Project filter */}
      <select
        value={currentProjectId ?? ''}
        onChange={(e) => updateFilter(e.target.value)}
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

export default ClientsFilters;
