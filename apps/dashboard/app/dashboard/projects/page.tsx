import { getProjectsWithClientCount } from '@habitta/database';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectCard from '@/components/projects/ProjectCard';
import ProjectsEmptyState from '@/components/projects/ProjectsEmptyState';

export default async function ProjectsPage() {
  const projects = await getProjectsWithClientCount();

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Proyectos</h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            {projects.length} {projects.length === 1 ? 'proyecto' : 'proyectos'} en total
          </p>
        </div>
        <Button
          asChild
          className="gap-2 text-white hover:opacity-90"
          style={{ backgroundColor: 'var(--habitta-accent)' }}
        >
          <Link href="/dashboard/projects/new">
            <Plus className="h-4 w-4" />
            Nuevo proyecto
          </Link>
        </Button>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <ProjectsEmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
