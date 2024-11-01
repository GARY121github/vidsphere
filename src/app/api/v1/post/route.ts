import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
import connectDB from "@/db/connectDB";
import ApiError from "@/utils/ApiError";
import postSchema from "@/schemas/post.schema";
import PostModel from "@/models/post.model";
import ApiResponse from "@/utils/ApiResponse";
import getImageUrl from "@/utils/S3toCloudfront";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      new ApiResponse(
        401,

        "You need to be logged in to view subscribed channels"
      ),
      { status: 401 }
    );
  }
  try {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);
    const query = url.searchParams.get("query") || "";
    const sortBy = url.searchParams.get("sortBy") || "createdAt";
    const sortType = url.searchParams.get("sortType") || "desc";
    const channelId = url.searchParams.get("channelId") || "";
    const isStudio = url.searchParams.get("isStudio") || "No";

    let matchStage: any = {
      owner: new mongoose.Types.ObjectId(channelId),
    };

    if (
      channelId.toString() !== session.user._id?.toString() ||
      isStudio === "No"
    ) {
      matchStage.isPublic = true;
    }

    if (query) {
      matchStage.$or = [
        { content: { $regex: query, $options: "i" } }, // Case-insensitive search for content
      ];
    }

    const sortStage: any = {};
    sortStage[sortBy] = sortType === "desc" ? -1 : 1;

    const options = {
      page,
      limit,
      customLabels: {
        totalDocs: "totalItems",
        docs: "posts",
        limit: "pageSize",
        page: "currentPage",
        nextPage: "next",
        prevPage: "prev",
        totalPages: "totalPages",
        pagingCounter: "slNo",
        meta: "paginator",
      },
    };

    const aggregate = PostModel.aggregate([
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
      {
        $unwind: "$owner",
      },
      {
        $project: {
          content: 1,
          image: 1,
          createdAt: 1,
          isPublic: 1,
          "owner.username": 1,
          "owner.fullName": 1,
          "owner.avatar": 1,
          "owner._id": 1,
        },
      },
    ]);

    const result = await (PostModel as any).aggregatePaginate(
      aggregate,
      options
    );

    return NextResponse.json(
      new ApiResponse(200, "Post retrived successfully", result)
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  const { user } = session;

  try {
    const data = await request.json();

    const isValidData = postSchema.safeParse(data);

    if (!isValidData.success) {
      const errorMessage: string = isValidData.error.errors
        .map((error: any) => `${error.path.join(".")} ${error.message}`)
        .join(". ");
      throw new ApiError(400, "Please provide valid data. " + errorMessage);
    }

    await PostModel.create({
      content: isValidData.data.content,
      owner: user._id,
      image: data?.image && getImageUrl(data.image),
      isPublic: isValidData.data.isPublic ?? true,
    });

    return NextResponse.json(new ApiResponse(200, "Post Created Successfully"));
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
