import VideoInfoCardSkeleton from "@/components/skeleton/VideoInfoCardSkeleton";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <div className="grid grid-cols-4">
      <div className="flex flex-col gap-4 max-w-3xl col-span-4 xl:col-span-3">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <VideoInfoCardSkeleton key={index} />
        ))}
      </div>
      <div className="hidden xl:block xl:col-span-1 fixed right-12 w-72 h-full ">
        <div className="text-xl font-semibold">
          Search Liked Videos: Coming Soon
        </div>
      </div>
    </div>
  );
};

export default Loading;
