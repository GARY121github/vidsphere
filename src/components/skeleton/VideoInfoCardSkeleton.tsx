import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const VideoInfoCardSkeleton = () => {
  return (
    <Card className="flex gap-2 bg-transparent border-0 text-white">
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
    </Card>
  );
};

export default VideoInfoCardSkeleton;
