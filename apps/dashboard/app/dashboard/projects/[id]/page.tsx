import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Pencil, Plus, Package as PackageIcon } from 'lucide-react';
import { getProjectBySlug, getPackagesByProject } from '@habitta/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PackageCard from '@/components/projects/PackageCard';

// ─── Status badge inline ──────────────────────────────────────────────────────

const ProjectStatusBadge = ({ status }: { status: 'active' | 'inactive' }) => (
  <span
    className="inline-flex items-center rounded-full px-3 py-1 font-sans text-xs font-semibold"
    style={
      status === 'active'
        ? { backgroundColor: 'var(--success-tint)', color: 'var(--success)' }
        : { backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }
    }
  >
    <span
      className="mr-1.5 h-1.5 w-1.5 rounded-full"
      style={{
        backgroundColor:
          status === 'active' ? 'var(--success)' : 'var(--muted-foreground)',
      }}
    />
    {status === 'active' ? 'Activo' : 'Inactivo'}
  </span>
);

// ─── Packages empty state ─────────────────────────────────────────────────────

const PackagesEmptyState = ({ projectSlug }: { projectSlug: string }) => (
  <div
    className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16 text-center"
    style={{ borderColor: 'var(--habitta-accent-tint)' }}
  >
    <div
      className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
      style={{ backgroundColor: 'var(--habitta-accent-tint)' }}
    >
      <PackageIcon
        className="h-7 w-7"
        style={{ color: 'var(--habitta-accent)' }}
      />
    </div>
    <p className="font-display text-lg font-semibold">Sin paquetes de acabados</p>
    <p className="mt-1 max-w-xs font-sans text-sm text-muted-foreground">
      Los paquetes definen los niveles de acabados disponibles para este proyecto
    </p>
    <Button
      asChild
      className="mt-5 gap-2 text-white hover:opacity-90"
      style={{ backgroundColor: 'var(--habitta-accent)' }}
    >
      <Link href={`/dashboard/projects/${projectSlug}/packages/new`}>
        <Plus className="h-4 w-4" />
        Agregar primer paquete
      </Link>
    </Button>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const packages = await getPackagesByProject(project.id);

  return (
    <div>
      {/* Breadcrumb */}
      <nav
        className="mb-6 flex items-center gap-2 font-sans text-sm text-muted-foreground"
        aria-label="Breadcrumb"
      >
        <Link
          href="/dashboard/projects"
          className="transition-colors hover:text-foreground"
        >
          Proyectos
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-foreground">{project.name}</span>
      </nav>

      {/* Info card del proyecto */}
      <Card className="mb-8 overflow-hidden">
        {/* Banda de color superior */}
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: 'var(--habitta-accent)' }}
        />
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-2xl font-semibold md:text-3xl">
                  {project.name}
                </h1>
                <ProjectStatusBadge status={project.status} />
              </div>
              <div className="mt-2 flex items-center gap-1.5 font-sans text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>
                  {project.city}, {project.department}
                </span>
              </div>
              {project.description && (
                <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
              )}
            </div>
            <div className="shrink-0">
              <Button asChild variant="outline" className="gap-2">
                <Link href={`/dashboard/projects/${project.slug}/edit`}>
                  <Pencil className="h-4 w-4" />
                  Editar proyecto
                </Link>
              </Button>
            </div>
          </div>

          {/* Stat rapida */}
          <div
            className="mt-5 flex items-center gap-2 rounded-lg px-4 py-3"
            style={{ backgroundColor: 'var(--habitta-accent-tint)' }}
          >
            <PackageIcon
              className="h-4 w-4 shrink-0"
              style={{ color: 'var(--habitta-accent)' }}
            />
            <span
              className="font-sans text-sm"
              style={{ color: 'var(--habitta-accent)' }}
            >
              <span className="font-semibold">{packages.length}</span>
              {packages.length === 1
                ? ' paquete de acabados'
                : ' paquetes de acabados'}{' '}
              configurado{packages.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Seccion paquetes */}
      <section>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">
              Paquetes de acabados
            </h2>
            <p className="mt-0.5 font-sans text-sm text-muted-foreground">
              Define los niveles de acabados disponibles para este proyecto
            </p>
          </div>
          <Button
            asChild
            className="gap-2 text-white hover:opacity-90 sm:shrink-0"
            style={{ backgroundColor: 'var(--habitta-accent)' }}
          >
            <Link href={`/dashboard/projects/${project.slug}/packages/new`}>
              <Plus className="h-4 w-4" />
              Agregar paquete
            </Link>
          </Button>
        </div>

        {packages.length === 0 ? (
          <PackagesEmptyState projectSlug={project.slug} />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} projectSlug={project.slug} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
