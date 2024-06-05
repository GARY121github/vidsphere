import bcryptjs from "bcryptjs";
import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import ApiError from "@/utils/ApiError";
import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "@/utils/ApiResponse";

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const { token, password } = await request.json();

    // Check if token is valid
    if (!token) {
      throw new ApiError(400, "Please provide token");
    }

    // Check if password is valid
    if (!password) {
      throw new ApiError(400, "Please provide password");
    }

    // Check if token exists in the database
    const user = await UserModel.findOne({ forgotPasswordToken: token });
    if (!user) {
      throw new ApiError(404, "User not found with this token");
    }

    // Check if token is expired
    const isTokenNotExpired =
      new Date(user.forgotPasswordTokenExpiry || 0) > new Date();
    if (!isTokenNotExpired) {
      throw new ApiError(400, "Token expired");
    }

    //check if the password is the same as the old password
    const isSamePassword = await bcryptjs.compare(password, user.password);
    if (isSamePassword) {
      throw new ApiError(
        400,
        "Password cannot be the same as the old password"
      );
    }

    //modify the password
    user.password = password;
    user.forgotPasswordToken = "";
    user.forgotPasswordTokenExpiry = undefined;
    await user.save();

    return NextResponse.json(
      new ApiResponse(200, "Password changed successfully"),
      { status: 200 }
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
