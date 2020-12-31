import Base from "~/scenes/Base";

class Preloader extends Base {

  constructor ()
  {
      super({ key: 'preloader' });
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

      // music
      this.load.audio('drone1', 'assets/music/drone1.mp3');

  }

  create ()
  {
    super.create();
    this.startScene('intro');
  }

}

export default Preloader;
export { Preloader };