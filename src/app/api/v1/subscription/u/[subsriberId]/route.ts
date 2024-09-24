import { NextRequest, NextResponse } from "next/server";
import SubscriptionModel from "@/models/subscription.model";
import mongoose, { isValidObjectId } from "mongoose";
import connectDB from "@/db/connectDB";
import ApiError from "@/utils/ApiError";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import ApiResponse from "@/utils/ApiResponse";
import UserModel from "@/models/user.model";

// ******************************************* //
// ********* GET SUBSCRIBED CHANNELS ********* //
// ******************************************* //
export async function GET(
  request: NextRequest,
  { params }: { params: { subscriberId: string } }
) {
  await connectDB();

  //TODO: Is session check necessary? why?
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      new ApiResponse(
        401,
        "You need to be logged in to view subscribed channels"
      ),
      { status: 401 }
    );
  }

  try {
    const subscriberIdConverted = new mongoose.Types.ObjectId(
      params.subscriberId
    );

    if (!isValidObjectId(subscriberIdConverted)) {
      throw new ApiError(400, "Invalid subscriber ID");
    }

    // check if the subscriber exists
    const subscriber = await UserModel.findById(subscriberIdConverted);
    if (!subscriber) {
      throw new ApiError(404, "Subscriber not found");
    }

    // fetch subscribed channels
    const channels = await SubscriptionModel.aggregate([
      {
        $match: {
          subscriber: new mongoose.Types.ObjectId(subscriberIdConverted),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channel",
        },
      },
      {
        $project: {
          _id: 0,
          channel: {
            _id: 1,
            username: 1,
            fullName: 1,
            email: 1,
            avatar: 1,
          },
        },
      },
    ]);

    return NextResponse.json(
      new ApiResponse(200, "Subscribed channels fetched successfully", {
        channels,
      })
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
