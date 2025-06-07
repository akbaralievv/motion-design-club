'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, MaximizeIcon, MinimizeIcon, VolumeIcon, Volume2Icon, Volume1Icon, VolumeXIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { updateLessonProgress } from '@/lib/store/slices/progressSlice';
import { toggleVideoFullscreen, setVideoFullscreen } from '@/lib/store/slices/uiSlice';
import { progressStatuses } from '@/lib/constants';

interface VideoPlayerProps {
  src: string;
  lessonId?: string; // Made lessonId optional
  progressId?: string;
  title?: string;
  poster?: string; // Added poster prop
  onProgressUpdate?: (progress: number) => void;
  className?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({
  src,
  lessonId,
  progressId,
  title,
  poster,
  onProgressUpdate,
  className,
  autoPlay = false,
}: VideoPlayerProps) {
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Event listeners
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => {
      if (video.currentTime && video.duration) {
        setCurrentTime(video.currentTime);
        const newProgress = (video.currentTime / video.duration) * 100;
        setProgress(newProgress);

        // Mark as completed if 95% watched (only if we have a lessonId and progressId)
        if (newProgress >= 95 && progressId && lessonId) {
          dispatch(updateLessonProgress({
            lessonId,
            status: progressStatuses.COMPLETED,
            watchTimePercentage: newProgress,
          }));
        } else if (progressId && lessonId) {
          dispatch(updateLessonProgress({
            lessonId,
            status: progressStatuses.IN_PROGRESS,
            watchTimePercentage: newProgress,
          }));
        }

        if (onProgressUpdate) {
          onProgressUpdate(newProgress);
        }
      }
    };
    const onLoadedMetadata = () => {
      setDuration(video.duration);
      setIsVideoLoaded(true);
    };
    const onVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('volumechange', onVolumeChange);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('volumechange', onVolumeChange);
    };
  }, [dispatch, lessonId, onProgressUpdate, progressId]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
      dispatch(setVideoFullscreen(Boolean(document.fullscreenElement)));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [dispatch]);

  useEffect(() => {
    const hideControls = () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }

      controlsTimeout.current = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    if (isPlaying) {
      hideControls();
    } else {
      setShowControls(true);
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    }

    return () => {
      if (controlsTimeout.current) {
        clearTimeout(controlsTimeout.current);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  const handleTimeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = (value[0] / 100) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = value[0] / 100;
    video.volume = newVolume;
    setVolume(newVolume);

    if (newVolume === 0) {
      setIsMuted(true);
      video.muted = true;
    } else if (isMuted) {
      setIsMuted(false);
      video.muted = false;
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }

    dispatch(toggleVideoFullscreen());
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeXIcon className="h-4 w-4" />;
    if (volume < 0.3) return <VolumeIcon className="h-4 w-4" />;
    if (volume < 0.7) return <Volume1Icon className="h-4 w-4" />;
    return <Volume2Icon className="h-4 w-4" />;
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative aspect-video bg-black rounded-lg overflow-hidden group',
        className
      )}
      onMouseMove={() => {
        setShowControls(true);
        if (controlsTimeout.current) {
          clearTimeout(controlsTimeout.current);
        }
        if (isPlaying) {
          controlsTimeout.current = setTimeout(() => {
            setShowControls(false);
          }, 3000);
        }
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster} // Added poster attribute
        className="w-full h-full"
        onClick={togglePlay}
        autoPlay={autoPlay}
        playsInline
      />

      {!isVideoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Title bar */}
      {title && showControls && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent text-white transition-opacity duration-300">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
      )}

      {/* Controls */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Progress bar */}
        <div className="mb-2">
          <Slider
            value={[progress]}
            min={0}
            max={100}
            step={0.1}
            onValueChange={handleTimeChange}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="hover:bg-white/20 text-white"
            >
              {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={skipBackward}
              className="hover:bg-white/20 text-white"
            >
              <SkipBackIcon className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={skipForward}
              className="hover:bg-white/20 text-white"
            >
              <SkipForwardIcon className="h-4 w-4" />
            </Button>

            <div className="text-sm ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative group">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="hover:bg-white/20 text-white"
              >
                {getVolumeIcon()}
              </Button>

              <div className="absolute bottom-full mb-2 hidden group-hover:block w-24 right-0">
                <Slider
                  value={[isMuted ? 0 : volume * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="cursor-pointer"
                />
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleFullscreen}
              className="hover:bg-white/20 text-white"
            >
              {isFullscreen ? <MinimizeIcon className="h-4 w-4" /> : <MaximizeIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Big play button in the middle */}
      {!isPlaying && showControls && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="bg-primary/80 hover:bg-primary rounded-full p-4">
            <PlayIcon className="h-8 w-8 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
