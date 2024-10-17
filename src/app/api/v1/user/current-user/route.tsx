import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import ApiError from "@/utils/ApiError";
import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  try {
    const user = await UserModel.findById(session.user._id).select(
      "-password -refreshToken -watchHistory -googleId -forgotPasswordToken -forgotPasswordTokenExpiry -isVerified -verificationToken -verificationTokenExpiry -__v -_id"
    );

    return NextResponse.json(
      new ApiResponse(200, "Password Changed Successfully", user)
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(
        error.statusCode || 500,
        error.message || "Internal Server Error"
      ),
      { status: error.statusCode || 500 }
    );
  }
}
