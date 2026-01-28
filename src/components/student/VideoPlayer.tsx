import { useState, useRef } from "react";

interface VideoPlayerProps {
  videoUrl?: string;
  thumbnailUrl?: string;
  currentTime?: number;
  duration?: string;
  onTimeUpdate?: (time: number) => void;
  onComplete?: () => void;
}

const VideoPlayer = ({
  videoUrl,
  thumbnailUrl = "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
  duration = "00:00",
  onTimeUpdate,
  onComplete,
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState("00:00");
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      // No video source, just toggle state for demo
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const progress = (video.currentTime / video.duration) * 100;
      setCurrentProgress(progress);

      // Format time
      const minutes = Math.floor(video.currentTime / 60);
      const seconds = Math.floor(video.currentTime % 60);
      setCurrentTimeDisplay(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );

      onTimeUpdate?.(video.currentTime);

      // Check if video completed
      if (video.currentTime >= video.duration - 0.5) {
        onComplete?.();
      }
    }
  };

  const handleVolumeToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = percent * videoRef.current.duration;
      setCurrentProgress(percent * 100);
    }
  };

  const handleFullscreen = () => {
    const container = document.querySelector(".video-player-container");
    if (container) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        container.requestFullscreen();
      }
    }
  };

  return (
    <div
      className="video-player-container relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-xl group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(isPlaying ? false : true)}
    >
      {/* Video or Thumbnail */}
      {videoUrl ? (
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            onComplete?.();
          }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${thumbnailUrl}")` }}
        >
          <div className="absolute inset-0 bg-slate-900/40" />
        </div>
      )}

      {/* Play Button Overlay (when paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handlePlayClick}
            className="flex size-20 items-center justify-center rounded-full color-primary/90 text-white shadow-xl hover:scale-110 transition-transform"
          >
            <span className="material-symbols-outlined FILL text-[48px]">
              play_arrow
            </span>
          </button>
        </div>
      )}

      {/* Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to from-black/80 to-transparent transition-opacity ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress Bar */}
        <div
          className="mb-2 flex h-1.5 w-full items-center rounded-full bg-white/20 cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full rounded-full color-primary transition-all"
            style={{ width: `${currentProgress}%` }}
          />
          <div className="size-3 rounded-full bg-white shadow-lg border-2 border-[#0077BE] -ml-1" />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handlePlayClick}>
              <span className="material-symbols-outlined text-white text-[20px] cursor-pointer hover:scale-110 transition-transform">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>
            <button onClick={handleVolumeToggle}>
              <span className="material-symbols-outlined text-white text-[20px] cursor-pointer hover:scale-110 transition-transform">
                {isMuted ? "volume_off" : "volume_up"}
              </span>
            </button>
            <span className="text-xs font-medium text-white">
              {currentTimeDisplay} / {duration}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-white text-[20px] cursor-pointer hover:scale-110 transition-transform">
              settings
            </span>
            <button onClick={handleFullscreen}>
              <span className="material-symbols-outlined text-white text-[20px] cursor-pointer hover:scale-110 transition-transform">
                fullscreen
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
