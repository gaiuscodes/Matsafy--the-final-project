'use client';

import { useEffect, useRef } from 'react';

interface HeroVideoProps {
  src: string;
  poster: string;
  playbackRate?: number;
  className?: string;
}

export function HeroVideo({
  src,
  poster,
  playbackRate = 0.6,
  className = '',
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      loop
      muted
      playsInline
      poster={poster}
      className={className}
    />
  );
}

