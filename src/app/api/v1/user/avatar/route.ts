import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import s3 from "@/lib/s3";
import config from "@/conf/config";
import { v4 as uuidv4 } from "uuid";

const v4options = {
  random: [
    0x10, 0x91, 0x56, 0xbe, 0xc4, 0xfb, 0xc1, 0xea, 0x71, 0xb4, 0xef, 0xe1,
    0x67, 0x1c, 0x58, 0x36,
  ],
};

// generate unique file name
function getUniqueFileName() {
  return uuidv4(v4options);
}

// give the access of the put image at s3 bucket for limited amount of time
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new ApiError(401, "you are not authencated");
  }

  try {
    const params: PutObjectRequest = {
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: getUniqueFileName(),
      Expires: new Date(Date.now() + 3600),
    };
    const uploadUrl = s3.getSignedUrlPromise("putObject", params);

    return NextResponse.json(
      new ApiResponse(200, "success", {
        url: uploadUrl,
      })
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(
        error.statusCode || 500,
        error.message || "Internal Server Error"
      ),
      { status: error.statusCode || 500 }
    );
  }
}
