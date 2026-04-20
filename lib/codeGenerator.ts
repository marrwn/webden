import { GameConfig } from '@/types/game';

export function generateHTML(config: GameConfig): string {
  return `<!-- Breakout Game Customizer HTML -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Breakout Game</title>
</head>
<body>
  <div class="game-container">
    <div class="score-board">
      <span>Score: <span id="score">0</span></span>
      <div id="lives-container" class="lives"></div>
    </div>
    
    <div id="start-screen" class="overlay">
      <div class="modal">
        <h2>Click to Start</h2>
      </div>
    </div>
    
    <div id="game-over-screen" class="overlay hidden">
      <h2 class="game-over-text">GAME OVER</h2>
      <p>Click to Restart</p>
    </div>
    
    <div id="game-won-screen" class="overlay hidden">
      <h2 class="game-won-text">YOU WIN!</h2>
      <p>Score: <span id="final-score">0</span></p>
      <p>Click to Play Again</p>
    </div>

    <canvas id="gameCanvas" width="${config.canvasWidth}" height="${config.canvasHeight}"></canvas>
  </div>
</body>
</html>`;
}

export function generateCSS(config: GameConfig): string {
  return `/* Breakout Game CSS styles */
body {
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #000;
  font-family: 'Courier New', Courier, monospace;
}

.game-container {
  position: relative;
  width: ${config.canvasWidth}px;
  height: ${config.canvasHeight}px;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  background: ${config.backgroundColor};
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.score-board {
  position: absolute;
  top: 15px;
  left: 20px;
  right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
  z-index: 10;
}

.score-board > span {
  font-size: 20px;
  font-weight: bold;
  background: rgba(0,0,0,0.7);
  color: #fff;
  padding: 5px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
}

.lives {
  display: flex;
  gap: 8px;
}

.life {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #ef4444;
  box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}

.life.lost {
  background-color: #4b5563;
  transform: scale(0.75);
  opacity: 0.5;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.4);
  backdrop-filter: blur(4px);
  z-index: 20;
  transition: opacity 0.3s;
  pointer-events: none;
}

.overlay.hidden {
  opacity: 0;
}

.modal {
  background: rgba(0,0,0,0.8);
  padding: 15px 30px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 15px 35px rgba(0,0,0,0.7);
}

.overlay h2 {
  color: #fff;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
}

.game-over-text {
  color: #ef4444 !important;
  font-size: 56px;
  font-weight: 900;
  text-shadow: 0 4px 15px rgba(239, 68, 68, 0.5);
  margin-bottom: 5px;
}

.game-won-text {
  color: #22c55e !important;
  font-size: 56px;
  font-weight: 900;
  text-shadow: 0 4px 15px rgba(34, 197, 94, 0.5);
  margin-bottom: 5px;
}

.overlay p {
  color: rgba(255,255,255,0.8);
  font-size: 18px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 10px 0;
  text-align: center;
  font-weight: bold;
}
`;
}

