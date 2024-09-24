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
import {
  titleSchema,
  descriptionSchema,
  statusSchema,
} from "@/schemas/video.schema";
import getImageUrl from "@/utils/S3toCloudfront";

function getUniqueId() {
  return new mongoose.Types.ObjectId().toHexString();
}

// ************************************************************* //
// *********** GET VIDEOS PRESIGEND URL WITH IT'S ID *********** //
// ************************************************************* //

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

// ******************************************* //
// *********** CREATE VIDEO ****************** //
// ******************************************* //

export async function POST(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  const { user } = session;
  try {
    const { uniqueID, title, description, thumbnail } = await request.json();

    if (!uniqueID) {
      throw new ApiError(400, "Invalid request");
    }

    const isValidTitle = titleSchema.safeParse(title);
    if (!isValidTitle.success) {
      throw new ApiError(400, isValidTitle.error.errors[0].message);
    }

    const isValidDescription = descriptionSchema.safeParse(description);
    if (!isValidDescription.success) {
      throw new ApiError(400, isValidDescription.error.errors[0].message);
    }
    4;

    const baseUrl = `${config.AWS_CLOUDFRONT_URL}/vidsphere/${user._id}/video/${uniqueID}`;

    await VideoModel.create({
      _id: new mongoose.Types.ObjectId(uniqueID),
      title,
      description,
      thumbnail: getImageUrl(thumbnail),
      owner: user._id,
      videoUrls: [
        {
          link: `${baseUrl}/360p/index.m3u8`,
          quality: "360p",
        },
        {
          link: `${baseUrl}/480p/index.m3u8`,
          quality: "480p",
        },
        {
          link: `${baseUrl}/720p/index.m3u8`,
          quality: "720p",
        },
        {
          link: `${baseUrl}/1080p/index.m3u8`,
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

// ******************************************** //
// *********** CHANGE VIDEOS STATUS *********** //
// ******************************************** //

export async function PATCH(request: NextRequest) {
  await connectDB();
  try {
    const { videoId, status } = await request.json();

    if (!videoId) {
      throw new ApiError(400, "Invalid request body");
    }

    const isValidStatus = statusSchema.safeParse(status);

    if (!isValidStatus.success) {
      throw new ApiError(301, "Invalid Status");
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
