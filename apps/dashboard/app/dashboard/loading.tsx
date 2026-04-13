import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export default function DashboardLoading() {
  return (
    <div>
      <div className="mb-8">
        <Skeleton className="mb-2 h-4 w-32" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-4 h-px w-full" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="h-36 animate-pulse p-6">
            <Skeleton className="mb-4 h-9 w-9 rounded-lg" />
            <Skeleton className="mb-2 h-10 w-16" />
            <Skeleton className="mb-1 h-4 w-28" />
            <Skeleton className="h-3 w-24" />
          </Card>
        ))}
      </div>
    </div>
  );
}
