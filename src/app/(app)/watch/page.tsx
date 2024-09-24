"use client";

import { useEffect, useState } from "react";
import VideoPlayer from "@/components/video/player/videp-player";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import VideoPlayerSkeleton from "@/components/skeleton/video-player-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Types } from "mongoose";
import Link from "next/link";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export interface VideoQuality {
  link: string;
  quality: string;
}

interface Video {
  _id: Types.ObjectId; // Change to ObjectId
  title: string;
  description: string;
  isPublished: boolean;
  videoUrls: Array<VideoQuality>;
  thumbnail: string;
  owner: {
    username: string;
    fullName: string;
    avatar: string;
    _id: string;
  };
  status: string;
}

export default function WatchVideo() {
  const videoParams = useSearchParams();
  const videoId = videoParams.get("v");

  const [video, setVideo] = useState<Video | null>(null);
  const getVideo = async () => {
    try {
      const response = await axios.get(`/api/v1/video/${videoId}`);
      setVideo(response.data.data);
    } catch (error) {}
  };

  useEffect(() => {
    getVideo();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        {video ? (
          <div className="flex flex-col gap-2">
            <VideoPlayer video={video} width="800" height="450" />
            <h1 className="text-3xl font-extrabold mt-5">{video.title}</h1>
            <div className="mt-4">
              <div className="flex justify-between">
                <Link href={`@${video.owner.username}`} className="flex gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={video.owner.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">
                    {video.owner.username}
                  </h2>
                </Link>
                <div className="flex bg-slate-600 items-center p-1 rounded-lg gap-2">
                  <Button className="bg-transparent">
                    <ThumbsUp size={22} />
                  </Button>
                  <Separator orientation="vertical" className="" />
                  <Button className="bg-transparent">
                    <ThumbsDown size={22} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-gray-600 w-full p-3 rounded-lg mt-3">
              <p>{video.description}</p>
            </div>
            <div className="p-2">
              <h1 className="text-4xl font-semibold">
                Comments Section: comming soon
              </h1>
            </div>
          </div>
        ) : (
          <VideoPlayerSkeleton />
        )}
      </div>
      <div className="">
        <h1 className="text-center font-semibold bg-slate-700 p-5">
          Recomended Video Version Comming Soon
        </h1>
      </div>
    </div>
  );
}
