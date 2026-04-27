import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeadDetailLoading() {
  return (
    <div>
      {/* Breadcrumb */}
      <Skeleton className="mb-6 h-4 w-48" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="overflow-hidden">
            <Skeleton className="h-1 w-full rounded-none" />
            <CardContent className="p-6">
              <div className="mb-6 flex items-center gap-4">
                <Skeleton className="h-16 w-16 shrink-0 rounded-2xl" />
                <div>
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="mt-2 h-5 w-24 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
                    <div>
                      <Skeleton className="mb-1 h-3 w-16" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-6 w-20" />
              <Skeleton className="h-28 w-full rounded-md" />
              <div className="mt-3 flex justify-end">
                <Skeleton className="h-9 w-32 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-5 h-6 w-36" />
              <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-6 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
