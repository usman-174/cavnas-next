"use client";

import { useState, useEffect } from 'react';

interface BackgroundProps {
  showVideo?: boolean;
  children?: React.ReactNode;
}

export function Background({ showVideo = false, children }: BackgroundProps) {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="absolute inset-0 z-0">
      {/* Video or Gradient Background */}
      {showVideo && !videoError ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 transition-opacity duration-[2000ms]"
          onError={() => setVideoError(true)}
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-[#0a0a0a] to-black" />
      )}

      {/* Scrim/Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

      {/* Noise Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay bg-noise"
      />

      {children}
    </div>
  );
}
