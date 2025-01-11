"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { useState, useEffect, useCallback } from "react";
import {
  EllipsisVertical,
  Loader2,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  PencilLine,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { useInView } from "react-intersection-observer";
import { Button } from "../ui/button";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Dialog from "../dialog/dialog";
import Modal from "../modals/modal";
import EditPostForm from "../forms/edit-post-form";
import { useToast } from "../ui/use-toast";
import ApiError from "@/utils/ApiError";
import Image from "next/image";
import ApiResponse from "@/utils/ApiResponse";
import { useSearchParams } from "next/navigation";
import { Separator } from "../ui/separator";

export interface PostData {
  _id: string;
  content: string;
  image?: string;
  isPublic: string;
  createdAt: string;
  owner: {
    username: string;
    fullName: string;
    avatar: string;
  };
}

interface InfinitePostScrollProps {
  initialPosts: PostData[];
  channelId: string;
  studio?: boolean;
  hasMorePost: boolean;
}

enum LikeType {
  like = "like",
  dislike = "dislike",
  none = "none",
}

interface Like {
  likeCount: number;
  liked: LikeType;
}

export default function InfinitePostScroll({
  initialPosts,
  channelId,
  studio,
  hasMorePost,
}: InfinitePostScrollProps) {
  const [posts, setPosts] = useState<PostData[]>(initialPosts || []);
  const [page, setPage] = useState<number>(1);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(hasMorePost);
  const [postLikes, setPostLikes] = useState<Like>({
    likeCount: 0,
    liked: LikeType.none,
  });
  const [ref, inView] = useInView();
  const { toast } = useToast();
  const [isDeletingPost, setIsDeletingPost] = useState<boolean>(false);
  console.log(posts);

  // Fetch more posts
  const loadMorePosts = useCallback(async () => {
    try {
      const response = await axios.get(`/api/v1/post/${channelId}`, {
        params: {
          page: page + 1,
          isStudio: studio ? "Yes" : "No",
        },
      });
      const morePosts = response.data.data?.posts || [];
      if (morePosts.length) {
        setPosts((prev) => [...prev, ...morePosts]);
        setPage((prev) => prev + 1);
        setHasMorePosts(response.data.data?.paginator?.hasNextPage ?? false);
      } else {
        setHasMorePosts(false);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    }
  }, [channelId, page]);

  // Delete post
  const deletePost = async (postId: string) => {
    setIsDeletingPost(true);
    try {
      await axios.delete(`/api/v1/post/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
      toast({
        title: "Post Deleted Successfully",
      });
      if (posts.length <= 1 && hasMorePosts) {
        loadMorePosts();
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ?? "Error while Deleting the post";
      toast({
        variant: "destructive",
        title: "Error while Deleting the post",
        description: errorMessage,
      });
    } finally {
      setIsDeletingPost(false);
    }
  };

  const togglePostLike = async (postId: string) => {
    setPostLikes((prev) => {
      if (prev.liked === LikeType.like) {
        return {
          ...prev,
          likeCount: prev.likeCount - 1,
          liked: LikeType.none,
        };
      } else if (prev.liked === LikeType.dislike) {
        return {
          ...prev,
          likeCount: prev.likeCount + 1,
          liked: LikeType.like,
        };
      } else {
        return {
          ...prev,
          likeCount: prev.likeCount + 1,
          liked: LikeType.like,
        };
      }
    });
    toast({
      title: `${postLikes.liked === "like" ? "Post Unliked" : "Post Liked"}`,
    });
    try {
      await axios.post<ApiResponse>(
        `/api/v1/like/${postId}?entityType=post&likeType=like`
      );
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "like post failed!",
        description:
          errorMessage || "Something went wrong while liking the post",
        variant: "destructive",
      });
      setPostLikes((prev) => {
        if (prev.liked === LikeType.like) {
          return {
            ...prev,
            likeCount: prev.likeCount - 1,
            liked: LikeType.none,
          };
        } else if (prev.liked === LikeType.dislike) {
          return {
            ...prev,
            likeCount: prev.likeCount - 1,
            liked: LikeType.none,
          };
        } else {
          return prev;
        }
      });
    }
  };

  const togglePostDislike = async (postId: string) => {
    setPostLikes((prev) => {
      if (prev.liked === LikeType.dislike) {
        return {
          ...prev,
          liked: LikeType.none,
        };
      } else if (prev.liked === LikeType.like) {
        return {
          ...prev,
          likeCount: prev.likeCount - 1,
          liked: LikeType.dislike,
        };
      } else {
        return {
          ...prev,
          liked: LikeType.dislike,
        };
      }
    });
    try {
      await axios.post<ApiResponse>(
        `/api/v1/like/${postId}?entityType=post&likeType=dislike`
      );
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "dislike post failed!",
        description:
          errorMessage || "Something went wrong while disliking the post",
        variant: "destructive",
      });
      setPostLikes((prev) => {
        if (prev.liked === LikeType.dislike) {
          return {
            ...prev,
            liked: LikeType.none,
          };
        } else if (prev.liked === LikeType.like) {
          return {
            ...prev,
            likeCount: prev.likeCount + 1,
            liked: LikeType.dislike,
          };
        } else {
          return prev;
        }
      });
    }
  };

  useEffect(() => {
    if (inView && hasMorePosts) {
      loadMorePosts();
    }
  }, [inView, hasMorePosts, loadMorePosts]);

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col items-center justify-center p-4 sm:p-6">
        {posts.length > 0 ? (
          <div className="space-y-6 w-full max-w-4xl">
            {posts.map((post) => (
              <Card
                key={post._id}
                className="min-w-[50vw] bg-black border-slate-600 text-white shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg overflow-hidden"
              >
                <CardHeader className="border border-slate-600 border-b-2">
                  <div className="flex gap-2 items-center">
                    <Link href={`/@${post.owner.username}`}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={post.owner.avatar} alt="Post Owner" />
                        <AvatarFallback>VS</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link
                        href={`/@${post.owner.username}`}
                        className="font-semibold"
                      >
                        {post.owner.username}
                      </Link>
                      <p>{formatTimeAgo(new Date(post.createdAt))}</p>
                    </div>
                    {studio && (
                      <div className="ml-auto flex gap-3 items-center">
                        <h4
                          className={`${post.isPublic ? "text-green-500" : "text-red-500"} font-semibold`}
                        >
                          {post.isPublic ? "Public" : "Private"}
                        </h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <Modal
                              title="Edit Post"
                              triggerClassName="flex gap-2 justify-around text-blue-600 hover:bg-blue-300 text-md rounded-sm font-semibold w-full p-2"
                              className="max-w-4xl w-full h-[85vh] text-white bg-[#303030] border-0"
                              Icon={PencilLine}
                            >
                              <EditPostForm {...post} />
                            </Modal>
                            <DropdownMenuSeparator />
                            <Dialog
                              alert="Delete Post"
                              AlertIcon={Trash2}
                              alertStyle="flex gap-2 justify-around text-red-600 hover:bg-red-300 rounded-sm font-semibold w-full p-2"
                              title="Do you really want to delete this post?"
                              action="Delete"
                              actionStyle={`bg-red-600 hover:bg-red-500 text-white ${isDeletingPost && "disable"}`}
                              cancelStyle={`${isDeletingPost && "disable"}`}
                              actionHandler={() => deletePost(post._id)}
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h1 className="font-semibold mb-2">{post.content}</h1>
                  {post.image && (
                    <div className="flex justify-center mt-4">
                      <img
                        src={post.image}
                        alt="post image"
                        className="rounded-lg  w-full shadow-md"
                      />
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex gap-2 justify-start items-center">
                  <div className="flex bg-white items-center justify-around gap-4 text-gray-800 rounded-full px-2 p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-white"
                    >
                      <ThumbsUp
                        size={20}
                        onClick={() => togglePostLike(post._id)}
                        fill={postLikes.liked === "like" ? "blue" : "none"}
                        className="flex-none"
                      />
                    </Button>
                    <span className="text-xs">{postLikes.likeCount}</span>
                    <Separator orientation="vertical" className="h-7" />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-white"
                    >
                      <ThumbsDown
                        size={20}
                        onClick={() => togglePostDislike(post._id)}
                        fill={postLikes.liked === "dislike" ? "red" : "none"}
                        className="flex-none"
                      />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <h1 className="text-center text-xl font-semibold text-gray-600 mt-8">
            No Posts Found
          </h1>
        )}
      </div>
      {posts.length > 0 && (
        <div className="mt-4">
          {hasMorePosts ? (
            <div
              ref={ref}
              className="flex flex-col items-center justify-center"
            >
              <Loader2 className="animate-spin h-16 w-16" />
            </div>
          ) : (
            <h1 className="text-center text-lg font-semibold">No More Posts</h1>
          )}
        </div>
      )}
    </div>
  );
}
