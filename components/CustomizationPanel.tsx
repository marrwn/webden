import React from 'react';
import { GameConfig } from '@/types/game';
import ColorPicker from './ColorPicker';
import SliderControl from './SliderControl';
import { RotateCcw, Palette, Grid, Zap, Sparkles } from 'lucide-react';
import { DIFFICULTY_PRESETS } from '@/lib/gameConfig';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface CustomizationPanelProps {
  config: GameConfig;
  onChange: (config: GameConfig) => void;
  onReset: () => void;
}

export default function CustomizationPanel({ config, onChange, onReset }: CustomizationPanelProps) {
  const handleChange = (key: keyof GameConfig, value: any) => {
    onChange({ ...config, [key]: value });
  };

  const handleDifficulty = (diff: 'easy'|'medium'|'hard') => {
    const preset = DIFFICULTY_PRESETS[diff];
    onChange({
      ...config,
      difficulty: diff,
      ballSpeed: preset.ballSpeed,
      paddleWidth: preset.paddleWidth,
      lives: preset.lives,
      scoreMultiplier: preset.scoreMultiplier
    });
  };

  return (
    <div className="space-y-6 flex flex-col h-full w-full">
      <div className="flex flex-row items-center justify-between pb-2">
        <div>
          <h2 className="text-xl font-bold">Preferences</h2>
        </div>
        <Button variant="outline" size="sm" onClick={onReset} className="h-8 shadow-xs">
          <RotateCcw className="mr-2 h-3.5 w-3.5" />
          Reset
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto w-full custom-scrollbar pr-4">
        <div className="flex flex-col space-y-8">
          
          {/* Colors */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
              <Palette size={20} /> Colors
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <ColorPicker label="Ball Color" value={config.ballColor} onChange={(c) => handleChange('ballColor', c)} />
              <ColorPicker label="Paddle Color" value={config.paddleColor} onChange={(c) => handleChange('paddleColor', c)} />
              <ColorPicker label="Blocks Color" value={config.blockColor} onChange={(c) => handleChange('blockColor', c)} />
              <ColorPicker label="Background" value={config.backgroundColor} onChange={(c) => handleChange('backgroundColor', c)} />
            </div>
          </div>

          {/* Grid Layout */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
              <Grid size={20} /> Grid Configuration
            </h2>
            <div className="space-y-6 pt-2">
              <SliderControl label="Rows" min={3} max={8} step={1} value={config.blockRows} onChange={(v) => handleChange('blockRows', v)} />
              <SliderControl label="Columns" min={4} max={10} step={1} value={config.blockColumns} onChange={(v) => handleChange('blockColumns', v)} />
              <SliderControl label="Block Gap" min={0} max={20} step={2} value={config.blockGap} onChange={(v) => handleChange('blockGap', v)} />
            </div>
          </div>

          {/* Physics */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
              <Zap size={20} /> Physics & Mechanics
            </h2>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <span className="text-sm font-medium text-foreground">Difficulty Preset</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['easy', 'medium', 'hard'] as const).map(diff => (
                    <Button 
                      key={diff} 
                      variant={config.difficulty === diff ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleDifficulty(diff)}
                      className="capitalize"
                    >
                      {diff}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">Adjusts speed, paddle width, and lives.</p>
              </div>
              
              <Separator />
              
              <div className="space-y-6 pt-2">
                <SliderControl label="Ball Speed" min={0.5} max={2.5} step={0.1} value={config.ballSpeed} onChange={(v) => handleChange('ballSpeed', v)} />
                <SliderControl label="Paddle Width" min={50} max={200} step={10} value={config.paddleWidth} onChange={(v) => handleChange('paddleWidth', v)} />
              </div>
            </div>
          </div>

          {/* Aesthetics */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 border-b pb-2">
              <Sparkles size={20} /> Aesthetics
            </h2>
            <div className="space-y-2 pt-2">
              <span className="text-sm font-medium text-foreground">Block Style</span>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant={config.animationStyle === 'smooth' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleChange('animationStyle', 'smooth')}
                >
                  Sharp Edges
                </Button>
                <Button 
                  variant={config.animationStyle === 'bouncy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleChange('animationStyle', 'bouncy')}
                >
                  Rounded Edges
                </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
