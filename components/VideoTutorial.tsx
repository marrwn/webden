'use client';

import React, { useRef, useEffect } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function VideoTutorial() {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add('vjs-big-play-centered');
      videoRef.current?.appendChild(videoElement);

      const player = playerRef.current = videojs(videoElement, {
        controls: true,
        responsive: true,
        fluid: true,
        sources: [{
          src: '/videos/tutorial.mp4',
          type: 'video/mp4'
        }]
      });
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center bg-card p-6 md:p-10 rounded-xl border shadow-sm w-full max-w-5xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-4 tracking-tight">How to Use the Customizer</h2>
      <p className="text-muted-foreground mb-8 max-w-2xl text-center text-lg">
        Watch this quick tutorial to learn how to customize colors, grid, and physics. Then generate your unique code and import it properly into WebDen!
      </p>
      <div className="w-full rounded-lg overflow-hidden border shadow-sm relative bg-black aspect-video" data-vjs-player>
        <div ref={videoRef} className="w-full h-full" />
      </div>
    </div>
  );
}
