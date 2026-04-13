'use client';

import type { ProjectPerformance } from '@habitta/types';

interface ProjectPerformanceTableProps {
  data: ProjectPerformance[];
}

const formatCOP = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

interface ConversionBadgeProps {
  rate: number;
}

const ConversionBadge = ({ rate }: ConversionBadgeProps) => {
  const style =
    rate > 30
      ? { backgroundColor: 'var(--success-tint)', color: 'var(--success)' }
      : rate > 15
        ? { backgroundColor: 'var(--warning-tint)', color: 'var(--warning)' }
        : { backgroundColor: 'var(--destructive-tint)', color: 'var(--destructive)' };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-sans text-xs font-semibold"
      style={style}
    >
      {rate}%
    </span>
  );
};

const ProjectPerformanceTable = ({ data }: ProjectPerformanceTableProps) => {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        Sin datos de proyectos
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((p) => p.total_revenue));

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-sans text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Proyecto
            </th>
            <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Leads
            </th>
            <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Clientes
            </th>
            <th className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Conv.
            </th>
            <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Revenue
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((project) => {
            const isTop = project.total_revenue === maxRevenue && maxRevenue > 0;
            return (
              <tr
                key={project.project_id}
                className="border-b last:border-0"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: isTop
                    ? 'color-mix(in srgb, var(--habitta-accent) 5%, transparent)'
                    : 'transparent',
                }}
              >
                <td className="py-3 pr-4">
                  <span className="font-medium">{project.project_name}</span>
                  <span className="block text-xs text-muted-foreground">{project.city}</span>
                </td>
                <td className="py-3 text-center text-muted-foreground">{project.total_leads}</td>
                <td className="py-3 text-center text-muted-foreground">{project.total_clients}</td>
                <td className="py-3 text-center">
                  <ConversionBadge rate={project.conversion_rate} />
                </td>
                <td
                  className="py-3 text-right font-semibold"
                  style={{ color: 'var(--habitta-accent)' }}
                >
                  {formatCOP(project.total_revenue)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectPerformanceTable;
