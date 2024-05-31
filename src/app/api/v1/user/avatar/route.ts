import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import config from "@/conf/config";
import { v4 as uuidv4 } from "uuid";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import s3 from "@/lib/s3";
import avatarSchema from "@/schemas/avatar.schema";

function getUniqueId() {
  return uuidv4();
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    return NextResponse.json(
      new ApiResponse(401, "You need to be authenticated to access this route"),
      { status: 401 }
    );
  }

  try {
    const uniqueId = getUniqueId();

    const putObjectCommand = new PutObjectCommand({
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: uniqueId,
      ContentType: "image/jpeg",
      Metadata: {
        userId: session.user._id.toString(),
        uniqueId: uniqueId,
      },
    });

    const signedUrl = await getSignedUrl(s3, putObjectCommand, {
      expiresIn: 60 * 5,
    });

    return NextResponse.json(
      new ApiResponse(200, "Signed URL generated successfully", {
        url: signedUrl,
      })
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
