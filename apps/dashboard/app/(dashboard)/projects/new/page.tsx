import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthUser } from '@habitta/database';
import { Card, CardContent } from '@/components/ui/card';
import ProjectForm from '@/components/projects/ProjectForm';
import { createProjectAction } from '../actions';

export default async function NewProjectPage() {
  const user = await getAuthUser();
  if (user?.role === 'user') redirect('/projects');
  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 font-sans text-sm text-muted-foreground">
        <Link href="/projects" className="transition-colors hover:text-foreground">
          Proyectos
        </Link>
        <span>/</span>
        <span className="text-foreground">Nuevo proyecto</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-display text-2xl font-semibold">Nuevo proyecto</h1>
        <Card>
          <CardContent className="p-6">
            <ProjectForm action={createProjectAction} cancelHref="/projects" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
