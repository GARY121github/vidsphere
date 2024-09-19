"use client";

import VideoPlayer from "@/components/video/player/videp-player";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Video } from "@/models/video.model";

export default function WatchVideo() {
  const videoParams = useSearchParams();
  const videoId = videoParams.get("v");

  const [video, setVideo] = useState<Video | null>(null);
  const getVideo = async () => {
    const response = await axios.get(`/api/v1/video/${videoId}`);
    console.log(response);
    setVideo(response.data.data);
  };

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <div>
      {video && (
        <div className="">
          <VideoPlayer video={video} width="800" height="450" />
          <h1 className="text-xl font-bold mt-5">{video.title}</h1>
        </div>
      )}
    </div>
  );
}
