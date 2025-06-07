import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl?: string;
  youtubeUrl?: string;
  className?: string;
}

export function VideoPlayer({ videoUrl, youtubeUrl, className }: VideoPlayerProps) {
  if (!videoUrl && !youtubeUrl) {
    return (
      <div className={cn('relative aspect-video bg-muted rounded-lg overflow-hidden', className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground">No video available</p>
        </div>
      </div>
    );
  }

  if (youtubeUrl) {
    return (
      <div className={cn('relative aspect-video bg-muted rounded-lg overflow-hidden', className)}>
        <iframe
          src={`${youtubeUrl}?autoplay=1&rel=0`}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Wistia video player
  return (
    <div className={cn('relative aspect-video bg-muted rounded-lg overflow-hidden', className)}>
      <iframe
        className="learnworlds-video-iframe js-video-frame"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        style={{
          height: '100%',
          width: '100%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          position: 'absolute',
        }}
        allowFullScreen
        src={`${videoUrl}?playbar=true&playButton=false&smallPlayButton=true&qualityControl=true&playbackRateControl=true&volumeControl=false&settingsControl=true&controlsVisibleOnLoad=true&videoFoam=false&fullscreenButton=true&fitStrategy=none&playerColor=04041E&autoPlay=true&muted=true&endVideoBehavior=loop`}
      />
    </div>
  );
}
