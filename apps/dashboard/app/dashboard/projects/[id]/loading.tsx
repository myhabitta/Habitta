import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectDetailLoading() {
  return (
    <div>
      {/* Breadcrumb skeleton */}
      <Skeleton className="mb-6 h-4 w-48" />

      {/* Header skeleton */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex-1">
          <Skeleton className="h-9 w-72" />
          <Skeleton className="mt-3 h-4 w-48" />
          <Skeleton className="mt-2 h-4 w-full max-w-lg" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-10 w-36 rounded-md" />
        </div>
      </div>

      {/* Sección paquetes skeleton */}
      <div className="mb-6 flex items-center justify-between">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-10 w-36 rounded-md" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-5 w-16 rounded-full" />
              <Skeleton className="h-7 w-32" />
              <Skeleton className="mt-2 h-8 w-40" />
              <div className="mt-4 flex flex-col gap-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
              <Skeleton className="mt-6 h-9 w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
