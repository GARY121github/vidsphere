import React from "react";
import { Card, CardTitle } from "../ui/card";
import { formatDuration } from "@/utils/formatDuration";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { VideoData } from "./video-card";
import Link from "next/link";

const VideoListCard: React.FC<VideoData> = ({
  _id,
  title,
  owner,
  views,
  createdAt,
  description,
  duration,
  thumbnail,
  videoUrls,
}) => {
  return (
    <Link href={`/watch?v=${_id}`} className="block w-full p-2">
      <div className="grid grid-cols-7 gap-4">
        <div className="col-span-3 relative">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-52 object-cover rounded-lg"
          />
          <p className="text-xs text-white bg-black bg-opacity-70 p-1 rounded-md absolute bottom-2 right-2">
            {formatDuration(duration)}
          </p>
        </div>
        <div className="col-span-4">
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-xs text-white">{views} views</p>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={`@${owner.username}`}
                  className="flex items-center gap-1"
                >
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={owner.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className="text-xs text-gray-500">{owner.username}</p>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="p-1 bg-slate-500 text-white rounded-md border border-slate-500">
                <p className="text-xs">{owner.username}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <p className="text-xs text-gray-500 truncate">{description}</p>
        </div>
      </div>
    </Link>
  );
};

export default VideoListCard;
