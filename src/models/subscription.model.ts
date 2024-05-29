import mongoose, { Schema, Document } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

export interface Subscription extends Document {
  subscriber: Schema.Types.ObjectId;
  subscribedTo: Schema.Types.ObjectId;
}

const subscriptionSchema = new Schema<Subscription>(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscribedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

subscriptionSchema.plugin(mongooseAggregatePaginate);

const SubscriptionModel =
  (mongoose.models.Subscription as mongoose.Model<Subscription>) ||
  mongoose.model<Subscription>("Subscription", subscriptionSchema);

export default SubscriptionModel;
