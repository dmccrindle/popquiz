"use client";

import { useEffect, useRef, useState } from "react";

export default function PressVideo({ src }: { src: string }) {
  const [autoplay, setAutoplay] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setAutoplay(!reduced);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    videoRef.current?.play().catch(() => {});
  }, [autoplay]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay={autoplay}
      muted
      loop
      controls
      playsInline
      preload="metadata"
      className="w-full h-full object-cover"
      aria-label="Pop Quiz Music announcement video"
    >
      <p className="text-white/60 p-4">
        Your browser doesn&apos;t support video playback.
      </p>
    </video>
  );
}
