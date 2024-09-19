import VideoModel from "@/models/video.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { titleSchema, descriptionSchema } from "@/schemas/video.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
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
    const { videoId } = params;

    console.log(videoId);

    if (!videoId) {
      throw new ApiError(400, "Invalid video id");
    }

    const video = await VideoModel.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    return NextResponse.json(new ApiResponse(200, "Video found", video));
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        new ApiResponse(error.statusCode, error.message),
        { status: error.statusCode }
      );
    }
    return NextResponse.json(new ApiResponse(500, "Internal server error"), {
      status: 500,
    });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
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
    const { videoId } = params;
    const body = await request.json();
    const { title, description } = body;

    if (!videoId) {
      throw new ApiError(400, "Invalid request body");
    }

    const isValidTitle = titleSchema.safeParse(title);
    if (!isValidTitle.success) {
      throw new ApiError(400, isValidTitle.error.errors[0].message);
    }

    const isValidDescription = descriptionSchema.safeParse(description);
    if (!isValidDescription.success) {
      throw new ApiError(400, isValidDescription.error.errors[0].message);
    }

    const video = await VideoModel.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== session.user._id) {
      throw new ApiError(403, "You are not authorized to update this video");
    }

    const updatedVideo = await VideoModel.findByIdAndUpdate(
      videoId,
      { title, description },
      { new: true }
    );

    if (!updatedVideo) {
      throw new ApiError(404, "Video not found");
    }

    return NextResponse.json(
      new ApiResponse(200, "Video updated successfully"),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        new ApiResponse(error.statusCode, error.message),
        { status: error.statusCode }
      );
    }
    return NextResponse.json(new ApiResponse(500, "Internal server error"), {
      status: 500,
    });
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { videoId: string } }
) {
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
    const { videoId } = params;

    if (!videoId) {
      throw new ApiError(400, "Invalid video id");
    }

    const video = await VideoModel.findById(videoId);

    if (!video) {
      throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() != session.user._id) {
      throw new ApiError(403, "You are not authorized to delete this video");
    }

    await VideoModel.findByIdAndDelete(videoId);

    return NextResponse.json(
      new ApiResponse(200, "Video deleted successfully"),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      return NextResponse.json(
        new ApiResponse(error.statusCode, error.message),
        { status: error.statusCode }
      );
    }
    return NextResponse.json(new ApiResponse(500, "Internal server error"), {
      status: 500,
    });
  }
}
