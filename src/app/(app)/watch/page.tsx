"use client";

import { useEffect, useState } from "react";
import VideoPlayer from "@/components/video/player/videp-player";
import axios, { AxiosError } from "axios";
import { useSearchParams } from "next/navigation";
import VideoPlayerSkeleton from "@/components/skeleton/video-player-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { set, Types } from "mongoose";
import Link from "next/link";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Dialog from "@/components/dialog/dialog";
import CommentSection from "@/components/comments/CommentSection";
import ApiResponse from "@/utils/ApiResponse";
import ApiError from "@/utils/ApiError";

export interface VideoQuality {
  link: string;
  quality: string;
}

interface Video {
  _id: Types.ObjectId; // Change to ObjectId
  title: string;
  description: string;
  isPublished: boolean;
  videoUrls: Array<VideoQuality>;
  thumbnail: string;
  owner: {
    username: string;
    fullName: string;
    avatar: string;
    _id: string;
  };
  status: string;
}

interface Comment {
  _id: string;
  content: string;
  video: string;
  owner: {
    _id: string;
    fullName: string;
    username: string;
    avatar: string;
    updatedAt: string;
  };
}

enum LikeType {
  like = "like",
  dislike = "dislike",
  undefined = "undefined",
}

interface Like {
  likeCount: number;
  dislikeCount: number;
  liked: LikeType;
}

