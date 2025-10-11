import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLoading() {
  return (
    <div className="container mx-auto px-6 pb-10">
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          {/* Welcome Card Skeleton */}
          <Card>
            <CardContent className="space-y-8">
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div>
                    <Skeleton className="h-12 w-64" />
                    <Skeleton className="mt-4 h-6 w-24" />
                  </div>
                </div>

                <div className="rounded-3xl border bg-card p-6">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-3 h-10 w-32" />
                  <Skeleton className="mt-2 h-3 w-40" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border bg-card p-5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="mt-2 h-5 w-20" />
                </div>
                <div className="rounded-2xl border bg-card p-5">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="mt-2 h-5 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Card Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-16" />
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="rounded-2xl border bg-card p-5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-3 h-5 w-32" />
              </div>
              <div className="rounded-2xl border bg-card p-5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="mt-3 h-5 w-28" />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
