'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { PackagePerformance } from '@habitta/types';

interface PackagePerformanceChartProps {
  data: PackagePerformance[];
}

const formatCOP = (amount: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);

interface TooltipEntry {
  payload: PackagePerformance;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div
      className="rounded-lg border p-3 font-sans text-sm shadow-lg"
      style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <p className="font-semibold">{d.package_name}</p>
      <p className="mb-2 text-xs text-muted-foreground">{d.project_name}</p>
      <p style={{ color: 'var(--habitta-accent)' }}>{d.total_sold} ventas</p>
      <p className="text-xs text-muted-foreground">{formatCOP(d.total_revenue)}</p>
    </div>
  );
};

const PackagePerformanceChart = ({ data }: PackagePerformanceChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
        Sin datos de ventas
      </div>
    );
  }

  const top5 = data.slice(0, 5);
  const top3 = data.slice(0, 3);

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={top5} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="package_name"
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total_sold" radius={[0, 4, 4, 0]}>
            {top5.map((_, index) => (
              <Cell key={`cell-${index}`} fill="#1883FF" fillOpacity={1 - index * 0.15} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {top3.length > 0 && (
        <div className="mt-4 space-y-3">
          {top3.map((pkg, index) => (
            <div key={pkg.package_id} className="flex items-center gap-3">
              <span
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ backgroundColor: 'var(--habitta-accent)' }}
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate font-sans text-xs font-semibold">
                    {pkg.package_name}
                  </span>
                  <span className="ml-2 shrink-0 font-sans text-xs text-muted-foreground">
                    {pkg.total_sold} ventas
                  </span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pkg.percentage}%`,
                      backgroundColor: 'var(--habitta-accent)',
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PackagePerformanceChart;
