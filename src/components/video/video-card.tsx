"use client";
import { useRef } from "react";
import { formatDuration } from "../../utils/formatDuration";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import Link from "next/link";
import { VideoQuality } from "@/models/video.model";
import Image from "next/image";

export interface VideoData {
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
  description: string;
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
}: VideoData) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <div className="flex flex-col gap-3 mb-5">
      {/* Thumbnail */}
      <Link
        href={`/watch?v=${_id}`}
        className="relative block w-full aspect-video"
      >
        <div className="relative w-full h-0 pb-[56.25%]">
          <img
            src={thumbnail}
            alt="thumbnail"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-lg"
          />
        </div>
        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-sm px-2 py-0.5 rounded-md">
          <h1>{formatDuration(duration)}</h1>
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex gap-2">
        <Link href={`/@${owner.username}`} className="flex-shrink-0">
          <Image
            className="rounded-full"
            width={48}
            height={48}
            src={owner.avatar}
            alt={owner.username}
          />
        </Link>
        <div className="flex flex-col overflow-hidden">
          <Link
            href={`/watch?v=${_id}`}
            className="font-bold text-ellipsis line-clamp-2"
          >
            {title}
          </Link>
          <Link
            href={`/@${owner.username}`}
            className="text-secondary-text text-sm"
          >
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
