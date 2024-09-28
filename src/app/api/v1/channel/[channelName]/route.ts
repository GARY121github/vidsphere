import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: { channelName: string } }
) {
  await connectDB();

  try {
    const { channelName } = params;
    const username = channelName.substring(1);

    if (!username.trim()) {
      throw new ApiError(501, "Invalid Channel Name");
    }

    const channelData = await UserModel.aggregate([
      {
        $match: {
          username: username, // Match the user by username
        },
      },
      {
        $lookup: {
          from: "subscriptions", // The collection name of SubscriptionModel
          localField: "_id", // The user's _id field
          foreignField: "subscribedTo", // The field in the Subscription model
          as: "subscribers", // Output field for the matched subscriptions
        },
      },
      {
        $project: {
          username: 1, // Keep the username
          fullName: 1,
          coverImage: 1,
          avatar: 1,
          subscribersCount: { $size: "$subscribers" }, // Count the number of subscribers
        },
      },
    ]);

    if (!channelData[0]) {
      throw new ApiError(404, "Channel Not Found");
    }

    return NextResponse.json(
      new ApiResponse(201, "Channel Fetched Successfully", channelData[0])
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
