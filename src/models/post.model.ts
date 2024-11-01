import mongoose, { Types, Schema, Document } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface Post extends Document {
  content: string;
  image?: string;
  isPublic: boolean;
  owner: {
    type: Types.ObjectId;
    ref: "User";
  };
}

const postSchema = new Schema<Post>(
  {
    content: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String, // S3 URL (with cloudfront)
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add pagination plugin
postSchema.plugin(aggregatePaginate);

// Model creation
const PostModel =
  (mongoose.models.Post as mongoose.Model<Post>) ||
  mongoose.model<Post>("Post", postSchema);

export default PostModel;
