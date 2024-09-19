import VideoModel from "@/models/video.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { videoSearchSchema } from "@/schemas/video.schema";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  await connectDB();
  try {
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
