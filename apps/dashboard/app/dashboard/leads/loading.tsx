import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeadsLoading() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-20" />
          <Skeleton className="mt-2 h-4 w-36" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Stats skeleton */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-8 w-10" />
            <Skeleton className="mt-1 h-3 w-20" />
          </Card>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-9 w-44 rounded-md" />
        <Skeleton className="h-9 w-44 rounded-md" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-lg border">
        <div className="border-b p-4">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="hidden h-4 w-28 md:block" />
            <Skeleton className="hidden h-4 w-24 lg:block" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 border-b p-4 last:border-0">
            <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="ml-auto hidden h-4 w-24 sm:block" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
