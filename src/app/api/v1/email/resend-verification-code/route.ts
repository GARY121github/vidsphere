import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import { userNameSchema } from "@/schemas/signUp.schema";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/utils/SendEmail";

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const body = await request.json();
    const { username } = body;
    const isValidUsername = userNameSchema.safeParse(username);
    if (isValidUsername.success === false) {
      const errorMessage: string = isValidUsername.error.errors
        .map((error: any) => `${error.path.join(".")} ${error.message}`)
        .join(". ");
      throw new ApiError(400, "Please provide valid username. " + errorMessage);
    }
    const user = await UserModel.findOne({ username });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400, "User is already verified");
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    user.verificationToken = verificationToken;
    user.verificationTokenExpiry = verificationTokenExpiry;

    await user.save();

    await sendEmail({
      email: user.email,
      emailType: "VERIFICATIONEMAIL",
      username,
      verificationCode: verificationToken,
    });

    return NextResponse.json(
      new ApiResponse(200, "Verification code sent successfully")
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
