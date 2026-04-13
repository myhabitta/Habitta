'use client';

interface ConversionFunnelProps {
  total: number;
  conversionRate: number;
}

const ConversionFunnel = ({ total, conversionRate }: ConversionFunnelProps) => {
  if (total === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        Sin datos de leads
      </div>
    );
  }

  const converted = Math.round(total * (conversionRate / 100));
  const negotiating = Math.max(converted, Math.round(total * 0.35));
  const contacted = Math.max(negotiating, Math.round(total * 0.6));
  const newLeads = total;

  const stages: Array<{ label: string; count: number; color: string; width: number }> = [
    { label: 'Nuevos', count: newLeads, color: 'var(--habitta-accent)', width: 100 },
    {
      label: 'Contactados',
      count: contacted,
      color: 'var(--warning)',
      width: Math.round((contacted / newLeads) * 100) || 80,
    },
    {
      label: 'En negociación',
      count: negotiating,
      color: '#F97316',
      width: Math.round((negotiating / newLeads) * 100) || 55,
    },
    {
      label: 'Convertidos',
      count: converted,
      color: 'var(--success)',
      width: Math.round((converted / newLeads) * 100) || 30,
    },
  ];

  return (
    <div className="space-y-2 py-2">
      {stages.map((stage, index) => {
        const prevCount = index > 0 ? stages[index - 1]?.count ?? 0 : 0;
        const dropoff =
          index > 0 && prevCount > 0
            ? Math.round(((prevCount - stage.count) / prevCount) * 100)
            : 0;

        return (
          <div key={stage.label}>
            {index > 0 && dropoff > 0 && (
              <div className="flex items-center justify-center py-1">
                <span className="font-sans text-xs text-muted-foreground">↓ -{dropoff}%</span>
              </div>
            )}
            <div className="flex items-center justify-center">
              <div
                className="flex items-center justify-between rounded-lg px-4 py-3 transition-all"
                style={{
                  width: `${stage.width}%`,
                  backgroundColor: `color-mix(in srgb, ${stage.color} 15%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${stage.color} 40%, transparent)`,
                }}
              >
                <span className="font-sans text-sm font-semibold" style={{ color: stage.color }}>
                  {stage.label}
                </span>
                <div className="text-right">
                  <span className="font-sans text-sm font-bold" style={{ color: stage.color }}>
                    {stage.count}
                  </span>
                  <span className="ml-1 font-sans text-xs text-muted-foreground">
                    ({Math.round((stage.count / total) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversionFunnel;
