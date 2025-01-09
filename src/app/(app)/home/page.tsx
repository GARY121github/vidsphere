"use client";

import axios from "axios";
import { VideoData } from "@/components/video/video-card";
import InfiniteScroll from "@/components/infinite-scroll/infinite-video-scroll";
import { useEffect, useState } from "react";
import VideoCardSkeleton from "@/components/skeleton/video-card-skeleton";

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [videos, setVideos] = useState<VideoData[] | []>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/video");
      console.log(response);
      setVideos(response.data.data.videos);
      setHasNextPage(response.data.data.hasNextPage ?? false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div>
      {loading ? (
        <VideoCardSkeleton />
      ) : (
        <InfiniteScroll initialVideos={videos} hasMoreVideo={hasNextPage} />
      )}
    </div>
  );
}
