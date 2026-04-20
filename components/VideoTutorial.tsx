'use client';

import React from 'react';
import '@videojs/react/video/skin.css';
import { createPlayer, videoFeatures } from '@videojs/react';
import { VideoSkin, Video } from '@videojs/react/video';

// Setup player with default features
const Player = createPlayer({ features: videoFeatures });

export default function VideoTutorial() {
  return (
    <div className="flex flex-col items-center bg-card p-6 md:p-10 rounded-xl border shadow-sm w-full max-w-5xl mx-auto my-8">
      <h2 className="text-3xl font-bold mb-4 tracking-tight">How to Use the Customizer</h2>
      <p className="text-muted-foreground mb-8 max-w-2xl text-center text-lg">
        Watch this quick tutorial to learn how to customize colors, grid, and physics. Then generate your unique code and import it properly into WebDen!
      </p>
      <div className="w-full rounded-lg overflow-hidden border shadow-sm relative bg-black aspect-video">
        <Player.Provider>
          <VideoSkin>
            <Video src="/videos/tutorial.mp4" playsInline />
          </VideoSkin>
        </Player.Provider>
      </div>
    </div>
  );
}
