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
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, className }) => {
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

  // Restore playback position from localStorage
  useEffect(() => {
    if (videoRef.current) {
      const savedTime = sessionStorage.getItem(`currentTime-${video._id}`);
      if (savedTime) {
        videoRef.current.currentTime = Math.max(parseFloat(savedTime) - 5, 0);
      }
    }
  }, []);

  // Toggle Play/Pause on click
  const togglePlayPause = () => {
    console.log(videoRef?.current?.onloadedmetadata);
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
      className={`relative group overflow-hidden w-full md:max-w-[80vw] lg:max-w-[60vw] rounded-lg ${className}`}
    >
      {/* Container to preserve aspect ratio */}
      <div className="aspect-w-16 aspect-h-9 relative bg-black">
        <video
          ref={videoRef}
          onClick={togglePlayPause} // Toggle play/pause on video click
          className="w-full h-full object-cover rounded-lg"
        />
        {/* Video Controller */}
        <VideoController
          videoRef={videoRef}
          videoId={video._id.toString()}
          duration={duration}
          video={video}
          isPlaying={isPlaying}
          togglePlayPause={togglePlayPause} // Pass togglePlayPause to controller
          selectedQuality={selectedQuality}
          onQualityChange={setSelectedQuality}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
