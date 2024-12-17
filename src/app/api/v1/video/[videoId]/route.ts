import VideoModel from "@/models/video.model";
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import { titleSchema, descriptionSchema } from "@/schemas/video.schema";
import mongoose from "mongoose";

// ******************************************* //
// *********** GET VIDEO DETAILS *********** //
// ******************************************* //

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

  const { user } = session;

  try {
    const { videoId } = params;

    if (!videoId) {
      throw new ApiError(400, "Invalid video id");
    }

    const video = await VideoModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(videoId),
          isPublished: true,
          status: "completed",
        },
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
        $lookup: {
          from: "subscriptions",
          localField: "owner._id", // The owner of the video
          foreignField: "subscribedTo", // Channel being subscribed to
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "likes", // Assuming your likes collection is named 'likes'
          localField: "_id", // Video _id
          foreignField: "video", // Refers to 'video' field in 'Like' schema
          as: "likes",
        },
      },
      {
        $addFields: {
          subscriberCount: { $size: "$subscribers" }, // Count the subscribers
          isSubscribed: {
            $in: [
              new mongoose.Types.ObjectId(user._id),
              "$subscribers.subscriber",
            ], // Check if the current user is subscribed
          },
          likeCount: {
            $size: "$likes", // Count total likes on the video
          },
          userLikeStatus: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$likes",
                  as: "like",
                  cond: {
                    $eq: [
                      "$$like.likedBy",
                      new mongoose.Types.ObjectId(user._id),
                    ],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $addFields: {
          hasLiked: {
            $cond: {
              if: { $eq: ["$userLikeStatus.likeType", "like"] },
              then: true,
              else: false,
            },
          },
          hasDisliked: {
            $cond: {
              if: { $eq: ["$userLikeStatus.likeType", "dislike"] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          thumbnail: 1,
          videoUrls: 1,
          createdAt: 1,
          views: 1,
          "owner.username": 1,
          "owner.fullName": 1,
          "owner.avatar": 1,
          "owner._id": 1,
          subscriberCount: 1,
          isSubscribed: 1,
          likeCount: 1, // Total likes on the video
          hasLiked: 1, // Whether the user has liked the video
          hasDisliked: 1, // Whether the user has disliked the video
        },
      },
    ]);

    if (!video[0]) {
      throw new ApiError(404, "Video not found");
    }

    // update the video views
    await VideoModel.updateOne(
      {
        _id: new mongoose.Types.ObjectId(videoId),
        isPublished: true,
        status: "completed",
      },
      { $inc: { views: 1 } }
    );

    return NextResponse.json(new ApiResponse(200, "Video found", video[0]));
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

// ******************************************* //
// *********** CHANGE VIDEOS META DATA ******* //
// ******************************************* //
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

// ******************************************* //
// *********** DELETE VIDEO *********** //
// ******************************************* //

export async function DELETE(
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
