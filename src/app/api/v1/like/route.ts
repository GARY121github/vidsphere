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
    const likedVideos = await LikeModel.aggregate([
      {
        $match: {
          likedBy: userId,
          likeType: "like",
          video: { $exists: true },
        },
      },
      {
        $lookup: {
          from: "videos", // Assuming "videos" is the collection name
          localField: "video",
          foreignField: "_id",
          as: "video",
        },
      },
      {
        $unwind: "$video",
      },
      {
        $lookup: {
          from: "users", // Assuming "users" is the collection name
          localField: "video.owner",
          foreignField: "_id",
          as: "video.owner",
        },
      },
      {
        $unwind: "$video.owner",
      },
      {
        $project: {
          "video.title": 1,
          "video.description": 1,
          "video.thumbnail": 1,
          "video._id": 1,
          "video.views": 1,
          "video.duration": 1,
          "video.owner.username": 1,
          "video.owner.fullName": 1,
          "video.owner.avatar": 1,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    const videos = likedVideos.map((video: any) => {
      return {
        _id: video.video._id,
        title: video.video.title,
        description: video.video.description,
        duration: video.video.duration,
        views: video.video.views,
        thumbnail: video.video.thumbnail,
        owner: {
          username: video.video.owner.username,
          fullName: video.video.owner.fullName,
          avatar: video.video.owner.avatar,
        },
      };
    });

    return NextResponse.json(
      new ApiResponse(200, "liked videos fetched successfully!", videos),
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
