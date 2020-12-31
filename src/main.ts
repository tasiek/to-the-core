import Phaser from 'phaser';
import LRActionControls from './plugins/LRActionControls';
import Ambient from './plugins/Ambient';

import config from './config';

import { 
  Boot,
  Preloader,
  Intro,
  Game,
  GameTimer,
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
  input: {
    gamepad: true,
    touch: true,
    keyboard: true,
    mouse: false
  },
  scene: [
    Boot,
    Preloader,
    Intro,
    Game,
    GameTimer,
  ],
  plugins: {
    scene: [
      { key: 'LRActionControls', plugin: LRActionControls, mapping: 'controls' },
      { key: 'Ambient', plugin: Ambient, mapping: 'ambient' }
    ],
    global: []
  },
  audio: {
      // disableWebAudio: true
  },
  disableContextMenu: true
}

export default new Phaser.Game(gameConfig)
