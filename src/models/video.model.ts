import mongoose, { Document, Schema, Types } from "mongoose";

interface VideoQuality {
  link: string;
  quality: string;
}

export interface Video extends Document {
  _id: string;
  title: string;
  description: string;
  videoUrls: Array<VideoQuality>;
  thumbnailUrl: string;
  user: {
    type: Types.ObjectId;
    ref: "User";
  };
  status: string; // Add the status field
}

const videoSchema = new Schema<Video>(
  {
    _id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    videoUrls: [
      {
        link: {
          type: String,
          required: true,
        },
        quality: {
          type: String,
          required: true,
        },
        _id: false,
      },
    ],
    thumbnailUrl: {
      type: String,
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["uploading", "transcoding", "completed"],
      default: "uploading",
    },
  },
  { timestamps: true }
);

const VideoModel =
  (mongoose.models.Video as mongoose.Model<Video>) ||
  mongoose.model<Video>("Video", videoSchema);

export default VideoModel;
