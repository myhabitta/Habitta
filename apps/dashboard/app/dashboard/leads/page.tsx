import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import { getLeads, getLeadStats, getProjects } from '@habitta/database';
import type { LeadStatus } from '@habitta/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LeadsFilters from '@/components/leads/LeadsFilters';
import LeadsTable from '@/components/leads/LeadsTable';
import LeadsEmptyState from '@/components/leads/LeadsEmptyState';

// Mini stat card inline (solo se usa aquí)
interface StatCardProps {
  label: string;
  value: number;
  colorClass: string;
  bgClass: string;
}

const StatCard = ({ label, value, colorClass, bgClass }: StatCardProps) => (
  <Card className={`p-4 ${bgClass}`}>
    <p className={`font-display text-2xl font-semibold ${colorClass}`}>{value}</p>
    <p className="mt-0.5 font-sans text-xs text-muted-foreground">{label}</p>
  </Card>
);

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; project_id?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = params.status as LeadStatus | undefined;
  const projectFilter = params.project_id;

  const [leads, stats, projects] = await Promise.all([
    getLeads({
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(projectFilter ? { project_id: projectFilter } : {}),
    }),
    getLeadStats(),
    getProjects(),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold md:text-3xl">Leads</h1>
          <p className="mt-1 font-sans text-sm text-muted-foreground">
            {stats.total} leads en total
          </p>
        </div>
        <Button
          asChild
          className="gap-2 text-white hover:opacity-90 sm:shrink-0"
          style={{ backgroundColor: 'var(--habitta-accent)' }}
        >
          <Link href="/dashboard/leads/new">
            <UserPlus className="h-4 w-4" />
            Nuevo lead
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Nuevos"
          value={stats.new}
          colorClass="text-blue-600"
          bgClass="bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900"
        />
        <StatCard
          label="Contactados"
          value={stats.contacted}
          colorClass="text-yellow-600"
          bgClass="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-100 dark:border-yellow-900"
        />
        <StatCard
          label="En negociación"
          value={stats.negotiating}
          colorClass="text-orange-600"
          bgClass="bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900"
        />
        <StatCard
          label="Convertidos"
          value={stats.converted}
          colorClass="text-green-600"
          bgClass="bg-green-50 dark:bg-green-950/30 border-green-100 dark:border-green-900"
        />
      </div>

      {/* Filtros */}
      <LeadsFilters
        projects={projects}
        {...(params.status ? { currentStatus: params.status } : {})}
        {...(params.project_id ? { currentProjectId: params.project_id } : {})}
      />

      {/* Tabla o empty state */}
      {leads.length === 0 ? (
        <LeadsEmptyState hasFilters={!!(statusFilter || projectFilter)} />
      ) : (
        <LeadsTable leads={leads} />
      )}
    </div>
  );
}
