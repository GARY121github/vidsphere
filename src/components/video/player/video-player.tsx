"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Hls from "hls.js";
import mongoose from "mongoose";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDuration } from "@/utils/formatDuration";

interface VideoQualityOption {
  link: string;
  quality: string;
}

interface VideoPlayerProps extends React.HTMLAttributes<HTMLDivElement> {
  video: {
    _id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    videoUrls: VideoQualityOption[];
    thumbnail: string;
  };
}

const VideoPlayer = React.forwardRef<HTMLDivElement, VideoPlayerProps>(
  ({ video, className, ...props }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const [hlsInstance, setHlsInstance] = useState<Hls | null>(null);
    const [selectedQuality, setSelectedQuality] = useState<string>(
      video.videoUrls[0]?.link
    );
    const [duration, setDuration] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
    const [isMuted, setIsMuted] = useState<boolean>(false);
    const [showControls, setShowControls] = useState<boolean>(true);
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [clickAnimation, setClickAnimation] = useState<boolean>(false);
    const [showQualityMenu, setShowQualityMenu] = useState<boolean>(false);
    const isMobile = useIsMobile();

    let controlsTimeout: NodeJS.Timeout;

    // Close quality menu when exiting fullscreen
    useEffect(() => {
      if (!isFullscreen) {
        setShowQualityMenu(false);
      }
    }, [isFullscreen]);

    // Close quality menu when clicking outside
    useEffect(() => {
      const handleClickOutside = () => {
        if (showQualityMenu) {
          setShowQualityMenu(false);
        }
      };

      if (showQualityMenu && isFullscreen) {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
      }
    }, [showQualityMenu, isFullscreen]);

    // Toggle Play/Pause
    const togglePlayPause = useCallback(() => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(console.error);
        } else {
          videoRef.current.pause();
        }
      }
    }, []);

    // Handle click anywhere on video for play/pause with animation
    const handleVideoClick = useCallback(
      (e: React.MouseEvent) => {
        // Show centered animation like YouTube/Twitch
        setClickAnimation(true);

        // Hide animation after 400ms
        setTimeout(() => {
          setClickAnimation(false);
        }, 400);

        // Toggle play/pause
        togglePlayPause();
      },
      [togglePlayPause]
    );

    // Load video with HLS support
    useEffect(() => {
      if (!videoRef.current || !selectedQuality) return;

      const video = videoRef.current;
      const savedCurrentTime = currentTime; // Preserve current time

      // Reset loading state when changing quality
      setIsLoading(true);

      if (Hls.isSupported()) {
        if (hlsInstance) {
          hlsInstance.destroy();
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hls.loadSource(selectedQuality);
        hls.attachMedia(video);
        setHlsInstance(hls);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // HLS manifest successfully parsed
          if (savedCurrentTime > 0) {
            video.currentTime = savedCurrentTime;
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setIsLoading(false);
            // Could add user notification here
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = selectedQuality;
        // Restore time for non-HLS videos
        if (savedCurrentTime > 0) {
          video.currentTime = savedCurrentTime;
        }
      }

      // Event handlers
      const handleLoadedMetadata = () => {
        if (video.duration && !isNaN(video.duration) && video.duration > 0) {
          setDuration(video.duration);
        }
        // Initialize volume
        video.volume = volume;
        setIsLoading(false);
      };

      const handleTimeUpdate = () => {
        if (!isDragging && video.currentTime !== undefined) {
          setCurrentTime(video.currentTime);
        }
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleLoadStart = () => setIsLoading(true);
      const handleCanPlay = () => setIsLoading(false);

      const handleError = () => {
        setIsLoading(false);
        // Could add toast notification here for user feedback
      };

      // Add event listeners
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("play", handlePlay);
      video.addEventListener("pause", handlePause);
      video.addEventListener("loadstart", handleLoadStart);
      video.addEventListener("canplay", handleCanPlay);
      video.addEventListener("error", handleError);

      return () => {
        // Cleanup
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("play", handlePlay);
        video.removeEventListener("pause", handlePause);
        video.removeEventListener("loadstart", handleLoadStart);
        video.removeEventListener("canplay", handleCanPlay);
        video.removeEventListener("error", handleError);

        if (hlsInstance) {
          hlsInstance.destroy();
        }
      };
    }, [selectedQuality, isDragging]); // Keep currentTime in scope but don't trigger on change

    // Volume control
    const toggleMute = useCallback(() => {
      if (videoRef.current) {
        if (isMuted) {
          videoRef.current.volume = volume;
          setIsMuted(false);
        } else {
          videoRef.current.volume = 0;
          setIsMuted(true);
        }
      }
    }, [isMuted, volume]);

    const changeVolume = useCallback((newVolume: number) => {
      if (videoRef.current) {
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
      }
    }, []);

    // Fullscreen toggle
    const toggleFullscreen = useCallback(() => {
      if (containerRef.current) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        }
      }
    }, []);

    // Progress bar control
    const handleProgressClick = useCallback(
      (e: React.MouseEvent) => {
        if (progressRef.current && videoRef.current && duration > 0) {
          const rect = progressRef.current.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const newTime = (clickX / rect.width) * duration;
          const clampedTime = Math.max(0, Math.min(newTime, duration));
          videoRef.current.currentTime = clampedTime;
          setCurrentTime(clampedTime);
        }
      },
      [duration]
    );

    // Show/hide controls
    const handleMouseMove = useCallback(() => {
      setShowControls(true);
      clearTimeout(controlsTimeout);

      if (isPlaying) {
        controlsTimeout = setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }
    }, [isPlaying]);

    const handleMouseLeave = useCallback(() => {
      if (isPlaying && !isMobile) {
        setShowControls(false);
      }
    }, [isPlaying, isMobile]);

    // Keyboard controls
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        const activeElement = document.activeElement;
        const isInputFocused =
          activeElement?.tagName === "INPUT" ||
          activeElement?.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement)?.contentEditable === "true";

        if (isInputFocused || !videoRef.current) return;

        switch (e.code) {
          case "Space":
            e.preventDefault();
            togglePlayPause();
            break;
          case "KeyK":
            e.preventDefault();
            togglePlayPause();
            break;
          case "KeyM":
            e.preventDefault();
            toggleMute();
            break;
          case "KeyF":
            e.preventDefault();
            toggleFullscreen();
            break;
          case "ArrowUp":
            e.preventDefault();
            changeVolume(Math.min(volume + 0.1, 1));
            break;
          case "ArrowDown":
            e.preventDefault();
            changeVolume(Math.max(volume - 0.1, 0));
            break;
          case "ArrowLeft":
            e.preventDefault();
            videoRef.current.currentTime = Math.max(currentTime - 10, 0);
            break;
          case "ArrowRight":
            e.preventDefault();
            videoRef.current.currentTime = Math.min(currentTime + 10, duration);
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        if (controlsTimeout) {
          clearTimeout(controlsTimeout);
        }
      };
    }, [
      togglePlayPause,
      toggleMute,
      toggleFullscreen,
      changeVolume,
      volume,
      currentTime,
      duration,
    ]);

    const progressPercentage =
      duration > 0 ? (currentTime / duration) * 100 : 0;

    return (
      <div
        ref={containerRef}
        className={cn(
          "relative w-full aspect-video overflow-hidden rounded-xl bg-black shadow-lg transition-all duration-300 hover:shadow-xl group",
          className
        )}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchStart={() => setShowControls(true)}
        {...props}
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          onDoubleClick={toggleFullscreen}
          className="w-full h-full object-contain"
          playsInline
          preload="metadata"
          poster={video.thumbnail}
        />

        {/* Click overlay for play/pause functionality */}
        <div
          className="absolute inset-0 cursor-pointer z-10"
          onClick={handleVideoClick}
          style={{ background: "transparent" }}
        />

        {/* Click Animation Effect - Center like YouTube/Twitch */}
        {clickAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center animate-ping">
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white fill-white" />
              ) : (
                <Play className="w-8 h-8 text-white fill-white ml-1" />
              )}
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}

        {/* Controls Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 z-20 pointer-events-none",
            showControls || !isPlaying || isFullscreen
              ? "opacity-100"
              : "opacity-0"
          )}
        >
          {/* Bottom Controls */}
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-4 space-y-3 pointer-events-auto transition-all duration-300",
              isFullscreen ? "fixed bottom-4 left-4 right-4 z-50" : ""
            )}
          >
            {/* Progress Bar - Always visible and white */}
            <div
              ref={progressRef}
              className="group/progress cursor-pointer py-2 -my-2"
              onClick={handleProgressClick}
            >
              <div className="w-full h-1.5 bg-white/30 rounded-full transition-all duration-200">
                <div
                  className="h-full bg-white rounded-full transition-all duration-200 relative"
                  style={{ width: `${progressPercentage}%` }}
                >
                  {/* Progress thumb - always visible */}
                  <div className="absolute right-0 top-1/2 w-3 h-3 bg-white rounded-full transform -translate-y-1/2 translate-x-1/2 transition-opacity duration-200 shadow-lg" />
                </div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                {/* Play/Pause */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="h-9 w-9 p-0 text-white hover:bg-white/20 hover:text-white hover:scale-105 transition-all duration-200 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 transition-transform duration-200" />
                  ) : (
                    <Play className="h-5 w-5 fill-current transition-transform duration-200" />
                  )}
                </Button>

                {/* Volume */}
                <div className="flex items-center space-x-2 group/volume">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="h-9 w-9 p-0 text-white hover:bg-white/20 hover:text-white hover:scale-105 transition-all duration-200 rounded-full"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5 transition-transform duration-200" />
                    ) : (
                      <Volume2 className="h-5 w-5 transition-transform duration-200" />
                    )}
                  </Button>

                  {!isMobile && (
                    <div className="relative flex items-center transition-all duration-300 ease-out">
                      <div className="relative w-20 h-2 bg-white/30 rounded-lg overflow-hidden hover:bg-white/40 transition-colors duration-200">
                        {/* Volume track - always white */}
                        <div
                          className="absolute left-0 top-0 h-full bg-white rounded-lg transition-all duration-150 hover:bg-white"
                          style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                        />
                        {/* Volume slider input */}
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.05"
                          value={isMuted ? 0 : volume}
                          onChange={(e) =>
                            changeVolume(parseFloat(e.target.value))
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {/* Volume thumb - always visible */}
                        <div
                          className="absolute top-1/2 w-3 h-3 bg-white border-2 border-white rounded-full transform -translate-y-1/2 transition-all duration-150 shadow-lg hover:scale-110"
                          style={{
                            left: `calc(${(isMuted ? 0 : volume) * 100}% - 6px)`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Time Display */}
                <span className="text-sm font-medium">
                  {duration > 0
                    ? `${formatDuration(Math.floor(currentTime) * 1000)} / ${formatDuration(Math.floor(duration) * 1000)}`
                    : "Loading..."}
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {/* Quality Selector */}
                {isFullscreen ? (
                  // Simple fullscreen quality selector
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowQualityMenu(!showQualityMenu)}
                      className="h-9 px-3 text-white hover:bg-white/20 hover:text-white hover:scale-105 transition-all duration-200 rounded-full group"
                    >
                      <Settings className="h-5 w-5 mr-1 transition-transform duration-200 group-hover:rotate-90" />
                      <span className="text-sm font-medium transition-all duration-200">
                        {video.videoUrls.find((q) => q.link === selectedQuality)
                          ?.quality || "Auto"}
                      </span>
                    </Button>
                    {showQualityMenu && (
                      <div className="absolute bottom-full right-0 mb-2 bg-black/95 backdrop-blur-md border border-white/20 shadow-2xl rounded-lg p-1 min-w-[120px] z-[9999]">
                        {video.videoUrls.map((quality) => (
                          <div
                            key={quality.quality}
                            onClick={() => {
                              setSelectedQuality(quality.link);
                              setShowQualityMenu(false);
                            }}
                            className="text-white hover:bg-white/15 transition-colors duration-200 cursor-pointer rounded-md px-3 py-2"
                          >
                            <span className="flex items-center justify-between w-full">
                              <span className="text-sm font-medium text-white">
                                {quality.quality}
                              </span>
                              {selectedQuality === quality.link && (
                                <Check className="h-4 w-4 ml-2 text-white" />
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // Normal dropdown for non-fullscreen
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 px-3 text-white hover:bg-white/20 hover:text-white hover:scale-105 transition-all duration-200 rounded-full group"
                      >
                        <Settings className="h-5 w-5 mr-1 transition-transform duration-200 group-hover:rotate-90" />
                        <span className="text-sm font-medium transition-all duration-200">
                          {video.videoUrls.find(
                            (q) => q.link === selectedQuality
                          )?.quality || "Auto"}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="bg-black/95 backdrop-blur-md border-white/20 shadow-2xl rounded-lg p-1 min-w-[120px] z-50"
                      side="top"
                      align="end"
                      sideOffset={12}
                      avoidCollisions={true}
                      collisionPadding={20}
                    >
                      {video.videoUrls.map((quality) => (
                        <DropdownMenuItem
                          key={quality.quality}
                          onClick={() => setSelectedQuality(quality.link)}
                          className="text-white hover:bg-white/15 focus:bg-white/15 transition-colors duration-200 cursor-pointer rounded-md px-3 py-2"
                        >
                          <span className="flex items-center justify-between w-full">
                            <span className="text-sm font-medium text-white">
                              {quality.quality}
                            </span>
                            {selectedQuality === quality.link && (
                              <Check className="h-4 w-4 ml-2 text-white" />
                            )}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                {/* Fullscreen */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="h-9 w-9 p-0 text-white hover:bg-white/20 hover:text-white hover:scale-105 transition-all duration-200 rounded-full"
                >
                  {isFullscreen ? (
                    <Minimize className="h-5 w-5 transition-transform duration-200" />
                  ) : (
                    <Maximize className="h-5 w-5 transition-transform duration-200" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
export type { VideoPlayerProps, VideoQualityOption };
