import Phaser from 'phaser';
import './style.css'
import { MainScene } from './scenes/MainScene';
import { LoadingScene } from './scenes/LoadingScene';
import { GAME_HEIGHT, GAME_WIDTH } from './config';
import { MainMenuScene } from './scenes/MainMenuScene';
import { UIScene } from './scenes/UIScene';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { EndScene } from './scenes/EndScene';
import { CreditsScene } from './scenes/CreditsScene';



const contextCreationConfig = {
  alpha: true,
  depth: true,
  antialias: true,
  premultipliedAlpha: true,
  stencil: true,
  preserveDrawingBuffer: false,
  failIfMajorPerformanceCaveat: false,
  powerPreference: 'default'
};

const canvas = document.createElement('canvas');
const context = canvas.getContext('webgl2', contextCreationConfig) as CanvasRenderingContext2D

canvas.id = 'game';

document.querySelector('#app')?.appendChild(canvas)

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  mode: Phaser.Scale.NONE,
  canvas,
  context,
  backgroundColor: '#000000',
  scene: [LoadingScene, MainMenuScene, MainScene, UIScene, EndScene, CreditsScene],
  audio: {
    noAudio: true
  },
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI'
      }
    ]
  }
};

new Phaser.Game(config);