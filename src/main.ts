import Phaser from 'phaser';
import EaseMovePlugin from 'phaser3-rex-plugins/plugins/easemove-plugin.js';

import config from './config';

import { 
  Boot,
  Preloader,
  Game
} from './scenes';

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  backgroundColor: config.colors.bg,
  scale: {
    mode: Phaser.Scale.NONE, // we will resize the game with our own code (see Boot.js)
    width: window.innerWidth * window.devicePixelRatio, // set game width by multiplying window width with devicePixelRatio
    height: window.innerHeight * window.devicePixelRatio, // set game height by multiplying window height with devicePixelRatio
    zoom: 1 / window.devicePixelRatio // Set the zoom to the inverse of the devicePixelRatio
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      // debug: true
    }
  },
  input: {
    gamepad: true,
    touch: true,
    keyboard: true
  },
  scene: [
      Boot,
      Preloader,
      Game
  ],
  plugins: {
      global: [
        {
          key: 'rexEaseMove',
          plugin: EaseMovePlugin,
          start: true
        },
      ]
  }
}

export default new Phaser.Game(gameConfig)
