export interface GameConfig {
  // Colors
  ballColor: string;
  paddleColor: string;
  blockColor: string;
  backgroundColor: string;
  
  // Grid
  blockRows: number;
  blockColumns: number;
  blockWidth?: number;
  blockHeight?: number;
  blockGap: number;
  
  // Physics
  ballSpeed: number;
  ballRadius: number;
  paddleWidth: number;
  paddleHeight: number;
  gravity: number;
  friction: number;
  
  // Canvas
  canvasWidth: number;
  canvasHeight: number;
  
  // Animation
  animationStyle: 'smooth' | 'bouncy' | 'elastic';
  particlesEnabled: boolean;
  
  // Difficulty
  difficulty: 'easy' | 'medium' | 'hard';
  lives: number;
  scoreMultiplier: number;
}

export interface WebDenProject {
  uuid: string;
  name: string;
  description: string;
  created: string;
  updated: string;
  data: {
    html: string;
    css: string;
    javascript: string;
  };
}

export interface ExportedCode {
  html: string;
  css: string;
  js: string;
  config: GameConfig;
  generatedAt: Date;
}
