import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import VideoController from "./video-controller";
import mongoose from "mongoose";

interface VideoQuality {
  link: string;
  quality: string;
}

interface VideoPlayerProps {
  video: {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrls: VideoQuality[];
    thumbnail: string;
  };
  width?: string;
  height?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  width = "600",
  height = "500",
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string>(
    video.videoUrls[0]?.link
  );
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Load video with HLS support
  useEffect(() => {
    if (Hls.isSupported() && selectedQuality) {
      const hls = new Hls();
      hls.loadSource(selectedQuality);
      hls.attachMedia(videoRef.current!);
      setHlsInstance(hls);

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = selectedQuality;
      videoRef.current.play();
    }

    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        setDuration(videoRef.current?.duration || 0);
      };
    }
  }, [selectedQuality]);

  // Toggle Play/Pause on click
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  // Handle space bar for play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // Prevent scrolling on space bar press
        togglePlayPause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`relative group overflow-hidden w-[${width}] h-[${height}] max-w-[60vw] rounded-lg`}
    >
      <video
        ref={videoRef}
        onClick={togglePlayPause} // Toggle play/pause on video click
        className="w-full rounded-lg"
        autoPlay
      />
      {/* Pass videoRef and other states to the controller */}
      <VideoController
        videoRef={videoRef}
        duration={duration}
        video={video}
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause} // Pass togglePlayPause to controller
        selectedQuality={selectedQuality}
        onQualityChange={setSelectedQuality}
      />
    </div>
  );
};

export default VideoPlayer;
