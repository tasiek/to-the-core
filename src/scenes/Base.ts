import Phaser from 'phaser';
import config from '~/config';

export default class Base extends Phaser.Scene
{
  private nextStarting: boolean = false;

	constructor( config: string | Phaser.Types.Scenes.SettingsConfig ) {
    super( config );
  }

  /**
   * Common for all scenes - fade in
   */
  create() {
    const c = Phaser.Display.Color.ColorToRGBA(config.colors.bg);
    this.cameras.main.fadeIn(config.scenesTransition.time, c.r, c.g, c.b);
  }
  
  /**
   * Get scene x pos by percentage (0..1)
   * @param x 
   */
  getX( x: number ): number {
    return x * this.getDimensions().x;
  }

  /**
   * Get scene y pos by percentage (0..1)
   * @param y 
   */
  getY( y: number ): number {
    return y * this.getDimensions().y;
  }

  /**
   * Get scene dimension by percentage (0..1), based on smaller screen dim
   * @param dim 
   */
  getDimension( dim: number ): number {
    return Math.min( this.getX(dim), this.getY(dim) );
  }

  /**
   * Get scale for element based on desired percentage and current screen dimensions
   * @param perc Target percentage (0..1) size based on smaller screen dimension
   * @param former Original element dimension
   */
  getScale( perc: number, former: number ): number {
    // smaller dimension
    const minDim = Math.min( this.getDimensions().x, this.getDimensions().y );
    return perc * minDim / former;
  }


  /**
   * Get scene center point
   */
  getCenter(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2( 
      this.cameras.main.centerX, 
      this.cameras.main.centerY 
    );
  }

  /**
   * Get scene dimensions
   */
  getDimensions(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2( 
      this.cameras.main.width, 
      this.cameras.main.height 
    )
  }

  /**
   * Start a scene with out effect
   */
  startScene( sceneName: string ): void {
    if (this.nextStarting) {
      return;
    }
    this.nextStarting = true;
    this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(sceneName);
    }, this);

    const c = Phaser.Display.Color.ColorToRGBA(config.colors.bg);
    this.cameras.main.fadeOut(config.scenesTransition.time, c.r, c.g, c.b);
  }
}

export { Base };