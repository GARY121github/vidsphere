import { Skeleton } from "@/components/ui/skeleton";

export default function VideoCardSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1  md:grid-cols-2  xl:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-60 w-[90%]" />
          <div className="flex items-center space-x-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex flex-col space-y-2">
              <Skeleton className="w-40 h-4 sm:w-52" />
              <Skeleton className="w-32 h-4 sm:w-40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
