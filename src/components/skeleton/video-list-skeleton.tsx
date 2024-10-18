import { Skeleton } from "@/components/ui/skeleton";

export default function VideoListSkeleton() {
  return (
    <div className="">
      <div className="flex flex-col gap-4 max-w-3xl">
        {[1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className="flex gap-2 bg-transparent border-0 text-white"
          >
            <div className="flex-shrink-0">
              <Skeleton className="w-36 h-24 sm:w-72 sm:h-40 rounded-lg" />
            </div>
            <div className="p-1 w-full space-y-4">
              <Skeleton className="h-4" />
              <Skeleton className="w-[50%] h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
