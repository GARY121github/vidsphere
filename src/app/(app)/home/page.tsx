import VideoCard, { VideoGridItemProps } from "@/components/video/video-card";
import axios from "axios";
import config from "@/conf/config";

export default async function HomePage() {
  const response = await fetchVideos();

  const videos: Array<VideoGridItemProps> | undefined = response?.data?.videos;

  return (
    <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 xl:grid-cols-3">
      {videos && videos.length > 0 ? (
        videos.map((video: any) => (
          <VideoCard key={video._id} {...video} duration={205} views={200} />
        ))
      ) : (
        <h1>No Video Found</h1>
      )}
    </div>
  );
}

async function fetchVideos() {
  try {
    const response = await axios.get(`${config.BACKEND_API}/video`);
    return response.data;
  } catch (error) {
    console.error("Error fetching videos", error);
    return { videos: undefined };
  }
}
