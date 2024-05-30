import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import s3 from "@/lib/s3";
import config from "@/conf/config";
import { v4 as uuidv4 } from "uuid";

// generate unique file name
function getUniqueFileName() {
  return uuidv4();
}

// give the access of the put image at s3 bucket for limited amount of time
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    console.log("user is not authencated");
    throw new ApiError(401, "you are not authencated");
  }

  try {
    const params = {
      Bucket: config.AWS_S3_BUCKET_NAME,
      Key: getUniqueFileName(),
      Expires: 60 * 5, // 5 minutes
    };
    const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

    return NextResponse.json(
      new ApiResponse(200, "success", {
        url: uploadUrl,
      })
    );
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      new ApiResponse(
        error.statusCode || 500,
        error.message || "Internal Server Error"
      ),
      { status: error.statusCode || 500 }
    );
  }
}
