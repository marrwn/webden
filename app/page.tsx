'use client';

import { useState } from "react";
import { GameConfig } from "@/types/game";
import { DEFAULT_GAME_CONFIG } from "@/lib/gameConfig";
import GamePreview from "@/components/GamePreview";
import CustomizationPanel from "@/components/CustomizationPanel";
import CodeExporter from "@/components/CodeExporter";
import VideoTutorial from "@/components/VideoTutorial";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [config, setConfig] = useState<GameConfig>(DEFAULT_GAME_CONFIG);

  const handleReset = () => {
    setConfig(DEFAULT_GAME_CONFIG);
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
    } else {
      html.classList.add('dark');
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#F85A5E] to-[#DC2626] rounded-lg shadow-sm" />
              <h1 className="text-xl font-bold tracking-tight">Breakout Customizer</h1>
            </div>
            
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              <Moon className="hidden dark:inline h-5 w-5" />
              <Sun className="inline dark:hidden h-5 w-5" />
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full">
        {/* Intro */}
        <div className="px-6 lg:px-8 pt-8 pb-2">
          <h2 className="text-3xl font-bold mb-2">Design Your Breakout</h2>
          <p className="text-muted-foreground text-lg max-w-3xl">Modify the layout and physics to play and export your own standard breakout configuration natively.</p>
        </div>

        {/* Main Content Vertical Stack */}
        <div className="flex flex-col gap-10 p-6 lg:p-8 max-w-5xl mx-auto">
          
          {/* Top: Game Preview */}
          <div className="w-full flex-col flex h-full">
            <h2 className="text-xl font-bold mb-4">Preview</h2>
            <GamePreview config={config} />
          </div>
          
          {/* Middle: Customization */}
          <div className="w-full h-auto mt-4">
            <CustomizationPanel 
              config={config} 
              onChange={setConfig} 
              onReset={handleReset} 
            />
          </div>

          {/* Bottom: Export */}
          <div className="w-full h-auto mt-4">
            <CodeExporter config={config} />
          </div>
        </div>

        <div className="px-6 lg:px-8 mb-16">
          <div className="w-full h-px bg-border/50 my-10" />
          <VideoTutorial />
        </div>
      </main>

    </div>
  );
}
