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
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [hasSubscribed, setHasSubscribed] = useState<Boolean>(false);
  const [subscribers, setSubscribers] = useState(0);
  const { toast } = useToast();

  const getVideo = async () => {
    try {
      const response = await axios.get(`/api/v1/video/${videoId}`);
      setVideo(response.data.data);
      setSubscribers(response.data.data.subscriberCount);
      setHasSubscribed(response.data.data.isSubscribed);
    } catch (error) {
      router.replace("/watch/video-not-found");
    }
  };

  const toggleSubscription = async () => {
    setHasSubscribed((prev) => !prev);
    setSubscribers((prev) => (hasSubscribed ? prev - 1 : prev + 1));
    toast({
      title: `${hasSubscribed ? "Unsubscribed Successfully" : "Subscribed Successfully"}`,
    });
    try {
      const response = await axios.put(
        `/api/v1/subscription/c/${video?.owner._id}`
      );
      console.log(response);
    } catch (error: any) {
      toast({
        title: "Something went wrong while toggeling the subscrpition",
        description: error.message,
      });
      setSubscribers((prev) => (hasSubscribed ? prev + 1 : prev - 1));
      setHasSubscribed((prev) => !prev);
    }
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
                  <div>
                    <h2 className="text-xl font-semibold capitalize">
                      {video.owner.fullName}
                    </h2>
                    <p>{subscribers} subscribers</p>
                  </div>
                </Link>
                <div className="flex items-center gap-4">
                  <div>
                    {hasSubscribed ? (
                      <AlertDialog>
                        <AlertDialogTrigger className="bg-gray-700 p-3 rounded-3xl inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                          Unsubscribe
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-gray-700 text-white border-none p-6 max-w-[19%]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="">
                              Unsubscribe from {video.owner.username}
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex gap-5">
                            <AlertDialogCancel className="text-black">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={toggleSubscription}>
                              Unsubscribe
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button
                        onClick={toggleSubscription}
                        className="bg-white p-4 rounded-3xl text-black hover:bg-slate-300"
                      >
                        Subscribe
                      </Button>
                    )}
                  </div>
                  <div className="flex bg-slate-600 items-center p-1 rounded-lg gap-2">
                    <Button className="bg-transparent">
                      <ThumbsUp size={22} />
                    </Button>
                    <Separator orientation="vertical" className="h-7" />
                    <Button className="bg-transparent">
                      <ThumbsDown size={22} />
                    </Button>
                  </div>
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
