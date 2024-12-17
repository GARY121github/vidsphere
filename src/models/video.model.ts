import mongoose, { Document, Schema, Types } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

// Interface for video quality
export interface VideoQuality {
  link: string;
  quality: string;
}

// Interface for Video document
export interface Video extends Document {
  _id: Types.ObjectId; // Change to ObjectId
  title: string;
  description: string;
  isPublished: boolean;
  videoUrls: Array<VideoQuality>;
  thumbnail: string;
  owner: Types.ObjectId; // Ensure owner is also ObjectId
  status: string;
  views: number;
  duration: number;
}

// Define schema for Video
const videoSchema = new Schema<Video>(
  {
    _id: {
      type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
    },
    description: {
      type: String,
      default: "Untitled",
    },
    isPublished: {
      type: Boolean,
      default: false,
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
    thumbnail: {
      type: String,
      default: "https://images.unsplash.com/photo-1676594904038-94b67e213297",
    },
    owner: {
      type: Schema.Types.ObjectId, // Use Schema.Types.ObjectId
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["uploading", "transcoding", "completed"],
      default: "uploading",
    },
    views: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add pagination plugin
videoSchema.plugin(aggregatePaginate);

// Model creation
const VideoModel =
  (mongoose.models.Video as mongoose.Model<Video>) ||
  mongoose.model<Video>("Video", videoSchema);

export default VideoModel;
