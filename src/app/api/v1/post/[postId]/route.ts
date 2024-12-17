import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/db/connectDB";
import ApiError from "@/utils/ApiError";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/options";
import postSchema from "@/schemas/post.schema";
import PostModel from "@/models/post.model";
import ApiResponse from "@/utils/ApiResponse";

export async function PUT(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  const { user } = session;
  try {
    const { postId } = params;
    const data = await request.json();

    const isValidData = postSchema.safeParse(data);

    if (!isValidData.success) {
      const errorMessage: string = isValidData.error.errors
        .map((error: any) => `${error.path.join(".")} ${error.message}`)
        .join(". ");
      throw new ApiError(400, "Please provide valid data. " + errorMessage);
    }

    const post = await PostModel.findById(postId);

    if (!post) {
      throw new ApiError(402, "Post not found");
    }

    if (post.owner.toString() !== user._id?.toString()) {
      throw new ApiError(401, "You are not the owner of this post");
    }

    post.content = isValidData.data.content;
    post.isPublic = isValidData.data.isPublic ?? post.isPublic;

    if (data?.image) {
      post.image = data.image;
    }

    await post.save();

    return NextResponse.json(new ApiResponse(201, "Post updated successfully"));
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    throw new ApiError(402, "unauthorised user");
  }

  const { user } = session;
  try {
    const { postId } = params;

    console.log(postId);
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new ApiError(401, "Post not found");
    }

    if (post.owner.toString() !== user._id) {
      throw new ApiError(402, "You are not the owner of this post");
    }

    await PostModel.findByIdAndDelete(postId);

    return NextResponse.json(new ApiResponse(201, "Post deleted successfully"));
  } catch (error: any) {
    return NextResponse.json(
      new ApiError(error.statusCode || 500, error.message),
      { status: error.statusCode || 500 }
    );
  }
}
