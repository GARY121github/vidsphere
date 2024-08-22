import { Skeleton } from "@/components/ui/skeleton";

export default function VideoSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index}>
          <Skeleton className="h-60 w-[90%]" />
          <div className="flex items-center space-x-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex flex-col space-y-2 mt-5">
              <Skeleton className="w-96 h-4" />
              <Skeleton className="w-40 h-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
