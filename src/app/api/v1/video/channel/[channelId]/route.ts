import VideoModel from "@/models/video.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { videoSearchSchema } from "@/schemas/video.schema";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";

export async function GET(
  request: NextRequest,
  { params }: { params: { channelId: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  const { user } = session;

  if (!user || !user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  try {
    const videos = await VideoModel.find({
      owner: user._id,
    });

    return NextResponse.json(
      new ApiResponse(200, "Videos Fetched Successfully", {
        videos,
      })
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
