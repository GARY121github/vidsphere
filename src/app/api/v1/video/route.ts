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
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const query = url.searchParams.get("query") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortType = url.searchParams.get("sortType") || "desc";
    const userId = url.searchParams.get("userId") || "";

    const isValidData = videoSearchSchema.safeParse({
      page,
      limit,
      query,
      sortBy,
      sortType,
      userId,
    });

    if (!isValidData.success) {
      const errorMessage: string = isValidData.error.errors
        .map((error: any) => `${error.path.join(".")} ${error.message}`)
        .join(". ");
      throw new ApiError(400, "Please provide valid data. " + errorMessage);
    }

    let matchStage: any = {
      isPublished: true,
      status: "completed",
    };

    if (query) {
      matchStage.$or = [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search for title
        { description: { $regex: query, $options: "i" } }, // Case-insensitive search for description
      ];
    }

    if (userId) {
      matchStage.owner = new mongoose.Types.ObjectId(userId);
    }

    const sortStage: any = {};
    sortStage[sortBy] = sortType === "desc" ? -1 : 1;

    const options = {
      page,
      limit,
      customLabels: {
        totalDocs: "totalItems",
        docs: "videos",
        limit: "pageSize",
        page: "currentPage",
        nextPage: "next",
        prevPage: "prev",
        totalPages: "totalPages",
        pagingCounter: "slNo",
        meta: "paginator",
      },
    };

    const aggregate = VideoModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $sort: sortStage,
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      { $unwind: "$owner" },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          videoUrls: 1,
          createdAt: 1,
          "owner.username": 1,
          "owner.fullName": 1,
          "owner.avatar": 1,
          "owner._id": 1,
        },
      },
    ]);

    const result = await (VideoModel as any).aggregatePaginate(
      aggregate,
      options
    );

    return NextResponse.json(
      new ApiResponse(200, "Videos retrieved successfully", result)
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
