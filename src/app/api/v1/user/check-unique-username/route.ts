import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import UserModel from "@/models/user.model";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { userNameSchema } from "@/schemas/signUp.schema";

export async function POST(request: NextRequest) {
  await connectDB();
  try {
    const body = await request.json();
    const { username } = body;

    const isValidData = userNameSchema.safeParse(username);

    if (isValidData.success === false) {
      const errorMessage: string = isValidData.error.errors
        .map((error: any) => `${error.path.join(".")} ${error.message}`)
        .join(". ");
      throw new ApiError(400, "Please provide valid data. " + errorMessage);
    }

    const user = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (user) {
      throw new ApiError(400, "Username already exists");
    }

    return NextResponse.json(new ApiResponse(200, "Username is avaliable"), {
      status: 200,
    });
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
