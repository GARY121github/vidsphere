import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
interface Like extends Document {
  video: Schema.Types.ObjectId;
  comment: Schema.Types.ObjectId;
  tweet: Schema.Types.ObjectId;
  likeType: string;
  likedBy: Schema.Types.ObjectId;
}

const likeSchema = new Schema<Like>(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    likeType: {
      type: String,
      enum: ["like", "dislike"],
      required: true,
    },
    likedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

likeSchema.plugin(mongooseAggregatePaginate);

const LikeModel =
  (mongoose.models.Like as mongoose.Model<Like>) ||
  mongoose.model<Like>("Like", likeSchema);

export default LikeModel;
