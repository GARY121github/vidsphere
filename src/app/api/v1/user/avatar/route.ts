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
import UserModel from "@/models/user.model";
import avatarSchema from "@/schemas/avatar.schema";

function getUniqueId() {
  return uuidv4();
}

function getImageUrl(url: string) {
  const baseUrl = url.split("?")[0];
  const newPath = baseUrl.split("/").slice(3).join("/");
  return `${config.AWS_CLOUDFRONT_URL}/${newPath}`;
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
      Key: `vidsphere/${user._id}/${uniqueId}`,
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

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  try {
    const data = await request.json();
    const { avatar } = data;

    const isValidData = avatarSchema.safeParse({ avatar });

    if (!isValidData.success) {
      const errorMessage: string = isValidData.error.errors
        .map((error: any) => `${error.path.join(".")} ${error.message}`)
        .join(". ");
      throw new ApiError(400, "Please provide valid data. " + errorMessage);
    }

    const url = getImageUrl(avatar);

    const updatedAvatarUser = await UserModel.updateOne(
      {
        _id: session.user._id,
      },
      {
        avatar: url,
      }
    );

    if (updatedAvatarUser.modifiedCount === 0) {
      throw new ApiError(400, "Avatar not updated");
    }

    return NextResponse.json(
      new ApiResponse(200, "Avatar updated successfully")
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