export default function WatchVideo() {
  const videoParams = useSearchParams();
  const videoId = videoParams.get("v");
  const router = useRouter();
  const [video, setVideo] = useState<Video | null>(null);
  const [hasSubscribed, setHasSubscribed] = useState<Boolean>(false);
  const [subscribers, setSubscribers] = useState(0);
  const [videoLikes, setVideoLikes] = useState<Like>({
    likeCount: 0,
    dislikeCount: 0,
    liked: LikeType.undefined,
  });
  const [comments, setComments] = useState<Array<Comment>>([]);
  const [isCommentSectionHidden, setIsCommentSectionHidden] = useState(true);
  const { toast } = useToast();

  const getVideo = async () => {
    try {
      const response = await axios.get<ApiResponse>(`/api/v1/video/${videoId}`);
      if (response.status !== 200) {
        toast({
          title: "fetch video failed!",
          description: response.data.message,
          variant: "destructive",
        });
      } else {
        setVideo(response.data.data);
        setSubscribers(response.data.data.subscriberCount);
        setHasSubscribed(response.data.data.isSubscribed);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "fetch video failed!",
        description:
          errorMessage || "Something went wrong while fetching the video",
        variant: "destructive",
      });
      router.replace("/watch/video-not-found");
    }
  };

  const toggleSubscription = async () => {
    setHasSubscribed((prev) => !prev);
    setSubscribers((prev) => (hasSubscribed ? prev - 1 : prev + 1));
    toast({
      title: `${hasSubscribed ? "Unsubscribed Successfully" : "Subscribed Successfully"}`,
    });
    try {
      const response = await axios.put<ApiResponse>(
        `/api/v1/subscription/c/${video?.owner._id}`
      );

      if (response.status !== 200) {
        toast({
          title: "Something went wrong while toggeling the subscrpition",
          description: response.data.message,
          variant: "destructive",
        });
        setSubscribers((prev) => (hasSubscribed ? prev + 1 : prev - 1));
        setHasSubscribed((prev) => !prev);
      } else {
        toast({
          title: "Subscrpition toggled successfully",
          description: response.data.message,
          variant: "success",
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "Something went wrong while toggeling the subscrpition",
        description:
          errorMessage ||
          "Something went wrong while toggeling the subscrpition",
        variant: "destructive",
      });
      setSubscribers((prev) => (hasSubscribed ? prev + 1 : prev - 1));
      setHasSubscribed((prev) => !prev);
    }
  };

  const fetchVideoLikes = async () => {
    try {
      const response = await axios.get<ApiResponse>(
        `/api/v1/like?entityType=video&entityId=${videoId}`
      );
      if (response.status !== 200) {
        toast({
          title: "fetch video likes failed!",
          description: response.data.message,
          variant: "destructive",
        });
      } else {
        setVideoLikes({
          likeCount: response.data.data.likeCount,
          dislikeCount: response.data.data.dislikeCount,
          liked: response.data.data.isLikedByCurrentUser
            ? LikeType.like
            : response.data.data.isDislikedByCurrentUser
              ? LikeType.dislike
              : LikeType.undefined,
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "fetch video likes failed!",
        description:
          errorMessage || "Something went wrong while fetching video likes",
        variant: "destructive",
      });
    }
  };

  const toggleVideoLike = async () => {
    setVideoLikes((prev) => {
      if (prev.liked === LikeType.like) {
        return {
          ...prev,
          likeCount: prev.likeCount - 1,
          liked: LikeType.undefined,
        };
      } else if (prev.liked === LikeType.dislike) {
        return {
          ...prev,
          likeCount: prev.likeCount + 1,
          dislikeCount: prev.dislikeCount - 1,
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
    try {
      const response = await axios.post<ApiResponse>(
        `/api/v1/like?entityType=video&entityId=${videoId}&likeType=like`
      );
      if (response.status !== 200) {
        throw new ApiError(response.status, response.data.message);
      } else {
        toast({
          title: "video liked!",
          description: response.data.message,
          variant: "success",
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "like video failed!",
        description:
          errorMessage || "Something went wrong while liking the video",
        variant: "destructive",
      });
      setVideoLikes((prev) => {
        if (prev.liked === LikeType.like) {
          return {
            ...prev,
            likeCount: prev.likeCount - 1,
            liked: LikeType.undefined,
          };
        } else if (prev.liked === LikeType.dislike) {
          return {
            ...prev,
            likeCount: prev.likeCount - 1,
            dislikeCount: prev.dislikeCount + 1,
            liked: LikeType.undefined,
          };
        } else {
          return prev;
        }
      });
    }
  };

  const toggleVideoDislike = async () => {
    setVideoLikes((prev) => {
      if (prev.liked === LikeType.dislike) {
        return {
          ...prev,
          dislikeCount: prev.dislikeCount - 1,
          liked: LikeType.undefined,
        };
      } else if (prev.liked === LikeType.like) {
        return {
          ...prev,
          likeCount: prev.likeCount - 1,
          dislikeCount: prev.dislikeCount + 1,
          liked: LikeType.dislike,
        };
      } else {
        return {
          ...prev,
          dislikeCount: prev.dislikeCount + 1,
          liked: LikeType.dislike,
        };
      }
    });
    try {
      const response = await axios.post<ApiResponse>(
        `/api/v1/like?entityType=video&entityId=${videoId}&likeType=dislike`
      );
      if (response.status !== 200) {
        throw new ApiError(response.status, response.data.message);
      } else {
        toast({
          title: "video disliked!",
          description: response.data.message,
          variant: "success",
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "dislike video failed!",
        description:
          errorMessage || "Something went wrong while disliking the video",
        variant: "destructive",
      });
      setVideoLikes((prev) => {
        if (prev.liked === LikeType.dislike) {
          return {
            ...prev,
            dislikeCount: prev.dislikeCount - 1,
            liked: LikeType.undefined,
          };
        } else if (prev.liked === LikeType.like) {
          return {
            ...prev,
            likeCount: prev.likeCount + 1,
            dislikeCount: prev.dislikeCount - 1,
            liked: LikeType.dislike,
          };
        } else {
          return prev;
        }
      });
    }
  };

  const fetchComments = async (page: string) => {
    try {
      const response = await axios.get<ApiResponse>(
        `/api/v1/comments?videoId=${videoId}&page=${page}`
      );
      if (response.status !== 200) {
        toast({
          title: "fetch comments failed!",
          description: response.data.message,
          variant: "destructive",
        });
      } else {
        setComments(response.data.data);
        setIsCommentSectionHidden(false);
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "fetch comments failed!",
        description:
          errorMessage || "Something went wrong while fetching comments",
        variant: "destructive",
      });
    }
  };

  const addComment = async (content: string) => {
    try {
      const response = await axios.post<ApiResponse>(
        `/api/v1/comments?videoId=${videoId}`,
        { commentText: content }
      );
      if (response.status !== 201) {
        toast({
          title: "add comment failed!",
          description: response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "comment added!",
          description: response.data.message,
          variant: "success",
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "add comment failed!",
        description:
          errorMessage || "Something went wrong while adding the comment",
        variant: "destructive",
      });
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/v1/comments/${commentId}`
      );
      if (response.status !== 200) {
        toast({
          title: "delete comment failed!",
          description: response.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "comment deleted!",
          description: response.data.message,
          variant: "success",
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast({
        title: "delete comment failed!",
        description:
          errorMessage || "Something went wrong while deleting the comment",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    getVideo();
    fetchVideoLikes();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">
        {video ? (
          <div className="flex flex-col gap-2">
            <VideoPlayer video={video} width="800" height="450" />
            <h1 className="text-3xl font-extrabold mt-5">{video.title}</h1>
            <div className="mt-4">
              <div className="flex justify-between">
                <Link href={`@${video.owner.username}`} className="flex gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={video.owner.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold capitalize">
                      {video.owner.fullName}
                    </h2>
                    <p>{subscribers} subscribers</p>
                  </div>
                </Link>
                <div className="flex items-center gap-4">
                  <div>
                    {hasSubscribed ? (
                      <Dialog
                        alert="Unsubscribe"
                        alertStyle="bg-gray-700 p-3 rounded-3xl inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 "
                        title={`Unsubscribe from ${video.owner.username}`}
                        action="Unsubscribe"
                        actionHandler={toggleSubscription}
                      />
                    ) : (
                      <Button
                        onClick={toggleSubscription}
                        variant="secondary"
                        className="bg-white p-4 rounded-full text-black hover:bg-slate-300"
                      >
                        Subscribe
                      </Button>
                    )}
                  </div>
                  <div className="flex bg-white items-center justify-around gap-4 text-gray-800 rounded-full px-2 p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-white"
                    >
                      <ThumbsUp
                        size={20}
                        onClick={toggleVideoLike}
                        fill={videoLikes.liked === "like" ? "blue" : "none"}
                        className="flex-none"
                      />
                    </Button>
                    <span className="text-xs">{videoLikes.likeCount}</span>
                    <Separator orientation="vertical" className="h-7" />

                    <span className="text-xs">{videoLikes.dislikeCount}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-white"
                    >
                      <ThumbsDown
                        size={20}
                        onClick={toggleVideoDislike}
                        fill={videoLikes.liked === "dislike" ? "red" : "none"}
                        className="flex-none"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-600 w-full p-3 rounded-lg mt-3">
              <p>{video.description}</p>
            </div>
            {!isCommentSectionHidden && (
              <CommentSection
                comments={comments}
                addComment={addComment}
                deleteComment={deleteComment}
                fetchComments={fetchComments}
              />
            )}
            <Button
              className={`bg-slate-700 p-3 rounded-lg ${!isCommentSectionHidden && "hidden"}`}
              onClick={() => setIsCommentSectionHidden(false)}
            >
              Show Comments
            </Button>
            <Button
              className={`bg-slate-700 p-3 rounded-lg
                ${isCommentSectionHidden && "hidden"}
                `}
              onClick={() => setIsCommentSectionHidden(true)}
            >
              Hide Comments
            </Button>
          </div>
        ) : (
          <VideoPlayerSkeleton />
        )}
      </div>
      <div className="">
        <h1 className="text-4xl font-semibold">
          Recommended Video Section: comming soon
        </h1>
      </div>
    </div>
  );
}
