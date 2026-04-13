import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ClientDetailLoading() {
  return (
    <div>
      {/* Breadcrumb skeleton */}
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-3" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Card: Información del cliente */}
          <Card className="overflow-hidden">
            <div className="h-1 w-full bg-muted" />
            <CardContent className="p-6">
              <div className="mb-6 flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <div className="space-y-2 pt-1">
                  <Skeleton className="h-7 w-48" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card: Detalle de compra */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-px w-full" />
              <div className="flex items-center justify-between pt-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-9 w-40" />
              </div>
            </CardContent>
          </Card>

          {/* Card: Notas */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-6 w-16" />
              <Skeleton className="h-28 w-full rounded-md" />
              <div className="mt-3 flex justify-end">
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha */}
        <div className="flex flex-col gap-6">
          {/* Card: Estado del proceso */}
          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-6 w-40" />
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card: Lead de origen */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </CardContent>
          </Card>

          {/* Card: Resumen */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent className="space-y-3 px-6 pb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <Skeleton className="mb-1 h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
