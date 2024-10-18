"use client";

import { useToast } from "@/components/ui/use-toast";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import VideoListSkeleton from "@/components/skeleton/video-list-skeleton";
import VideoInfoCard from "@/components/cards/VideoInfoCard";

interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  owner: {
    _id: string;
    username: string;
    fullName: string;
  };
}

const WatchPage = () => {
  const [watchedVideos, setWatchedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchWatchedVideos = async () => {
    setLoading(true);

    try {
      // const response = await axios.get<ApiResponse>("api/v1/watch");
      // if (response.status !== 200) {
      //   throw new Error("Failed to fetch watched videos");
      // }
      // setWatchedVideos(response.data.data);
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Fetch watched videos failed!",
        description: errorMessage || "Failed to fetch watched videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchedVideos();
  }, []);

  if (loading) return <VideoListSkeleton />;

  return (
    <div className="grid grid-cols-4">
      <div className="flex flex-col gap-4 max-w-3xl col-span-4 xl:col-span-3 w-full">
        {watchedVideos.map((video) => (
          <VideoInfoCard
            key={video._id}
            _id={video._id}
            title={video.title}
            description={video.description}
            thumbnail={video.thumbnail}
            owner={video.owner}
          />
        ))}
      </div>
      <div className="hidden  xl:block xl:col-span-1 fixed right-12 w-72 h-full">
        <div className="text-xl font-semibold">
          Search Watch History: Coming Soon
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
