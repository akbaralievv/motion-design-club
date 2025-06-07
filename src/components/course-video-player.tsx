'use client';
import { useEffect, useRef } from 'react';
import Player from '@vimeo/player';

interface CourseVideoPlayerProps {
  videoUrl: string;
  title: string;
}

export function CourseVideoPlayer({ videoUrl, title }: CourseVideoPlayerProps) {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<Player | null>(null);
  useEffect(() => {
    if (playerRef.current && !playerInstanceRef.current) {
      // Создаем новый экземпляр плеера
      playerInstanceRef.current = new Player(playerRef.current, {
        url: videoUrl,
        width: 640,
        height: 360,
        responsive: true,
        dnt: true, // Do Not Track
        autopause: true,
        background: false,
        byline: false,
        color: '00adef',
        controls: true,
        pip: true,
        playsinline: true,
        portrait: false,
        speed: true,
        texttrack: 'en',
        transparent: false,
      });

      // Добавляем обработчики событий
      playerInstanceRef.current.on('play', () => {
        console.log('Video started playing');
      });

      playerInstanceRef.current.on('pause', () => {
        console.log('Video paused');
      });

      playerInstanceRef.current.on('ended', () => {
        console.log('Video ended');
      });
    }

    // Очистка при размонтировании
    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
    };
  }, [videoUrl]);

  return (
    <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
      <div ref={playerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
