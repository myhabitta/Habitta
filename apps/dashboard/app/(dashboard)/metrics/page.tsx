import {
  getDashboardMetrics,
  getMonthlyRevenue,
  getPackagePerformance,
  getProjectPerformance,
} from '@habitta/database';
import { DollarSign, UserCheck, Target, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RevenueChart from '@/components/metrics/RevenueChart';
import PackagePerformanceChart from '@/components/metrics/PackagePerformanceChart';
import ProjectPerformanceTable from '@/components/metrics/ProjectPerformanceTable';
import ConversionFunnel from '@/components/metrics/ConversionFunnel';
import GrowthBadge from '@/components/metrics/GrowthBadge';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCOP = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function MetricsPage() {
  const [metrics, monthlyRevenue, packagePerf, projectPerf] = await Promise.all([
    getDashboardMetrics(),
    getMonthlyRevenue(6),
    getPackagePerformance(),
    getProjectPerformance(),
  ]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="mt-1 font-sans text-base font-bold text-muted-foreground">
          Resumen del negocio
        </p>
      </div>

      {/* KPI Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Ingresos totales */}
        <Card style={{ borderTop: '3px solid var(--habitta-accent)' }}>
          <CardContent className="p-6">
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--habitta-accent-tint)' }}
            >
              <DollarSign
                className="h-4 w-4"
                style={{ color: 'var(--habitta-accent)' }}
                aria-hidden="true"
              />
            </div>
            <p className="font-display text-xl font-bold md:text-2xl lg:text-3xl">
              {formatCOP(metrics.revenue.total)}
            </p>
            <p className="mt-1 font-sans text-sm text-muted-foreground">Ingresos totales</p>
            <div className="mt-2 flex items-center gap-2">
              <GrowthBadge value={metrics.revenue.growthPercentage} />
              <span className="text-xs text-muted-foreground">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        {/* Clientes */}
        <Card style={{ borderTop: '3px solid var(--habitta-accent)' }}>
          <CardContent className="p-6">
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--habitta-accent-tint)' }}
            >
              <UserCheck
                className="h-4 w-4"
                style={{ color: 'var(--habitta-accent)' }}
                aria-hidden="true"
              />
            </div>
            <p className="font-display text-xl font-bold md:text-2xl lg:text-3xl">
              {metrics.clients.total}
            </p>
            <p className="mt-1 font-sans text-sm text-muted-foreground">Clientes</p>
            <p className="mt-2 font-sans text-xs" style={{ color: 'var(--success)' }}>
              {metrics.clients.thisMonth} este mes
            </p>
          </CardContent>
        </Card>

        {/* Tasa de conversión */}
        <Card style={{ borderTop: '3px solid var(--habitta-accent)' }}>
          <CardContent className="p-6">
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--habitta-accent-tint)' }}
            >
              <Target
                className="h-4 w-4"
                style={{ color: 'var(--habitta-accent)' }}
                aria-hidden="true"
              />
            </div>
            <p className="font-display text-xl font-bold md:text-2xl lg:text-3xl">
              {metrics.leads.conversionRate}%
            </p>
            <p className="mt-1 font-sans text-sm text-muted-foreground">Tasa de conversión</p>
            <p className="mt-2 font-sans text-xs text-muted-foreground">
              {metrics.leads.total} leads totales
            </p>
          </CardContent>
        </Card>

        {/* Ticket promedio */}
        <Card style={{ borderTop: '3px solid var(--habitta-accent)' }}>
          <CardContent className="p-6">
            <div
              className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: 'var(--habitta-accent-tint)' }}
            >
              <Receipt
                className="h-4 w-4"
                style={{ color: 'var(--habitta-accent)' }}
                aria-hidden="true"
              />
            </div>
            <p className="font-display text-xl font-bold md:text-2xl lg:text-3xl">
              {formatCOP(metrics.clients.averageTicket)}
            </p>
            <p className="mt-1 font-sans text-sm text-muted-foreground">Ticket promedio</p>
            <p className="mt-2 font-sans text-xs text-muted-foreground">Por cliente</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de ingresos */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-display text-lg font-semibold">
            Ingresos últimos 6 meses
          </CardTitle>
          {monthlyRevenue.length > 0 && (
            <p className="font-sans text-sm text-muted-foreground">
              {monthlyRevenue[0]?.label} — {monthlyRevenue[monthlyRevenue.length - 1]?.label}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <RevenueChart data={monthlyRevenue} />
        </CardContent>
      </Card>

      {/* Rendimiento por paquete y por proyecto */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-semibold">
              Rendimiento por paquete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PackagePerformanceChart data={packagePerf} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg font-semibold">
              Rendimiento por proyecto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectPerformanceTable data={projectPerf} />
          </CardContent>
        </Card>
      </div>

      {/* Embudo de conversión */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="font-display text-lg font-semibold">Embudo de conversión</CardTitle>
        </CardHeader>
        <CardContent>
          <ConversionFunnel
            total={metrics.leads.total}
            conversionRate={metrics.leads.conversionRate}
          />
        </CardContent>
      </Card>
    </div>
  );
}
