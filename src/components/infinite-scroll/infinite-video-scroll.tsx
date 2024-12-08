"use client";

import { useEffect, useState } from "react";
import VideoCard, { VideoData } from "@/components/video/video-card";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useSidebar } from "../ui/sidebar";

interface InfiniteVideosScrollProps {
  initialVideos: VideoData[] | [];
  hasMoreVideo: boolean;
}

export default function InfiniteVideoScroll({
  initialVideos,
  hasMoreVideo,
}: InfiniteVideosScrollProps) {
  const [videos, setVideos] = useState<VideoData[] | []>(initialVideos);
  const [page, setPage] = useState<number>(1);
  const [hasMoreVideos, setHasMoreVideos] = useState<boolean>(hasMoreVideo);
  const [ref, inView] = useInView();
  const { state } = useSidebar();

  async function LoadMoreVideos() {
    const next = page + 1;
    const response = await axios.get("/api/v1/video", {
      params: {
        page: next,
      },
    });

    const moreVideos = response.data.data;

    if (!moreVideos.paginator.hasNextPage) {
      setHasMoreVideos(false);
    }

    if (moreVideos?.videos?.length) {
      setPage(next);

      // Corrected this part:
      setVideos((prev: VideoData[] | undefined) => [
        ...(prev || []), // Spread previous videos (handle undefined)
        ...moreVideos.videos, // Append new videos
      ]);
    }
  }

  useEffect(() => {
    if (inView) {
      LoadMoreVideos();
    }
  }, [inView]);

  return (
    <div className="flex flex-col gap-4 mx-auto">
      <div
        className={`grid gap-4 grid-cols-1 ${
          state === "collapsed" ? "md:grid-cols-4" : "md:grid-cols-3"
        }`}
      >
        {videos.length > 0 ? (
          videos.map((video: VideoData) => (
            <VideoCard key={video._id} {...video} duration={205} />
          ))
        ) : (
          <h1 className="col-span-full text-center text-lg font-semibold mt-80">
            No Videos Found
          </h1>
        )}
      </div>

      {videos.length > 0 && (
        <div className="mt-4">
          {hasMoreVideos ? (
            <div
              ref={ref}
              className="flex flex-col items-center justify-center"
            >
              <Loader2 className="animate-spin h-16 w-16" />
            </div>
          ) : (
            <h1 className="text-center text-lg font-semibold">
              No More Videos
            </h1>
          )}
        </div>
      )}
    </div>
  );
}
