import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import VideoModel from "@/models/video.model";
import connectDB from "@/db/connectDB";
import getImageUrl from "@/utils/S3toCloudfront";

// ******************************************* //
// *********** CHANGE VIDEOS THUMBNAIL *********** //
// ******************************************* //

export async function PUT(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  try {
    const { videoId } = params;
    const data = await request.json();
    const { thumbnail } = data;

    if (!thumbnail.trim()) {
      throw new ApiError(
        400,
        "Please provide valid data. Thumbnail is required"
      );
    }

    const url = getImageUrl(thumbnail);

    console.log("URL -> ", url);

    const video = await VideoModel.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== session.user._id) {
      throw new ApiError(403, "You are not authorized to update this video");
    }

    await VideoModel.findByIdAndUpdate(
      videoId,
      { thumbnail: url },
      { new: true }
    );

    return NextResponse.json(
      new ApiResponse(200, "Thumbnail updated successfully")
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
