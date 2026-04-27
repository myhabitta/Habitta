import Link from 'next/link';
import { getProjects } from '@habitta/database';
import { Card, CardContent } from '@/components/ui/card';
import LeadForm from '@/components/leads/LeadForm';

export default async function NewLeadPage() {
  const projects = await getProjects();

  return (
    <div>
      <nav className="mb-6 flex items-center gap-2 font-sans text-sm text-muted-foreground">
        <Link href="/leads" className="transition-colors hover:text-foreground">
          Leads
        </Link>
        <span>/</span>
        <span className="text-foreground">Nuevo lead</span>
      </nav>

      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 font-display text-2xl font-semibold">Nuevo lead</h1>
        <Card>
          <CardContent className="p-6">
            <LeadForm projects={projects} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
