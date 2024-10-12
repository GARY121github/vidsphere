import { NextRequest, NextResponse } from "next/server";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";
import connectDB from "@/db/connectDB";
import { getServerSession } from "next-auth";
import CommentModel from "@/models/comment.model";
import authOptions from "../../auth/[...nextauth]/options";

// ******************************************* //
// ********** GET VIDEO COMMENTS ************* //
// ******************************************* //
export async function GET(request: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?._id;

  try {
    const url = new URL(request.url);
    const videoId = url.searchParams.get("videoId") || "";
    const page = url.searchParams.get("page") || "1";

    const videoIdConverted = new mongoose.Types.ObjectId(videoId);
    if (!isValidObjectId(videoIdConverted)) {
      throw new ApiError(400, "Invalid video Id");
    }

    const comments = await CommentModel.aggregate([
      {
        $match: {
          video: videoIdConverted,
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
      {
        $skip: 10 * (parseInt(page) - 1),
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner",
      },
      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          updatedAt: 1,
          owner: {
            _id: 1,
            username: 1,
            avatar: 1,
            fullName: 1,
          },
        },
      },
    ]);

    return NextResponse.json(
      new ApiResponse(200, "fetched all comments successfully", comments),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}

// ******************************************* //
// ********** POST VIDEO COMMENTS ************ //
// ******************************************* //
export async function POST(request: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?._id;

  if (!userId) {
    return NextResponse.json(new ApiResponse(401, "Unauthorized"), {
      status: 401,
    });
  }

  try {
    const url = new URL(request.url);
    const videoId = url.searchParams.get("videoId") || "";
    const { commentText } = await request.json();

    const videoIdConverted = new mongoose.Types.ObjectId(videoId);
    if (!isValidObjectId(videoIdConverted)) {
      throw new ApiError(400, "Invalid video ID");
    }

    const comment = new CommentModel({
      owner: userId,
      video: videoIdConverted,
      content: commentText,
    });

    await comment.save();

    return NextResponse.json(
      new ApiResponse(201, "Comment posted successfully", comment),
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
