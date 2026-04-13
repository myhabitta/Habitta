import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug, getPackageBySlug } from '@habitta/database';
import { Card, CardContent } from '@/components/ui/card';
import PackageForm from '@/components/projects/PackageForm';
import { updatePackageAction } from '../../../../actions';

export default async function EditPackagePage({
  params,
}: {
  params: Promise<{ id: string; packageId: string }>;
}) {
  const { id: slug, packageId: packageSlug } = await params;

  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const pkg = await getPackageBySlug(project.id, packageSlug);
  if (!pkg) notFound();

  const action = updatePackageAction.bind(null, pkg.id, project.id, project.slug);

  return (
    <div>
      <nav className="mb-6 flex items-center gap-2 font-sans text-sm text-muted-foreground">
        <Link href="/dashboard/projects" className="transition-colors hover:text-foreground">
          Proyectos
        </Link>
        <span>/</span>
        <Link
          href={`/dashboard/projects/${project.slug}`}
          className="transition-colors hover:text-foreground"
        >
          {project.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">Editar paquete</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-display text-2xl font-semibold">Editar paquete</h1>
        <Card>
          <CardContent className="p-6">
            <PackageForm
              pkg={pkg}
              action={action}
              cancelHref={`/dashboard/projects/${project.slug}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
