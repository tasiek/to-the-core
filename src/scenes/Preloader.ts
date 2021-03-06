import Base from "~/scenes/Base";
import config from "~/config";

class Preloader extends Base {

  constructor () {
      super('preloader');
  }

  preload ()
  { 
      const preloadColor = Phaser.Display.Color.HexStringToColor('#FFFFFF');

      // just a preload bar in graphics
      let progress = this.add.graphics();
      this.load.on('progress', (value) => {
          progress.clear();
          // progress.lineStyle(2, preloadColor.color, 1);
          // progress.strokeRect(0, (this.scale.height / 2) - 2, this.scale.width, 4);
          progress.fillStyle(preloadColor.color, 1.0 * value);
          progress.fillRect(0, (this.scale.height / 2) - 1, this.scale.width * value, 2);
      });
      this.load.on('complete', () => {
          progress.destroy();
      });

      // Load assets here
      // ...
      this.load.image('player-1', 'assets/images/ShipX_0002_Package.png');
      this.load.image('particle-1', 'assets/images/particle1.png');
      this.load.image('mask-black', 'assets/images/mask-black-1-5.png');  // circle:whole = 1:5

      // music
      this.load.audio('drone1', 'assets/music/drone1.mp3');

      // font
      this.load.rexWebFont({
        google: {
            families: Object.values(config.fonts)
        },
    });

  }

  create ()
  {
    super.create();
    this.startScene('intro');  // intro
  }

}

export default Preloader;
export { Preloader };