export function generateJavaScript(config: GameConfig): string {
  return `/**
 * Custom Breakout Game
 * Generated using Breakout Customizer
 */

window.addEventListener('DOMContentLoaded', function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  // UI Elements
  const scoreEl = document.getElementById('score');
  const livesContainer = document.getElementById('lives-container');
  const startScreen = document.getElementById('start-screen');
  const gameOverScreen = document.getElementById('game-over-screen');
  const gameWonScreen = document.getElementById('game-won-screen');
  const finalScoreEl = document.getElementById('final-score');

  // Game Configuration
  const config = ${JSON.stringify(config, null, 2)};
  
  // State
  let hasStarted = false;
  let isPlaying = false;
  let score = 0;
  let lives = config.lives;
  let gameOver = false;
  let gameWon = false;
  let animationId;
  
  let state = {
    ball: { x: 0, y: 0, dx: 0, dy: 0 },
    paddle: { x: 0 },
    blocks: []
  };

  function renderLives() {
    livesContainer.innerHTML = '';
    for(let i = 0; i < config.lives; i++) {
      const life = document.createElement('div');
      life.className = 'life ' + (i >= lives ? 'lost' : '');
      livesContainer.appendChild(life);
    }
  }

  function initGame() {
    const padding = config.blockGap;
    const offsetTop = 50;
    const offsetLeft = 30;
    
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

    state.blocks = newBlocks;
    
    state.ball.x = config.canvasWidth / 2;
    state.ball.y = config.canvasHeight - 40;
    
    const startSpeed = 5 * config.ballSpeed;
    state.ball.dx = startSpeed * (Math.random() > 0.5 ? 1 : -1);
    state.ball.dy = -startSpeed;
    
    state.paddle.x = (config.canvasWidth - config.paddleWidth) / 2;

    score = 0;
    scoreEl.innerText = score.toString();
    lives = config.lives;
    renderLives();
    
    gameOver = false;
    gameWon = false;
    isPlaying = false;
    hasStarted = false;
    
    updateScreens();
    draw();
  }

  function updateScreens() {
    startScreen.classList.toggle('hidden', hasStarted);
    gameOverScreen.classList.toggle('hidden', !gameOver);
    gameWonScreen.classList.toggle('hidden', !gameWon);
    if(gameOver || gameWon || !isPlaying) {
      canvas.style.cursor = 'pointer';
    } else {
      canvas.style.cursor = 'none';
    }
  }

  function draw() {
    ctx.clearRect(0, 0, config.canvasWidth, config.canvasHeight);
    
    // Background is CSS but we can paint it to be sure
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, config.canvasWidth, config.canvasHeight);
    
    // Blocks
    const padding = config.blockGap;
    const availableWidth = config.canvasWidth - 60 - (padding * (config.blockColumns - 1));
    const blockW = config.blockWidth || availableWidth / config.blockColumns;
    const blockH = config.blockHeight || 20;
    
    let activeBlocks = 0;
    for (const b of state.blocks) {
      if (b.status === 1) {
        activeBlocks++;
        ctx.beginPath();
        if (config.animationStyle === 'smooth') {
           ctx.rect(b.x, b.y, blockW, blockH);
        } else {
           if(ctx.roundRect) {
             ctx.roundRect(b.x, b.y, blockW, blockH, 5);
           } else {
             ctx.rect(b.x, b.y, blockW, blockH);
           }
        }
        ctx.fillStyle = config.blockColor;
        ctx.fill();
        ctx.closePath();
      }
    }

    if (activeBlocks === 0) {
      gameWon = true;
      isPlaying = false;
      finalScoreEl.innerText = Math.floor(score).toString();
      updateScreens();
      return;
    }

    // Paddle
    ctx.beginPath();
    ctx.rect(state.paddle.x, config.canvasHeight - config.paddleHeight - 10, config.paddleWidth, config.paddleHeight);
    ctx.fillStyle = config.paddleColor;
    ctx.fill();
    ctx.closePath();

    // Ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, config.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = config.ballColor;
    ctx.fill();
    ctx.closePath();
  }

  function loop() {
    if(!isPlaying) return;
    
    draw();
    
    let { x, y, dx, dy } = state.ball;
    const radius = config.ballRadius;
    const paddleH = config.paddleHeight;
    const paddleW = config.paddleWidth;
    
    const targetSpeed = 5 * config.ballSpeed;
    const currentSpeed = Math.sqrt(dx*dx + dy*dy);
    if(currentSpeed > 0 && Math.abs(currentSpeed - targetSpeed) > 0.1) {
      dx = (dx / currentSpeed) * targetSpeed;
      dy = (dy / currentSpeed) * targetSpeed;
    }

    if (x + dx > config.canvasWidth - radius || x + dx < radius) dx = -dx;
    if (y + dy < radius) dy = -dy;
    else if (y + dy > config.canvasHeight - radius - 10 - paddleH) {
      if (x > state.paddle.x && x < state.paddle.x + paddleW) {
        dy = -dy;
        dx = dx + ((x - (state.paddle.x + paddleW/2)) * 0.05);
      } else if (y + dy > config.canvasHeight - radius) {
        lives--;
        renderLives();
        if (lives <= 0) {
          gameOver = true;
          isPlaying = false;
          updateScreens();
          return;
        } else {
          state.ball.x = config.canvasWidth / 2;
          state.ball.y = config.canvasHeight - 40;
          state.ball.dx = 5 * config.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
          state.ball.dy = -5 * config.ballSpeed;
          isPlaying = false;
          updateScreens();
          return;
        }
      }
    }

    const padding = config.blockGap;
    const availableWidth = config.canvasWidth - 60 - (padding * (config.blockColumns - 1));
    const blockW = config.blockWidth || availableWidth / config.blockColumns;
    const blockH = config.blockHeight || 20;

    for (const b of state.blocks) {
      if (b.status === 1) {
        if (x + radius > b.x && x - radius < b.x + blockW && y + radius > b.y && y - radius < b.y + blockH) {
          dy = -dy;
          b.status = 0;
          score += config.scoreMultiplier;
          scoreEl.innerText = Math.floor(score).toString();
        }
      }
    }

    state.ball.x += dx;
    state.ball.y += dy;
    state.ball.dx = dx;
    state.ball.dy = dy;

    animationId = requestAnimationFrame(loop);
  }

  canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const relativeX = (e.clientX - rect.left) * scaleX;
    
    if (relativeX > 0 && relativeX < canvas.width) {
      state.paddle.x = relativeX - config.paddleWidth / 2;
      if (state.paddle.x < 0) state.paddle.x = 0;
      if (state.paddle.x + config.paddleWidth > canvas.width) {
        state.paddle.x = canvas.width - config.paddleWidth;
      }
    }
    
    if(!isPlaying) draw();
  });

  canvas.addEventListener('click', function() {
    if (gameOver || gameWon) {
      initGame();
      hasStarted = true;
      isPlaying = true;
      updateScreens();
      loop();
    } else if (!isPlaying) {
      hasStarted = true;
      isPlaying = true;
      updateScreens();
      loop();
    }
  });

  initGame();

});
`;
}
