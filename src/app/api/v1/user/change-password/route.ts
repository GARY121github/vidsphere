import bcrypt from "bcryptjs";
import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import ApiError from "@/utils/ApiError";
import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "@/utils/ApiResponse";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import passwordSchema from "@/schemas/common/password.schema";

export async function PUT(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  try {
    const { oldPassword, newPassword } = await request.json();

    const isValidData = passwordSchema.safeParse(newPassword);

    if (!isValidData.success) {
      const errorMessage: string = isValidData.error.errors
        .map((error: any) => `${error.path.join(".")} ${error.message}`)
        .join(". ");
      throw new ApiError(400, "Please provide valid data. " + errorMessage);
    }

    const user = await UserModel.findById(session.user._id);

    console.log(user);

    if (!user) {
      throw new ApiError(401, "Invalid User");
    }

    const isValidOldPassword = await bcrypt.compare(oldPassword, user.password);

    if (!isValidOldPassword) {
      throw new ApiError(402, "Old Password Is Wrong");
    }

    if (oldPassword === newPassword) {
      throw new ApiError(302, "Old Password And New Password can not be same");
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json(
      new ApiResponse(200, "Password Changed Successfully")
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
