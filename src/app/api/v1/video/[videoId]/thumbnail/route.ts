import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import config from "@/conf/config";
import { v4 as uuidv4 } from "uuid";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import s3 from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import VideoModel from "@/models/video.model";
import connectDB from "@/db/connectDB";
import getImageUrl from "@/utils/S3toCloudfront";

function getUniqueId() {
  return uuidv4();
}

// ******************************************* //
// **** GET VIDEOS THUMBNAIL PRESIGNED URL ****//
// ******************************************* //

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  const { user } = session;
  try {
    const { videoId } = params;
    const uniqueId = getUniqueId();

    const video = await VideoModel.findById(videoId);
    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== session.user._id) {
      throw new ApiError(
        403,
        "You are not authorized to update thumbnail of this video"
      );
    }

    const command = new PutObjectCommand({
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: `vidsphere/${user._id}/video/${videoId}/thumbnail/${uniqueId}`,
      ContentType: "image/*",
    });

    const preSignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5,
    });

    return NextResponse.json(
      new ApiResponse(200, "Signed URL generated successfully", {
        url: preSignedUrl,
      })
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}

// ******************************************* //
// *********** CHANGE VIDEOS THUMBNAIL ********//
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
