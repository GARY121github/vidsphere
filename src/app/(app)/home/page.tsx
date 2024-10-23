import axios, { AxiosError, AxiosResponse } from "axios";
import config from "@/conf/config";
import { VideoGridItemProps } from "@/components/video/video-card";
import InfiniteScroll from "@/components/infinite-scroll";

export default async function HomePage() {
  const response = await fetchVideos({ page: 1 });
  if (response.videos === undefined) {
    return <div>Error fetching videos</div>;
  }
  const videos: VideoGridItemProps[] | undefined = response?.videos;
  return <InfiniteScroll initialVideos={videos} />;
}

interface FetchVideoInterface {
  page: number;
  limit?: number;
  query?: string;
  sortBy?: string;
  sortType?: string;
}

// Define the function that fetches videos
const fetchVideos = async ({
  page,
  limit,
  query,
  sortBy,
  sortType,
}: FetchVideoInterface) => {
  try {
    const response = await axios.get(`${config.BACKEND_API}/video`, {
      params: {
        page, // Current page number
        limit, // Number of videos to fetch per request
        query, // Optional: Search query for filtering videos
        sortBy, // Sorting field, e.g., 'createdAt'
        sortType, // Sorting type, 'asc' or 'desc'
      },
    });

    return response.data.data;
  } catch (error: any) {
    return error;
  }
};
