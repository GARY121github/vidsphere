import { NextRequest, NextResponse } from "next/server";
import mongoose, { isValidObjectId } from "mongoose";
import connectDB from "@/db/connectDB";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import SubscriptionModel from "@/models/subscription.model";
import UserModel from "@/models/user.model";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";

// ******************************************* //
// *********** TOGGLE SUBSCRIPTION *********** //
// ******************************************* //
export async function GET(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      {
        error: "You need to be logged in to subscribe to a channel",
      },
      { status: 401 }
    );
  }

  //user._id is a string, so we need to convert it to ObjectId for using aggregation pipeline
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const channelIdConverted = new mongoose.Types.ObjectId(params.channelId);
    console.log(userId, ":::", channelIdConverted);

    // validate the channel ID
    if (!isValidObjectId(channelIdConverted)) {
      throw new ApiError(400, "Invalid channel ID");
    }

    // check if the channel exists
    const channel = await UserModel.findById(channelIdConverted);

    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    //check if user is trying to subscribe to their own channel
    // converted to string as new objectId is not equal to the old one but their string values are equal
    if (channelIdConverted.toString() === userId.toString()) {
      throw new ApiError(400, "You cannot subscribe to your own channel");
    }

    // check if user is already subscribed to the channel
    const subscription = await SubscriptionModel.findOne({
      subscribedTo: channelIdConverted,
      subscriber: userId,
    });

    //toggle subscription
    if (subscription) {
      await SubscriptionModel.findByIdAndDelete(subscription._id);
      return NextResponse.json(
        new ApiResponse(200, "Unsubscribed from channel"),
        { status: 200 }
      );
    } else {
      await SubscriptionModel.create({
        subscribedTo: channelIdConverted,
        subscriber: userId,
      });
      return NextResponse.json(new ApiResponse(200, "Subscribed to channel"), {
        status: 200,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}

// ******************************************* //
// ************* GET SUBSCRIBERS ************* //
// ******************************************* //
export async function POST(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  await connectDB();

  // TODO: Is session check necessary? why?
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        error: "You need to be logged in to view subscribers",
      },
      { status: 401 }
    );
  }

  try {
    const channelIdConverted = new mongoose.Types.ObjectId(params.channelId);

    if (!isValidObjectId(channelIdConverted)) {
      throw new ApiError(400, "Invalid channel ID");
    }

    // check if the channel exists
    const channel = await UserModel.findById(channelIdConverted);
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    //get subscribers of channel
    const subscribers = await SubscriptionModel.aggregate([
      {
        $match: {
          subscribedTo: new mongoose.Types.ObjectId(channelIdConverted),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscriber",
        },
      },
      {
        $project: {
          _id: 0,
          subscriber: {
            _id: 1,
            username: 1,
            fullName: 1,
            email: 1,
            avatart: 1,
          },
        },
      },
    ]);

    return NextResponse.json(
      new ApiResponse(200, "Subscribers retrieved successfully", {
        subscribers,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
