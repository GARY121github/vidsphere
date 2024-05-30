import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

interface Tweet extends Document {
  content: string;
  owner: Schema.Types.ObjectId;
}

const tweetSchema = new Schema<Tweet>(
  {
    content: {
      type: String,
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

tweetSchema.plugin(mongooseAggregatePaginate);

const TweetModel =
  (mongoose.models.Tweet as mongoose.Model<Tweet>) ||
  mongoose.model<Tweet>("Tweet", tweetSchema);

export default TweetModel;
