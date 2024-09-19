import mongoose, { Document, Schema, Types } from "mongoose";

export interface PlayList extends Document {
  title: string;
  description: string;
  isPublished: boolean;
  thumbnail: string;
  videos: Array<{
    type: Types.ObjectId;
    ref: "Video";
  }>;
  owner: {
    type: Types.ObjectId;
    ref: "User";
  };
}

const playListSchema = new Schema<PlayList>(
  {
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
    thumbnail: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const PlayListSchema =
  (mongoose.models.Video as mongoose.Model<PlayList>) ||
  mongoose.model<PlayList>("PlayList", playListSchema);

export default PlayListSchema;
