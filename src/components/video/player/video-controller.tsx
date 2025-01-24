import React, { useState, useEffect, forwardRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Check,
  ChevronDown,
} from "lucide-react";
import { formatDuration } from "@/utils/formatDuration";

interface VideoQuality {
  link: string;
  quality: string;
}

interface VideoControllerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  videoId: string;
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
      videoId,
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
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
    const [isChangingQuality, setIsChangingQuality] = useState<boolean>(false);

    const toggleMute = () => {
      if (videoRef.current) {
        const newMuteState = !videoRef.current.muted;
        videoRef.current.muted = newMuteState;
        setIsMuted(newMuteState);
        setVolume(newMuteState ? 0 : videoRef.current.volume);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        videoRef.current.muted = newVolume === 0;
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

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    useEffect(() => {
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
      };
    }, []);

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log(videoRef.current);
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
        setProgress(Number.isNaN(progressValue) ? 0 : progressValue);
        sessionStorage.setItem(
          `currentTime-${videoId}`,
          videoRef.current.currentTime.toString()
        );
      }
    };

    const handleQualityChange = (newQuality: string) => {
      if (videoRef.current) {
        // Set state to indicate quality is changing
        setIsChangingQuality(true);

        // Save the current playback state and time
        const wasPlaying = !videoRef.current.paused;
        const currentTime = videoRef.current.currentTime;

        // Update the quality
        onQualityChange(newQuality);

        // Change the video source and restore playback position
        videoRef.current.src = newQuality;
        videoRef.current.load();
        videoRef.current.currentTime = currentTime;

        // Handle playback state after quality change
        const handleCanPlay = () => {
          if (wasPlaying) {
            videoRef.current?.play();
          }
          setIsChangingQuality(false); // Quality change completed
          videoRef.current?.removeEventListener("canplay", handleCanPlay);
        };

        // Wait for the video to be ready to play
        videoRef.current.addEventListener("canplay", handleCanPlay);
      }
      setIsDropdownOpen(false); // Close the dropdown menu
    };

    useEffect(() => {
      if (videoRef.current) {
        videoRef.current.addEventListener("timeupdate", handleTimeUpdate);
        return () => {
          videoRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
        };
      }
    }, [videoRef]);

    // Enhanced keyboard controls with smooth seeking
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!videoRef.current) return;

        const currentTime = videoRef.current.currentTime;

        switch (e.key) {
          case "ArrowRight": // Seek forward
            videoRef.current.currentTime = Math.min(
              videoRef.current.currentTime + 5,
              videoRef.current.duration
            );
            break;
          case "ArrowLeft": // Seek backward
            videoRef.current.currentTime = Math.max(currentTime - 5, 0);
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [togglePlayPause, duration]);

    return (
      <div
        ref={ref}
        className={`p-2 flex items-center justify-between text-white transition-opacity ${isFullscreen ? "absolute bottom-0 left-0 right-0" : "absolute bottom-0 left-0 right-0"} ${
          isPlaying ? "opacity-0 group-hover:opacity-100 " : "opacity-100"
        }`}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="absolute bottom-14 bg-opacity-60 bg-gray-700 cursor-pointer group-hover:bg-gray-800 self-center w-[96%] lg:w-[98%]"
        />
        <div className="flex justify-between items-center">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlayPause} // Toggle play/pause on button click
            className="mx-1 hover:opacity-80 focus:outline-none"
          >
            {isPlaying ? (
              <Pause size={24} fill="white" />
            ) : (
              <Play size={24} strokeWidth={3} />
            )}
          </button>

          {/* Time Display */}
          <div className="text-sm">
            {formatDuration(duration)} / {formatDuration(duration)}
          </div>

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
              className="w-24 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-shrink-0 relative justify-between items-center">
          {/* Quality Selection */}
          {/* <Select value={selectedQuality} onValueChange={onQualityChange}>
            <SelectTrigger className="border-none focus:ring-0 focus:ring-offset-0 bg-transparent">
              <Settings />
            </SelectTrigger>
            <SelectContent
              className="z-50 absolute">
              {video.videoUrls.map((quality) => (
                <SelectItem key={quality.link} value={quality.link}>
                  {quality.quality}
                </SelectItem>
              ))}
            </SelectContent>
          </Select> */}

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center border-none focus:outline-none bg-transparent"
            >
              <Settings />
              <ChevronDown
                className={`transition-transform h-4 w-4 ${
                  isDropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute bottom-full right-full z-50 mb-2 w-32 bg-white border border-gray-300 rounded-md shadow-lg">
                {video.videoUrls.map((quality) => (
                  <button
                    key={quality.link}
                    onClick={() => handleQualityChange(quality.link)}
                    className={`flex justify-between text-black items-center w-full px-4 py-2 text-left hover:bg-gray-100 ${
                      selectedQuality === quality.link
                        ? "bg-gray-200 font-semibold"
                        : ""
                    }`}
                  >
                    <span>{quality.quality}</span>
                    {selectedQuality === quality.link && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
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
