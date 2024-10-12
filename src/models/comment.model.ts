import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface Comment extends Document {
  content: string;
  video: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;
}

const commentSchema = new Schema<Comment>(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

const CommentModel =
  (mongoose.models.Comment as mongoose.Model<Comment>) ||
  mongoose.model<Comment>("Comment", commentSchema);

export default CommentModel;
