import { NextRequest, NextResponse } from "next/server";
import UserModel from "@/models/user.model";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";
import connectDB from "@/db/connectDB";
import { sendVerificationEmail } from "@/utils/SendVerificationEmail";
import signUpSchema from "@/schemas/signUp.schema";

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const data = await request.json(); // Parse the JSON body

    const isValidData = signUpSchema.safeParse(data);

    if (!isValidData.success) {
      const errorMessage: string = isValidData.error.errors
        .map((error) => `${error.path.join(".")} ${error.message}`)
        .join(". ");
      throw new ApiError(400, "Please provide valid data. " + errorMessage);
    }

    const { username, email, password, fullName } = isValidData.data;

    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const verificationTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    if (existingUser) {
      if (existingUser.isVerified) {
        throw new ApiError(
          400,
          "User already exists with this username or email"
        );
      } else {
        existingUser.verificationToken = verificationToken;
        existingUser.verificationTokenExpiry = verificationTokenExpiry;
        await existingUser.save();
        await sendVerificationEmail({
          email,
          username,
          verifyCode: verificationToken,
        });
      }
    } else {
      const newUser = new UserModel({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
        fullName: fullName.toLowerCase(),
        verificationToken,
        verificationTokenExpiry,
      });
      await newUser.save();
      await sendVerificationEmail({
        email,
        username,
        verifyCode: verificationToken,
      });
    }

    return NextResponse.json(
      new ApiResponse(200, "Verification email sent successfully")
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
