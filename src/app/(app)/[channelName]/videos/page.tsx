"use client";

import VideoCard, { VideoGridItemProps } from "@/components/video-card";
import VideoSkeleton from "@/components/skeleton/video-skeleton";
import { useChannel } from "@/providers/contexts/channel-context";
import axios from "axios";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export default function VideoPage() {
  const { channelDetail } = useChannel();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const getChannelVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/v1/video?userId=${channelDetail?._id}`
      );
      setVideos(response.data.data.videos);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error while fetching channel videos",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!channelDetail?._id) {
      return;
    }

    getChannelVideos();
  }, []);

  if (loading) return <VideoSkeleton />;

  return (
    <div>
      {channelDetail?._id ? (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">
          {videos && videos.length > 0 ? (
            videos.map((video: any) => (
              <VideoCard
                key={video._id}
                {...video}
                duration={205}
                views={200}
              />
            ))
          ) : (
            <h1>No Video Found</h1>
          )}
        </div>
      ) : (
        <h1>Channel Not Found</h1>
      )}
    </div>
  );
}
