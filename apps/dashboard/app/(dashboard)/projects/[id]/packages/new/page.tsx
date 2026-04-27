import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug } from '@habitta/database';
import { Card, CardContent } from '@/components/ui/card';
import PackageForm from '@/components/projects/PackageForm';
import { createPackageAction } from '../../../actions';

export default async function NewPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const action = createPackageAction.bind(null, project.id, project.slug);

  return (
    <div>
      <nav className="mb-6 flex items-center gap-2 font-sans text-sm text-muted-foreground">
        <Link href="/projects" className="transition-colors hover:text-foreground">
          Proyectos
        </Link>
        <span>/</span>
        <Link
          href={`/projects/${project.slug}`}
          className="transition-colors hover:text-foreground"
        >
          {project.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">Nuevo paquete</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-display text-2xl font-semibold">Nuevo paquete</h1>
        <Card>
          <CardContent className="p-6">
            <PackageForm
              action={action}
              cancelHref={`/projects/${project.slug}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
