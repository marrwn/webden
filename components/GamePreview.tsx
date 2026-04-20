'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameConfig } from '@/types/game';

interface GamePreviewProps {
  config: GameConfig;
}

export default function GamePreview({ config }: GamePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(config.lives);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Game state refs (to avoid strict dependency issues in loop)
  const stateRef = useRef({
    ball: { x: config.canvasWidth / 2, y: config.canvasHeight - 30, dx: 0, dy: 0, radius: config.ballRadius },
    paddle: { x: (config.canvasWidth - config.paddleWidth) / 2, width: config.paddleWidth, height: config.paddleHeight },
    blocks: [] as { x: number, y: number, status: number }[],
    score: 0,
    lives: config.lives,
  });

  const initGame = useCallback(() => {
    // initialize blocks
    const padding = config.blockGap;
    const offsetTop = 50;
    const offsetLeft = 30;
    
    // Calculate block width dynamically to fit available width
    const availableWidth = config.canvasWidth - (offsetLeft * 2) - (padding * (config.blockColumns - 1));
    const blockW = config.blockWidth || availableWidth / config.blockColumns;
    const blockH = config.blockHeight || 20;

    const newBlocks = [];
    for (let c = 0; c < config.blockColumns; c++) {
      for (let r = 0; r < config.blockRows; r++) {
        newBlocks.push({
          x: (c * (blockW + padding)) + offsetLeft,
          y: (r * (blockH + padding)) + offsetTop,
          status: 1
        });
      }
    }

    const startSpeed = 5 * config.ballSpeed;

    stateRef.current = {
      ball: { 
        x: config.canvasWidth / 2, 
        y: config.canvasHeight - 40, 
        dx: startSpeed * (Math.random() > 0.5 ? 1 : -1), 
        dy: -startSpeed, 
        radius: config.ballRadius 
      },
      paddle: { 
        x: (config.canvasWidth - config.paddleWidth) / 2, 
        width: config.paddleWidth, 
        height: config.paddleHeight 
      },
      blocks: newBlocks,
      score: 0,
      lives: config.lives,
    };

    setScore(0);
    setLives(config.lives);
    setGameOver(false);
    setGameWon(false);
    setIsPlaying(false);
  }, [config]);

  // Handle prop changes (restart game or just apply superficial UI updates)
  useEffect(() => {
    initGame();
  }, [initGame]);

  // Main Draw Loop
  const drawAndLoop = useCallback((ctx: CanvasRenderingContext2D) => {
    const st = stateRef.current;
    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Draw Background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);

    // Draw blocks
    const padding = config.blockGap;
    const availableWidth = config.canvasWidth - (60) - (padding * (config.blockColumns - 1));
    const blockW = config.blockWidth || availableWidth / config.blockColumns;
    const blockH = config.blockHeight || 20;

    let activeBlocks = 0;
    for (const b of st.blocks) {
      if (b.status === 1) {
        activeBlocks++;
        ctx.beginPath();
        if (config.animationStyle === 'smooth') {
           ctx.rect(b.x, b.y, blockW, blockH);
        } else {
           ctx.roundRect(b.x, b.y, blockW, blockH, 5);
        }
        ctx.fillStyle = config.blockColor;
        ctx.fill();
        ctx.closePath();
      }
    }

    if (activeBlocks === 0) {
      setGameWon(true);
      setIsPlaying(false);
      return;
    }

    // Draw paddle
    ctx.beginPath();
    ctx.rect(st.paddle.x, config.canvasHeight - st.paddle.height - 10, config.paddleWidth, config.paddleHeight);
    ctx.fillStyle = config.paddleColor;
    ctx.fill();
    ctx.closePath();

    // Draw ball
    ctx.beginPath();
    ctx.arc(st.ball.x, st.ball.y, config.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = config.ballColor;
    ctx.fill();
    ctx.closePath();

    if (!isPlaying) return;

    // Movement and collisions logic
    let { x, y, dx, dy } = st.ball;
    const radius = config.ballRadius;
    const paddleH = config.paddleHeight;
    const paddleW = config.paddleWidth;
    let bSpeed = config.ballSpeed;

    // Adjust dx/dy to maintain constant speed magnitude according to ballSpeed
    const currentSpeed = Math.sqrt(dx*dx + dy*dy);
    const targetSpeed = 5 * bSpeed;
    if (Math.abs(currentSpeed - targetSpeed) > 0.1) {
       dx = (dx / currentSpeed) * targetSpeed;
       dy = (dy / currentSpeed) * targetSpeed;
    }

    // Bounce off walls
    if (x + dx > config.canvasWidth - radius || x + dx < radius) {
      dx = -dx;
    }
    if (y + dy < radius) {
      dy = -dy;
    } else if (y + dy > config.canvasHeight - radius - 10 - paddleH) {
      // Bounce off paddle
      if (x > st.paddle.x && x < st.paddle.x + paddleW) {
        dy = -dy;
        // Optionally add English (spin) based on where it hit
        dx = dx + ((x - (st.paddle.x + paddleW/2)) * 0.05);
      } else if (y + dy > config.canvasHeight - radius) {
        // Lose a life
        st.lives--;
        setLives(st.lives);
        if (st.lives <= 0) {
          setGameOver(true);
          setIsPlaying(false);
          return;
        } else {
          // Reset ball position
          st.ball.x = config.canvasWidth / 2;
          st.ball.y = config.canvasHeight - 40;
          st.ball.dx = 5 * config.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
          st.ball.dy = -5 * config.ballSpeed;
          setIsPlaying(false);
          return;
        }
      }
    }

    // Block Collision
    for (const b of st.blocks) {
      if (b.status === 1) {
        if (x + radius > b.x && x - radius < b.x + blockW && y + radius > b.y && y - radius < b.y + blockH) {
          dy = -dy;
          b.status = 0;
          st.score += config.scoreMultiplier;
          setScore(Math.floor(st.score));
        }
      }
    }

    // Update real ball position
    st.ball.x += dx;
    st.ball.y += dy;
    st.ball.dx = dx;
    st.ball.dy = dy;

    // Continue loop
    requestRef.current = requestAnimationFrame(() => drawAndLoop(ctx));
  }, [isPlaying, config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    // Draw initial frame
    drawAndLoop(ctx);

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(() => drawAndLoop(ctx));
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [drawAndLoop, isPlaying]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      // scale mouse coordinates to canvas resolution
      const scaleX = canvas.width / rect.width;
      const relativeX = (e.clientX - rect.left) * scaleX;
      
      const st = stateRef.current;
      if (relativeX > 0 && relativeX < canvas.width) {
        st.paddle.x = relativeX - config.paddleWidth / 2;
        // Keep paddle in bounds
        if (st.paddle.x < 0) st.paddle.x = 0;
        if (st.paddle.x + config.paddleWidth > canvas.width) {
          st.paddle.x = canvas.width - config.paddleWidth;
        }
      }
      
      // Force draw if not playing to update paddle position visually
      if (!isPlaying) {
        const ctx = canvas.getContext('2d');
        if (ctx) drawAndLoop(ctx);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPlaying, drawAndLoop, config.paddleWidth]);

  return (
    <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border bg-background shadow-xs">
      <canvas
        ref={canvasRef}
        width={config.canvasWidth}
        height={config.canvasHeight}
        className={`w-full h-full block ${isPlaying ? 'cursor-none' : 'cursor-pointer'}`}
        onClick={() => {
          if (gameOver || gameWon) {
            initGame();
            setIsPlaying(true);
          } else if (!isPlaying) {
            setIsPlaying(true);
          }
        }}
      />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-6 right-6 flex justify-between items-start pointer-events-none transition-opacity duration-300 font-mono">
        <div className="flex flex-col">
          <span className="text-lg font-bold bg-background border px-3 py-1 rounded-md text-foreground shadow-sm">Score: {score}</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: config.lives }).map((_, i) => (
            <div 
              key={i}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-300 ${i < lives ? 'bg-red-500 scale-100' : 'bg-muted scale-75 opacity-50'}`}
            />
          ))}
        </div>
      </div>

      {(!isPlaying && !gameOver && !gameWon) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/40 pointer-events-none backdrop-blur-sm transition-all">
          <div className="bg-background px-6 py-3 rounded-md border shadow-sm transition-transform">
            <p className="text-foreground text-sm font-semibold uppercase tracking-wider">Click to Start</p>
          </div>
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 pointer-events-none backdrop-blur-md transition-all">
          <h2 className="text-foreground text-4xl font-bold mb-2">Game Over</h2>
          <p className="text-muted-foreground text-sm uppercase font-semibold tracking-widest">Click to Restart</p>
        </div>
      )}

      {gameWon && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 pointer-events-none backdrop-blur-md transition-all">
          <h2 className="text-foreground text-4xl font-bold mb-2">You Win!</h2>
          <p className="text-foreground text-lg mb-4 font-semibold border px-4 py-1 rounded-md bg-muted">Score: {score}</p>
          <p className="text-muted-foreground text-sm uppercase font-semibold tracking-widest">Click to Play Again</p>
        </div>
      )}
    </div>
  );
}
