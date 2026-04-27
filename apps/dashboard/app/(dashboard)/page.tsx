import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthUser, getDashboardMetrics } from '@habitta/database';
import { DollarSign, Users, UserCheck, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import GrowthBadge from '@/components/metrics/GrowthBadge';

const formatCOP = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

export default async function DashboardPage() {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  const metrics = await getDashboardMetrics();

  return (
    <div>
      <div className="mb-8">
        <p className="font-sans text-sm text-muted-foreground">
          Bienvenido de nuevo,
        </p>
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          {user.full_name ?? user.email ?? 'Usuario'}
        </h1>
        <Separator className="mt-4" />
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Ingresos totales */}
        <Card className="relative cursor-default overflow-hidden border-0 bg-yellow-50 p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-yellow-950/30">
          <div className="absolute right-4 top-4 opacity-[0.07]">
            <DollarSign className="h-16 w-16 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
          </div>
          <div className="relative">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/60">
              <DollarSign className="h-4 w-4 text-yellow-600 dark:text-yellow-400" aria-hidden="true" />
            </div>
            <p className="font-display text-3xl font-bold text-yellow-700 dark:text-yellow-300">
              {formatCOP(metrics.revenue.total)}
            </p>
            <p className="mt-1 font-sans text-sm font-medium text-yellow-600/70 dark:text-yellow-400/80">
              Ingresos totales
            </p>
            <div className="mt-2 flex items-center gap-2">
              <GrowthBadge value={metrics.revenue.growthPercentage} />
              <span className="font-sans text-xs text-yellow-500/60 dark:text-yellow-400/60">vs mes anterior</span>
            </div>
          </div>
        </Card>

        {/* Leads totales */}
        <Card className="relative cursor-default overflow-hidden border-0 bg-blue-50 p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-blue-950/40">
          <div className="absolute right-4 top-4 opacity-[0.07]">
            <Users className="h-16 w-16 text-blue-600 dark:text-blue-400" aria-hidden="true" />
          </div>
          <div className="relative">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/60">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
            </div>
            <p className="font-display text-4xl font-bold text-blue-700 dark:text-blue-300">
              {metrics.leads.total}
            </p>
            <p className="mt-1 font-sans text-sm font-medium text-blue-600/70 dark:text-blue-400/80">
              Leads totales
            </p>
            <p className="mt-1 font-sans text-xs text-blue-500/60 dark:text-blue-400/60">
              {metrics.leads.thisMonth} nuevos este mes
            </p>
          </div>
        </Card>

        {/* Clientes */}
        <Card className="relative cursor-default overflow-hidden border-0 bg-green-50 p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-green-950/40">
          <div className="absolute right-4 top-4 opacity-[0.07]">
            <UserCheck className="h-16 w-16 text-green-600 dark:text-green-400" aria-hidden="true" />
          </div>
          <div className="relative">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/60">
              <UserCheck className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden="true" />
            </div>
            <p className="font-display text-4xl font-bold text-green-700 dark:text-green-300">
              {metrics.clients.total}
            </p>
            <p className="mt-1 font-sans text-sm font-medium text-green-600/70 dark:text-green-400/80">
              Clientes
            </p>
            <p className="mt-1 font-sans text-xs text-green-500/60 dark:text-green-400/60">
              {metrics.clients.thisMonth} nuevos este mes
            </p>
          </div>
        </Card>

        {/* Tasa de conversión */}
        <Card className="relative cursor-default overflow-hidden border-0 bg-purple-50 p-6 shadow-sm transition-all duration-200 hover:shadow-md dark:bg-purple-950/40">
          <div className="absolute right-4 top-4 opacity-[0.07]">
            <TrendingUp className="h-16 w-16 text-purple-600 dark:text-purple-400" aria-hidden="true" />
          </div>
          <div className="relative">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/60">
              <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" aria-hidden="true" />
            </div>
            <p className="font-display text-4xl font-bold text-purple-700 dark:text-purple-300">
              {metrics.leads.conversionRate}%
            </p>
            <p className="mt-1 font-sans text-sm font-medium text-purple-600/70 dark:text-purple-400/80">
              Tasa de conversión
            </p>
            <p className="mt-1 font-sans text-xs text-purple-500/60 dark:text-purple-400/60">
              De leads a clientes
            </p>
          </div>
        </Card>
      </div>

      {/* Link a métricas completas — solo admin */}
      {user.role === 'admin' && (
        <div className="mt-6 text-right">
          <Link
            href="/metrics"
            className="font-sans text-sm font-medium"
            style={{ color: 'var(--habitta-accent)' }}
          >
            Ver métricas completas →
          </Link>
        </div>
      )}
    </div>
  );
}
