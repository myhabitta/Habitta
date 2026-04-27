import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function MetricsLoading() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="mb-1 h-8 w-28" />
        <Skeleton className="h-4 w-44" />
      </div>

      {/* KPI cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="mb-3 h-9 w-9 rounded-lg" />
              <Skeleton className="mb-2 h-8 w-28" />
              <Skeleton className="mb-2 h-3 w-36" />
              <Skeleton className="h-5 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue chart */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="mb-1 h-6 w-56" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* 2 cols */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[250px] w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Funnel */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton className="h-6 w-52" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3 py-2">
            {[100, 80, 60, 40].map((w, i) => (
              <div key={i} className="flex justify-center">
                <Skeleton className="h-12 rounded-lg" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
