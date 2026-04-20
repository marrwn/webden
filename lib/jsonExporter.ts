import { GameConfig, WebDenProject } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';
import { generateHTML, generateCSS, generateJavaScript } from './codeGenerator';

export function generateWebDenJSON(config: GameConfig): WebDenProject {
  const html = generateHTML(config);
  const css = generateCSS(config);
  const js = generateJavaScript(config);
  
  const now = new Date().toISOString();

  return {
    uuid: uuidv4(),
    name: "Breakout Game - Custom",
    description: "Auto-generated Breakout game from Breakout Customizer",
    created: now,
    updated: now,
    data: {
      html,
      css,
      javascript: js,
    }
  };
}
