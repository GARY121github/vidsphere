import { NextRequest, NextResponse } from "next/server";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";
import VideoModel from "@/models/video.model";
import LikeModel from "@/models/like.model";
import connectDB from "@/db/connectDB";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
import CommentModel from "@/models/comment.model";
import TweetModel from "@/models/tweet.model";

// ENTITY : VIDEO, COMMENT, TWEET//
// ENTITY ID : VIDEO ID, COMMENT ID, TWEET ID //
// LIKE TYPE : LIKE, DISLIKE //

async function checkEntityExistence(
  EntityId: mongoose.Types.ObjectId,
  EntityType: string
): Promise<boolean> {
  switch (EntityType) {
    case "video":
      const video = await VideoModel.findById(EntityId);
      if (!video) {
        return false;
      }
      return true;
    case "comment":
      const comment = await CommentModel.findById(EntityId);
      if (!comment) {
        return false;
      }
      return true;
    case "tweet":
      const tweet = await TweetModel.findById(EntityId);
      if (!tweet) {
        return false;
      }
      return true;
    default:
      throw new ApiError(400, "Invalid entity type");
  }
}

// ******************************************* //
// ******** GET LIKES AND DISLIKES *********** //
// ******************************************* //
export async function GET(request: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const userId = new mongoose.Types.ObjectId(session?.user?._id);

  try {
    const url = new URL(request.url);
    const EntityId = url.searchParams.get("entityId") || "";
    const EntityType = url.searchParams.get("entityType") || "";
    const EntityIdConverted = new mongoose.Types.ObjectId(EntityId);

    if (!isValidObjectId(EntityIdConverted)) {
      throw new ApiError(400, "Invalid video Id");
    }

    const EntityExists = await checkEntityExistence(
      EntityIdConverted,
      EntityType
    );

    if (!EntityExists) {
      throw new ApiError(404, `${EntityType} not found`);
    }

    const response = await LikeModel.aggregate([
      {
        $match: {
          [EntityType]: EntityIdConverted,
        },
      },
      {
        $group: {
          _id: null,
          likeCount: {
            $sum: {
              $cond: {
                if: { $eq: ["$likeType", "like"] },
                then: 1,
                else: 0,
              },
            },
          },
          dislikeCount: {
            $sum: {
              $cond: {
                if: { $eq: ["$likeType", "dislike"] },
                then: 1,
                else: 0,
              },
            },
          },
          isLikedByCurrentUser: {
            $first: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$likedBy", userId] },
                    { $eq: ["$likeType", "like"] },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
          isDislikedByCurrentUser: {
            $first: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$likedBy", userId] },
                    { $eq: ["$likeType", "dislike"] },
                  ],
                },
                then: true,
                else: false,
              },
            },
          },
        },
      },
    ]);

    return NextResponse.json(
      new ApiResponse(200, "likes and dislikes retrieved successfully", {
        likeCount: response[0].likeCount,
        dislikeCount: response[0].dislikeCount,
        isLikedByCurrentUser: response[0].isLikedByCurrentUser,
        isDislikedByCurrentUser: response[0].isDislikedByCurrentUser,
      }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}

// ******************************************* //
// *********** POST LIKE/DISLIKE ************* //
// ******************************************* //
export async function POST(request: NextRequest) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?._id;

  if (!userId) {
    return NextResponse.json(new ApiResponse(401, "Unauthorized"), {
      status: 401,
    });
  }

  try {
    const url = new URL(request.url);
    const EntityId = url.searchParams.get("entityId") || "";
    const EntityType = url.searchParams.get("entityType") || "";
    const likeType = url.searchParams.get("likeType") || "";

    const EntityIdConverted = new mongoose.Types.ObjectId(EntityId);

    if (!isValidObjectId(EntityIdConverted)) {
      throw new ApiError(400, `Invalid ${EntityType} ID`);
    }

    const EntityExists = await checkEntityExistence(
      EntityIdConverted,
      EntityType
    );

    if (!EntityExists) {
      throw new ApiError(404, `${EntityType} not found`);
    }

    const like = await LikeModel.findOne({
      [EntityType]: EntityIdConverted,
      likedBy: userId,
    });

    if (like) {
      if (like.likeType === likeType) {
        await like.deleteOne();
      } else {
        like.likeType = likeType;
        await like.save();
      }
    } else {
      await LikeModel.create({
        [EntityType]: EntityIdConverted,
        likeType: likeType.toString(),
        likedBy: userId,
      });
    }

    return NextResponse.json(
      new ApiResponse(200, `Toggled ${EntityType} ${likeType} successfully`),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
