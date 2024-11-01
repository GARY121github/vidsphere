import axios from "axios";
import config from "@/conf/config";
import { VideoGridItemProps } from "@/components/video/video-card";
import InfiniteScroll from "@/components/infinite-scroll/infinite-video-scroll";

export default async function HomePage() {
  const response = await fetchVideos();
  if (response.videos === undefined) {
    return <div>Error fetching videos</div>;
  }
  const videos: VideoGridItemProps[] | undefined = response?.videos;
  return <InfiniteScroll initialVideos={videos} />;
}

// Define the function that fetches videos
const fetchVideos = async () => {
  try {
    const response = await axios.get(`${config.BACKEND_API}/video`, {
      params: {
        page: 1,
      },
    });

    return response.data.data;
  } catch (error: any) {
    return error;
  }
};
