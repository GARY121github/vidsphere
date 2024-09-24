"use client";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "../../utils/formatDuration";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import Link from "next/link";
import { VideoQuality } from "@/models/video.model";

export interface VideoGridItemProps {
  _id: string;
  title: string;
  owner: {
    _id: string;
    username: string;
    avatar: string;
  };
  views: number;
  createdAt: Date;
  duration: number;
  thumbnail: string;
  videoUrls: Array<VideoQuality>;
}

const VIEW_FORMATTER = new Intl.NumberFormat(undefined, {
  notation: "compact",
});

export default function VideoCard({
  _id,
  title,
  owner,
  views,
  createdAt,
  duration,
  thumbnail,
  videoUrls,
}: VideoGridItemProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current == null) return;

    if (isVideoPlaying) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, [isVideoPlaying]);

  return (
    <div
      className="flex flex-col gap-2"
      onMouseEnter={() => setIsVideoPlaying(true)}
      onMouseLeave={() => setIsVideoPlaying(false)}
    >
      <Link href={`/watch?v=${_id}`} className="relative aspect-video">
        <img
          src={thumbnail}
          className={`block w-full h-full object-cover transition-[border-radius] duration-200 ${
            isVideoPlaying ? "rounded-none" : "rounded-xl"
          }`}
        />
        <div className="absolute bottom-1 right-1 bg-secondary-dark text-secondary text-sm px-0.5 rounded">
          <h1>{formatDuration(duration)}</h1>
        </div>
        {/* <video
          className={`block h-full object-cover absolute inset-0 transition-opacity duration-200 ${
            isVideoPlaying ? "opacity-100 delay-200" : "opacity-0"
          }`}
          ref={videoRef}
          muted
          playsInline
          src={videoUrls[0].quality}
        /> */}
      </Link>
      <div className="flex gap-2">
        <Link href={`/@${owner.username}`} className="flex-shrink-0">
          <img className="w-12 h-12 rounded-full" src={owner.avatar} />
        </Link>
        <div className="flex flex-col">
          <Link href={`/watch?v=${_id}`} className="font-bold">
            {title}
          </Link>
          <Link href={`/@${owner._id}`} className="text-secondary-text text-sm">
            {owner.username}
          </Link>
          <div className="text-secondary-text text-sm">
            {VIEW_FORMATTER.format(views)} Views •{" "}
            {formatTimeAgo(new Date(createdAt))}
          </div>
        </div>
      </div>
    </div>
  );
}
