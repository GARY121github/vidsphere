import VideoModel from "@/models/video.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import UserModel from "@/models/user.model";

export async function GET(
  request: NextRequest,
  { params }: { params: { channelName: string } }
) {
  await connectDB();
  try {
    const { channelName } = params;
    const username = channelName.substring(1);
    console.log(username);
    if (!username.trim()) {
      throw new ApiError(501, "Invalid Channel Name");
    }

    const channel = await UserModel.find({
      username,
    }).select(
      "-forgotPasswordToken -watchHistory -verificationToken -isVerified -password -googleId -updatedAt -__v"
    );

    if (!channel) {
      throw new ApiError(404, "Channel Not Found");
    }

    return NextResponse.json(
      new ApiResponse(201, "Channel Fetched Successfully", channel)
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
