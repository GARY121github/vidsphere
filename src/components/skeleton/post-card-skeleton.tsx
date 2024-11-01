import { Skeleton } from "@/components/ui/skeleton";

export default function PostCardSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="space-y-6 w-full max-w-4xl">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="w-full bg-black border-slate-600 text-white shadow-md rounded-lg overflow-hidden"
          >
            {/* Card Header Skeleton */}
            <div className="p-4 border-b-2 border-slate-600">
              <div className="flex gap-2 items-center">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex flex-col space-y-1">
                  <Skeleton className="w-24 h-4 rounded" />
                  <Skeleton className="w-16 h-4 rounded" />
                </div>
              </div>
            </div>

            {/* Card Content Skeleton */}
            <div className="p-6 space-y-4">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-5 w-2/3 rounded" />
              <Skeleton className="h-40 w-full rounded-md" />
            </div>

            {/* Card Footer Skeleton */}
            <div className="flex gap-2 p-4">
              <Skeleton className="w-10 h-10 rounded" />
              <Skeleton className="w-10 h-10 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
