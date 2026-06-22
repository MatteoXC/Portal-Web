import { Skeleton } from "@/components/ui/skeleton";

export const CourseListSkeleton = () => (
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {[1, 2, 3].map(i => (
      <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-3">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

export const SubjectPageSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="rounded-xl border border-border bg-card px-5 py-4 space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const TopicPageSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
    <Skeleton className="h-[300px] w-full rounded-xl" />
  </div>
);

export const AdminTableSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
    {[1, 2, 3, 4, 5].map(i => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/6" />
        <Skeleton className="h-4 w-16 ml-auto" />
      </div>
    ))}
  </div>
);
