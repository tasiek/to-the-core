class Preloader extends Phaser.Scene {

  constructor ()
  {
      super({ key: 'preloader' });
  }

  preload ()
  { 
      const preloadColor = Phaser.Display.Color.HexStringToColor('#FFBF46');

      // just a preload bar in graphics
      let progress = this.add.graphics();
      this.load.on('progress', (value) => {
          progress.clear();
          progress.lineStyle(2, preloadColor.color, 1);
          progress.strokeRect((this.scale.width / 2) - 132, (this.scale.height / 2) - 20, 264, 40);
          progress.fillStyle(preloadColor.color, 1);
          progress.fillRect((this.scale.width / 2) - 128, (this.scale.height / 2) - 16, 256 * value, 32);
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
    this.scene.start('intro');
  }

}

export default Preloader;
export { Preloader };