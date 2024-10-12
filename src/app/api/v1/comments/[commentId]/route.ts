import { NextRequest, NextResponse } from "next/server";
import ApiError from "@/utils/ApiError";
import ApiResponse from "@/utils/ApiResponse";
import mongoose, { isValidObjectId } from "mongoose";
import connectDB from "@/db/connectDB";
import { getServerSession } from "next-auth";
import CommentModel from "@/models/comment.model";
import authOptions from "../../../auth/[...nextauth]/options";

// ******************************************* //
// ********** DELETE VIDEO COMMENT ********** //
// ******************************************* //
export async function DELETE(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?._id;

  if (!userId) {
    return NextResponse.json(new ApiResponse(401, "Unauthorized"), {
      status: 401,
    });
  }

  try {
    const commentId = params.commentId;

    const commentIdConverted = new mongoose.Types.ObjectId(commentId);
    if (!isValidObjectId(commentIdConverted)) {
      throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await CommentModel.findById(commentIdConverted);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== userId) {
      throw new ApiError(403, "You are not authorized to delete this comment");
    }

    await comment.deleteOne();

    return NextResponse.json(
      new ApiResponse(200, "Comment deleted successfully"),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}

// ******************************************* //
// ********** UPDATE VIDEO COMMENT ********** //
// ******************************************* //
export async function PATCH(
  request: NextRequest,
  { params }: { params: { commentId: string } }
) {
  await connectDB();

  const session = await getServerSession(authOptions);
  const userId = session?.user?._id;

  if (!userId) {
    return NextResponse.json(new ApiResponse(401, "Unauthorized"), {
      status: 401,
    });
  }

  try {
    const commentId = params.commentId;
    const { commentText } = await request.json();

    const commentIdConverted = new mongoose.Types.ObjectId(commentId);
    if (!isValidObjectId(commentIdConverted)) {
      throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await CommentModel.findById(commentIdConverted);
    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    if (comment.owner.toString() !== userId) {
      throw new ApiError(403, "You are not authorized to update this comment");
    }

    comment.content = commentText;
    await comment.save();

    return NextResponse.json(
      new ApiResponse(200, "Comment updated successfully", comment),
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      new ApiResponse(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
