import bcryptjs from "bcryptjs";
import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import ApiError from "@/utils/ApiError";
import { NextRequest, NextResponse } from "next/server";
import ApiResponse from "@/utils/ApiResponse";
import ForgotPasswordEmail from "../../../../../../emails/forgot-password.email";
import { sendEmail } from "@/utils/SendEmail";
import { forgotPasswordSchema } from "@/schemas/forgotPassword.schema";

function generateForgotPasswordToken(userId: string): string {
  const forgotPasswordToken = bcryptjs.hashSync(userId, 10);
  return forgotPasswordToken;
}
export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const { email } = await request.json();

    //Validate request body
    const isValidData = forgotPasswordSchema.safeParse({ email });
    if (!isValidData.success) {
      const errorMessage: string = isValidData.error.errors
        .map((error: any) => `${error.path.join(".")} ${error.message}`)
        .join(". ");
      throw new ApiError(400, "Please provide valid data. " + errorMessage);
    }

    // Check if email exists in the database
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found with this email");
    }

    //Generate hashed token
    const forgotPasswordToken = generateForgotPasswordToken(
      user._id.toString()
    );
    const forgotPasswordTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); //10 minutes;

    user.forgotPasswordToken = forgotPasswordToken;
    user.forgotPasswordTokenExpiry = forgotPasswordTokenExpiry;

    //save user
    await user.save();

    //send email with forgotPasswordToken
    await sendEmail({
      email: user.email,
      emailType: "FORGOTPASSWORD",
      username: user.username,
      forgotPasswordToken,
    });

    return NextResponse.json(
      new ApiResponse(200, "We have sent you a reset password link"),
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
