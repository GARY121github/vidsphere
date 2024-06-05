import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import verifyCodeSchema from "@/schemas/verifyCode.schema";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const { username, code } = await request.json();

    //Use decodeURIComponent as the username may contain special characters and URL will encode them to %20, %21, etc.
    const decodedUsername = decodeURIComponent(username);

    const isValidData = verifyCodeSchema.safeParse({
      username: decodedUsername,
      code,
    });

    if (!isValidData.success) {
      const errorMessage: string = isValidData.error.errors
        .map((error: any) => `${error.path.join(".")} ${error.message}`)
        .join(". ");
      throw new ApiError(400, "Please provide valid data. " + errorMessage);
    }

    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isCodeValid = user.verificationToken === code;
    //new Date(0) will return 1970-01-01T00:00:00.000Z, which means the code is expired
    const isCodeNotExpired =
      new Date(user.verificationTokenExpiry || 0) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      user.verificationToken = "";
      user.verificationTokenExpiry = undefined;
      await user.save();
      return NextResponse.json(
        new ApiResponse(200, "User verified successfully"),
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      throw new ApiError(400, "Verification code expired");
    } else {
      throw new ApiError(400, "Invalid verification code");
    }
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
