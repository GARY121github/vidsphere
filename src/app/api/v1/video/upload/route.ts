import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import config from "@/conf/config";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import s3 from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import VideoModel from "@/models/video.model";
import mongoose from "mongoose";
import connectDB from "@/db/connectDB";

function getUniqueId() {
  return new mongoose.Types.ObjectId().toHexString();
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  const { user } = session;
  try {
    const uniqueId = getUniqueId();

    const command = new PutObjectCommand({
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: `temp/${user._id}/video/${uniqueId}`,
      ContentType: "video/*",
    });

    // temp/ueserID/video/uniqueID
    // ************* after uploading the video *************
    // videsphere/userID/video/uniqueID/480.mp4
    // videsphere/userID/video/uniqueID/720.mp4
    // videsphere/userID/video/uniqueID/1080.mp4
    const preSignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 60 * 5,
    });

    return NextResponse.json(
      new ApiResponse(200, "Signed URL generated successfully", {
        url: preSignedUrl,
        videoLocation: uniqueId,
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

export async function POST(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  const { user } = session;
  try {
    const { uniqueID, title, description, thumbnailUrl } = await request.json();

    const baseUrl = `${config.AWS_CLOUDFRONT_URL}/vidsphere/${user._id}/video/${uniqueID}`;

    await VideoModel.create({
      _id: new mongoose.Types.ObjectId(uniqueID),
      title,
      description,
      thumbnailUrl,
      user: user._id,
      videoUrls: [
        {
          link: `${baseUrl}/360p.mp4`,
          quality: "360p",
        },
        {
          link: `${baseUrl}/480p.mp4`,
          quality: "480p",
        },
        {
          link: `${baseUrl}/720p.mp4`,
          quality: "720p",
        },
        {
          link: `${baseUrl}/1080p.mp4`,
          quality: "1080p",
        },
      ],
    });

    // temp/ueserID/video/uniqueID
    // videsphere/userID/video/uniqueID/480.mp4
    // videsphere/userID/video/uniqueID/720.mp4
    // videsphere/userID/video/uniqueID/1080.mp4

    return NextResponse.json(new ApiResponse(200, "Video Created", {}));
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await connectDB();
  try {
    const { videoId, status } = await request.json();

    console.log(videoId, status);

    if (!videoId || !status) {
      throw new ApiError(400, "Invalid request body");
    }

    if (!["uploading", "transcoding", "completed"].includes(status)) {
      throw new ApiError(400, "Invalid status");
    }

    const updatedVideo = await VideoModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(videoId),
      { status },
      { new: true }
    );

    if (!updatedVideo) {
      throw new ApiError(404, "Video not found");
    }

    return NextResponse.json(
      new ApiResponse(200, "Video status updated successfully", updatedVideo)
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}