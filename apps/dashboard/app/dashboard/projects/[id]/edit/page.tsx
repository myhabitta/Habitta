import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjectBySlug } from '@habitta/database';
import { Card, CardContent } from '@/components/ui/card';
import ProjectForm from '@/components/projects/ProjectForm';
import { updateProjectAction } from '../../actions';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const action = updateProjectAction.bind(null, project.id);

  return (
    <div>
      {/* Breadcrumb */}
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
        <span className="text-foreground">Editar</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-display text-2xl font-semibold">Editar proyecto</h1>
        <Card>
          <CardContent className="p-6">
            <ProjectForm
              project={project}
              action={action}
              cancelHref={`/dashboard/projects/${project.slug}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
