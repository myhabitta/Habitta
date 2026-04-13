import { TrendingUp, TrendingDown } from 'lucide-react';

interface GrowthBadgeProps {
  value: number;
}

const GrowthBadge = ({ value }: GrowthBadgeProps) => {
  const isPositive = value >= 0;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
      style={{
        backgroundColor: isPositive ? 'var(--success-tint)' : 'var(--destructive-tint)',
        color: isPositive ? 'var(--success)' : 'var(--destructive)',
      }}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3" aria-hidden="true" />
      ) : (
        <TrendingDown className="h-3 w-3" aria-hidden="true" />
      )}
      {isPositive ? '+' : ''}
      {value}%
    </span>
  );
};

export default GrowthBadge;
