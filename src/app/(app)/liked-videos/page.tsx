"use client";

import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import axios, { AxiosError } from "axios";
import VideoListSkeleton from "@/components/skeleton/video-list-skeleton";
import { VideoData } from "@/components/video/video-card";
import VideoListCard from "@/components/video/video-list-card";

export default function LikedVideos() {
  const [likedVideos, setLikedVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const fetchLikedVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>("api/v1/like");
      console.log(response.data.data);
      setLikedVideos(response.data.data);
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Fetch liked videos failed!",
        description: errorMessage || "Failed to fetch liked videos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  if (loading) return <VideoListSkeleton />;

  return (
    <div>
      {likedVideos.length > 0 ? (
        <div className="grid grid-cols-4">
          <div className="flex flex-col gap-4 max-w-3xl col-span-4 xl:col-span-3 w-full">
            {likedVideos.map((video) => (
              <VideoListCard key={video._id} {...video} />
            ))}
          </div>
          <div className="hidden  xl:block xl:col-span-1 fixed right-12 w-72 h-full">
            <div className="text-xl font-semibold">
              Search Liked Video: Coming Soon
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <h1 className="text-center text-lg font-semibold">
            No liked videos found
          </h1>
        </div>
      )}
    </div>
  );
}
