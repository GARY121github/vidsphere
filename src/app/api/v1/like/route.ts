import { NextRequest, NextResponse } from "next/server";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import connectDB from "@/db/connectDB";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import mongoose from "mongoose";
import LikeModel from "@/models/like.model";

export async function GET(request: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(401, "Unauthorized");
  }
  const userId = new mongoose.Types.ObjectId(session?.user?._id);

  try {
    const likedVideos = await LikeModel.find({
      likedBy: userId,
      likeType: "like",
      video: {
        $exists: true,
      },
    })
      .populate({
        path: "video",
        select: "title description thumbnail",
        populate: {
          path: "owner",
          select: "username fullName",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(
      new ApiResponse(
        200,
        "liked videos fetched successfully!",
        likedVideos.map((like) => like.video)
      ),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(
        error.statusCode || 500,
        error.message || "Internal server error",
        {}
      ),
      {
        status: error.stutusCode || 500,
      }
    );
  }
}
