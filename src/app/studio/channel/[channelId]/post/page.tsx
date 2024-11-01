"use client";
import { Separator } from "@/components/ui/separator";
import ApiResponse from "@/utils/ApiResponse";
import axios, { AxiosError } from "axios";
import CreatePostModal from "@/components/modals/create-post-modal";
import InfinitePostScroll from "@/components/infinite-scroll/infinite-post-scroll";
import { useEffect, useState } from "react";
import { PostData } from "@/components/infinite-scroll/infinite-post-scroll";
import { useToast } from "@/components/ui/use-toast";
import ApiError from "@/utils/ApiError";
import PostCardSkeleton from "@/components/skeleton/post-card-skeleton";

export default function ChannelPost({
  params,
}: {
  params: { channelId: string };
}) {
  const { channelId } = params;
  const [posts, setPosts] = useState<PostData[] | []>([]);
  const [hasMorePost, setHasMorePosts] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const [refreshPost, setRefreshPost] = useState<boolean>(false);

  const getUsersPost = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/v1/post`, {
        params: {
          channelId: channelId,
          isStudio: "Yes",
        },
      });
      setPosts(response.data.data.posts);
      setHasMorePosts(response.data.data.paginator.hasNextPage);
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiError>;
      const errorMessage =
        axiosError?.response?.data?.message ?? "Error while signing up";
      toast({
        title: "Error while fetching posts",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersPost();
  }, [refreshPost]);

  if (loading) return <PostCardSkeleton />;

  return (
    <div className="container mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Channel Post</h1>
        <CreatePostModal setRefreshPost={setRefreshPost} />
      </div>
      <Separator className="w-full" />
      <InfinitePostScroll
        initialPosts={posts}
        channelId={channelId}
        hasMorePost={hasMorePost}
        studio
      />
    </div>
  );
}
