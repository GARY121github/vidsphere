import React from "react";
import { Card, CardTitle } from "../ui/card";

interface VideoInfoCardProps {
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

const VideoInfoCard: React.FC<VideoInfoCardProps> = ({
  _id,
  title,
  description,
  thumbnail,
  owner,
}) => {
  return (
    <Card key={_id} className="flex gap-2 bg-transparent border-0 text-white">
      <div className="flex-shrink-0">
        <img
          src={thumbnail}
          alt={title}
          className="w-36 h-24 sm:w-72 sm:h-40 rounded-lg"
        />
      </div>
      <div className="p-1">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
          {owner.fullName} . views
        </p>
        <p className="text-xs mt-2">{description}</p>
      </div>
    </Card>
  );
};

export default VideoInfoCard;
