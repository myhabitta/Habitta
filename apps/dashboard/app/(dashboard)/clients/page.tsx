import { UserCheck, DollarSign, TrendingUp } from 'lucide-react';
import { getClients, getClientStats, getProjects } from '@habitta/database';
import { formatPrice } from '@habitta/utils';
import { Card, CardContent } from '@/components/ui/card';
import ClientsFilters from '@/components/clients/ClientsFilters';
import ClientsTable from '@/components/clients/ClientsTable';
import ClientsEmptyState from '@/components/clients/ClientsEmptyState';
import ClientConvertedSuccessModal from '@/components/clients/ClientConvertedSuccessModal';

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  sub?: string;
}

const StatCard = ({ icon, value, label, sub }: StatCardProps) => (
  <Card style={{ borderTop: '3px solid var(--habitta-accent)' }}>
    <CardContent className="p-6">
      <div className="mb-3">{icon}</div>
      <p className="font-display text-2xl font-bold lg:text-3xl">{value}</p>
      <p className="mt-1 font-sans text-sm text-muted-foreground">{label}</p>
      {sub && <p className="mt-1 font-sans text-sm font-bold text-muted-foreground">{sub}</p>}
    </CardContent>
  </Card>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ project_id?: string; converted?: string }>;
}) {
  const params = await searchParams;
  const projectFilter = params.project_id;
  const showConvertedModal = params.converted === '1';

  const [clients, stats, projects] = await Promise.all([
    getClients(projectFilter ? { project_id: projectFilter } : undefined),
    getClientStats(),
    getProjects(),
  ]);

  return (
    <div>
      <ClientConvertedSuccessModal openByDefault={showConvertedModal} />
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="mt-1 font-sans text-base font-bold text-muted-foreground">
            {stats.total} {stats.total === 1 ? 'cliente' : 'clientes'} en total
          </p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={
            <UserCheck
              className="h-5 w-5"
              style={{ color: 'var(--habitta-accent)' }}
              aria-hidden="true"
            />
          }
          value={String(stats.total)}
          label="Clientes activos"
        />
        <StatCard
          icon={
            <DollarSign
              className="h-5 w-5"
              style={{ color: 'var(--habitta-accent)' }}
              aria-hidden="true"
            />
          }
          value={formatPrice(stats.totalRevenue)}
          label="Ingresos totales"
        />
        <StatCard
          icon={
            <TrendingUp
              className="h-5 w-5"
              style={{ color: 'var(--habitta-accent)' }}
              aria-hidden="true"
            />
          }
          value={formatPrice(stats.averageTicket)}
          label="Ticket promedio"
          sub={`${stats.thisMonth} nuevos este mes`}
        />
      </div>

      {/* Filtros */}
      <ClientsFilters
        projects={projects}
        {...(params.project_id ? { currentProjectId: params.project_id } : {})}
      />

      {/* Tabla o empty state */}
      {clients.length === 0 ? (
        <ClientsEmptyState hasFilters={!!projectFilter} />
      ) : (
        <ClientsTable clients={clients} />
      )}
    </div>
  );
}
