import mongoose, { Document, Schema, Types } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
export interface VideoQuality {
  link: string;
  quality: string;
}

export interface Video extends Document {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  videoUrls: Array<VideoQuality>;
  thumbnailUrl: string;
  owner: {
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
    thumbnailUrl: {
      type: String,
      required: true,
    },
    owner: {
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

videoSchema.plugin(aggregatePaginate);

const VideoModel =
  (mongoose.models.Video as mongoose.Model<Video>) ||
  mongoose.model<Video>("Video", videoSchema);

export default VideoModel;
