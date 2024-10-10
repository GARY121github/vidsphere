import React, { useState, useEffect, forwardRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { set } from "mongoose";

interface VideoQuality {
  link: string;
  quality: string;
}

interface VideoControllerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  duration: number;
  video: {
    videoUrls: VideoQuality[];
  };
  isPlaying: boolean;
  togglePlayPause: () => void; // Receive the togglePlayPause function
  selectedQuality: string;
  onQualityChange: (quality: string) => void;
}

const VideoController = forwardRef<HTMLDivElement, VideoControllerProps>(
  (
    {
      videoRef,
      duration,
      video,
      isPlaying,
      togglePlayPause,
      selectedQuality,
      onQualityChange,
    },
    ref
  ) => {
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
    const [progress, setProgress] = useState<number>(0);

    const toggleMute = () => {
      if (videoRef.current) {
        const newMuteState = !videoRef.current.muted;
        videoRef.current.muted = newMuteState;
        setIsMuted(newMuteState);
        if (newMuteState) {
          setVolume(0);
        } else {
          setVolume(videoRef.current.volume);
        }
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        setIsMuted(newVolume === 0);
      }
    };

    const toggleFullscreen = () => {
      if (!document.fullscreenElement && videoRef.current?.parentElement) {
        videoRef.current.parentElement.requestFullscreen();
        setIsFullscreen(true);
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (videoRef.current) {
        const newProgress = parseFloat(e.target.value);
        videoRef.current.currentTime =
          (newProgress / 100) * videoRef.current.duration;
        setProgress(newProgress);
      }
    };

    const handleTimeUpdate = () => {
      if (videoRef.current) {
        const progressValue =
          (videoRef.current.currentTime / videoRef.current.duration) * 100;
        setProgress(progressValue);
      }
    };

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
        return () => {
          videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
        };
      }
    }, [videoRef]);

    return (
      <div
        ref={ref}
        className={`absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between text-white transition-opacity ${
          isPlaying ? "opacity-0 group-hover:opacity-100 " : "opacity-100"
        }`}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="absolute bottom-14 bg-opacity-60 bg-gray-700 cursor-pointer group-hover:bg-gray-800 self-center w-[99%]"
        />
        <div className="flex justify-between items-center">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause} // Toggle play/pause on button click
            className="mx-1 hover:opacity-80 focus:outline-none"
          >
            {isPlaying ? (
              <Pause size={24} strokeWidth={3} />
            ) : (
              <Play size={24} strokeWidth={3} />
            )}
          </button>

          {/* Volume Control */}
          <div className="flex items-center mx-4">
            <button
              onClick={toggleMute}
              className="mx-2 hover:opacity-80 focus:outline-none"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 cursor-pointer "
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          {/* Quality Selection */}
          <div className="bg-transparent">
            <Select value={selectedQuality} onValueChange={onQualityChange}>
              <SelectTrigger className="text-black">
                <Settings />
              </SelectTrigger>
              <SelectContent>
                {video.videoUrls.map((quality) => (
                  <SelectItem key={quality.link} value={quality.link}>
                    {quality.quality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="mx-2 hover:opacity-80 focus:outline-none"
          >
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
      </div>
    );
  }
);

VideoController.displayName = "VideoController";

export default VideoController;
