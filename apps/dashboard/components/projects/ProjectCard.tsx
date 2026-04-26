'use client';

import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Users } from 'lucide-react';
import type { ProjectWithClientCount } from '@habitta/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProjectCardProps {
  project: ProjectWithClientCount;
}

const statusConfig: Record<
  ProjectWithClientCount['status'],
  { label: string; style: React.CSSProperties }
> = {
  active: {
    label: 'Activo',
    style: {
      backgroundColor: 'var(--success-tint)',
      color: 'var(--success)',
      border: 'transparent',
    },
  },
  inactive: {
    label: 'Inactivo',
    style: {
      backgroundColor: 'var(--muted)',
      color: 'var(--muted-foreground)',
      border: 'transparent',
    },
  },
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const router = useRouter();
  const status = statusConfig[project.status] ?? statusConfig.inactive;

  return (
    <Card
      onClick={() => router.push(`/projects/${project.slug}`)}
      className="group cursor-pointer overflow-hidden transition-all duration-200 hover:shadow-lg"
      style={{
        borderColor: undefined,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          'color-mix(in srgb, var(--habitta-accent) 30%, transparent)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '';
      }}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <h2 className="font-display text-lg font-semibold leading-tight">
            {project.name}
          </h2>
          <Badge variant="outline" style={status.style} className="shrink-0">
            {status.label}
          </Badge>
        </div>

        {/* Ubicacion */}
        <div className="flex items-center gap-1.5 font-sans text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            {project.city}, {project.department}
          </span>
        </div>

        {/* Descripcion */}
        {project.description && (
          <p className="mt-2 line-clamp-2 font-sans text-sm text-muted-foreground">
            {project.description}
          </p>
        )}

        {/* Clientes */}
        <div className="mt-3 flex items-center gap-1.5 font-sans text-sm text-muted-foreground">
          <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>
            {project.client_count === 0
              ? 'Sin clientes'
              : project.client_count === 1
                ? '1 cliente'
                : `${project.client_count} clientes`}
          </span>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 font-sans text-sm"
          style={{ color: 'var(--habitta-accent)' }}
        >
          <span>Ver detalle</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
