import Link from 'next/link';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProjectsEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="mb-4 rounded-2xl p-5"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--habitta-accent) 10%, transparent)',
        }}
      >
        <Building2
          className="h-10 w-10"
          style={{ color: 'color-mix(in srgb, var(--habitta-accent) 60%, transparent)' }}
          aria-hidden="true"
        />
      </div>

      <h2 className="font-display text-xl font-semibold">
        No hay proyectos aun
      </h2>
      <p className="mt-2 font-sans text-sm text-muted-foreground">
        Crea tu primer proyecto inmobiliario
      </p>

      <Button
        asChild
        className="mt-6 gap-2 text-white hover:opacity-90"
        style={{ backgroundColor: 'var(--habitta-accent)' }}
      >
        <Link href="/projects/new">
          <Plus className="h-4 w-4" />
          Crear proyecto
        </Link>
      </Button>
    </div>
  );
};

export default ProjectsEmptyState;
