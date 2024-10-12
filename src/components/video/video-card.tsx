"use client";
import { useEffect, useRef, useState } from "react";
import { formatDuration } from "../../utils/formatDuration";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import Link from "next/link";
import { VideoQuality } from "@/models/video.model";
import Image from "next/image";

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
  const videoRef = useRef<HTMLVideoElement>(videoUrls[0].link);

  return (
    <div className="flex flex-col gap-2">
      <Link href={`/watch?v=${_id}`} className="relative aspect-video">
        <Image
          src={thumbnail}
          alt="thumbnail"
          className="block w-full h-full max-h-72 object-cover transition-[border-radius] duration-200 hover:rounded-xl"
          height={72}
          width={100}
        />
        <div className="absolute bottom-1 right-1 bg-secondary-dark text-secondary text-sm px-0.5 rounded">
          <h1>{formatDuration(duration)}</h1>
        </div>
      </Link>
      <div className="flex gap-2">
        <Link href={`/@${owner.username}`} className="flex-shrink-0">
          <Image
            className="flex-0 rounded-full"
            width={48}
            height={48}
            src={owner.avatar}
            alt={owner.username}
          />
        </Link>
        <div className="flex flex-col">
          <Link href={`/watch?v=${_id}`} className="font-bold">
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
