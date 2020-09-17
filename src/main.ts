import Phaser from 'phaser';

import { 
  Boot,
  Preloader,
  Game
} from './scenes';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  backgroundColor: '#575761',
  scale: {
    mode: Phaser.Scale.NONE, // we will resize the game with our own code (see Boot.js)
    width: window.innerWidth * window.devicePixelRatio, // set game width by multiplying window width with devicePixelRatio
    height: window.innerHeight * window.devicePixelRatio, // set game height by multiplying window height with devicePixelRatio
    zoom: 1 / window.devicePixelRatio // Set the zoom to the inverse of the devicePixelRatio
  },
  scene: [
      Boot,
      Preloader,
      Game
  ]
}

export default new Phaser.Game(config)
