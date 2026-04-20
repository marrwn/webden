import { GameConfig } from '@/types/game';

export const DEFAULT_GAME_CONFIG: GameConfig = {
  // Colors
  ballColor: '#ffffff',
  paddleColor: '#3b82f6', // blue-500
  blockColor: '#ef4444', // red-500
  backgroundColor: '#111827', // gray-900
  
  // Grid
  blockRows: 5,
  blockColumns: 8,
  blockGap: 10,
  
  // Physics
  ballSpeed: 1, // multiplier
  ballRadius: 8,
  paddleWidth: 100,
  paddleHeight: 15,
  gravity: 0,
  friction: 0,
  
  // Canvas
  canvasWidth: 800,
  canvasHeight: 600,
  
  // Animation
  animationStyle: 'smooth',
  particlesEnabled: false,
  
  // Difficulty
  difficulty: 'medium',
  lives: 3,
  scoreMultiplier: 1,
};

export const DIFFICULTY_PRESETS = {
  easy: {
    ballSpeed: 0.8,
    paddleWidth: 150,
    lives: 5,
    scoreMultiplier: 0.5,
  },
  medium: {
    ballSpeed: 1.0,
    paddleWidth: 100,
    lives: 3,
    scoreMultiplier: 1.0,
  },
  hard: {
    ballSpeed: 1.5,
    paddleWidth: 70,
    lives: 1,
    scoreMultiplier: 2.0,
  },
};
