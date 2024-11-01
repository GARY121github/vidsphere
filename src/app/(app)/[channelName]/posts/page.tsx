"use client";

import { useEffect, useState } from "react";
import InfinitePostScroll from "@/components/infinite-scroll/infinite-post-scroll";
import { useChannel } from "@/providers/contexts/channel-context";
import axios from "axios";
import PostCardSkeleton from "@/components/skeleton/post-card-skeleton";
import { PostData } from "@/components/infinite-scroll/infinite-post-scroll";

export default function ChannelPost() {
  const { channelDetail } = useChannel();
  const [loading, setLoading] = useState<boolean>(true);
  const [channelPosts, setChannelPosts] = useState<PostData[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);

  const fetchChannelPosts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/post`, {
        params: {
          channelId: channelDetail?._id,
        },
      });
      setChannelPosts(response.data.data.posts);
      setHasNextPage(response.data.data.paginator.hasNextPage ?? false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!channelDetail?._id) {
      return;
    }

    fetchChannelPosts();
  }, []);

  return (
    <div>
      {loading ? (
        <PostCardSkeleton />
      ) : (
        <div>
          {channelDetail?._id ? (
            <InfinitePostScroll
              initialPosts={channelPosts}
              channelId={channelDetail._id}
              hasMorePost={hasNextPage}
            />
          ) : (
            <h1>Channel Not Found</h1>
          )}
        </div>
      )}
    </div>
  );
}
