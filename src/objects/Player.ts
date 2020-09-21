import Phaser from 'phaser';
import { Base } from '~/scenes';
import config from '~/config';


const ANIM_TIME_SEC = 0.15;

export default class Player extends Phaser.Physics.Arcade.Image
{
  protected cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;

  protected position: number = 0.0;                 // current (former) position
  protected targetPosition: number = 0.0;           // target position (after user input)
  protected currentPosition: number = 0.0;          // current position -> what we draw
  protected baseScene: Base;

  protected animStartTime: number = performance.now();

  constructor( scene: Base ) {
    super( scene, scene.getX(0.5), scene.getY(0.5), 'player-1' );
    this.scene.add.existing( this );
    this.baseScene = scene;

    scene.physics.world.enable(this);
    this.setupUserInput();
    this.resizeField();
  }

  /**
   * Sets up user input listeners
   */
  setupUserInput(): void {
    this.cursorKeys = this.scene.input.keyboard.createCursorKeys();
    this.scene.input.keyboard.on('keydown', (e: KeyboardEvent) => {
      if( e.key === 'ArrowLeft' ) {
        this.position = this.currentPosition;
        this.targetPosition -= 1.0 / config.tilesPerLayer;
        this.animStartTime = performance.now();
      }
      else if( e.key === 'ArrowRight' ) {
        this.position = this.currentPosition;
        this.targetPosition += 1.0 / config.tilesPerLayer;
        this.animStartTime = performance.now();
      }
    });
  }

  /**
   * Updates current position based on (target) position, 
   * then calls redraw (if it changed)
   * @param t 
   * @param d 
   */
  update( t: number, d: number ): void {
    if( Math.abs(this.targetPosition - this.currentPosition) >= 0.001 ) {  // animate towards target pos
      // const distance = this.position - this.currentPosition;
      // const speed = Phaser.Math.GetSpeed(distance, 0.1);
      // this.currentPosition += speed * d;

      const timeDiff = (performance.now() - this.animStartTime) / 1000;
      if( timeDiff < ANIM_TIME_SEC ) {
        const f = Phaser.Math.Interpolation.SmootherStep(
          (performance.now() - this.animStartTime)/1000/ANIM_TIME_SEC, 
          0, 
          ANIM_TIME_SEC*1000
        )/1000/ANIM_TIME_SEC;

        // TODO: helper
        // AnimationHelper.getAnimationStep( this.startPosition, this.targetPosition, this.animationStartTime )
        this.currentPosition = this.position + f * (this.targetPosition - this.position);
      }
      this.updateDraw();
    }
    else if( this.position !== this.targetPosition ) {
      this.position = this.targetPosition;
      this.currentPosition = this.targetPosition;
    }

    // Phaser.Actions.RotateAroundDistance([this], { x: this.scene.cameras.main.centerX, y: this.scene.cameras.main.centerY }, 0.02, 200);

  }

  /**
   * Draws itself based on current position
   */
  updateDraw() {
    const minDim = Math.min( this.scene.cameras.main.width, this.scene.cameras.main.height );

    this.x = this.baseScene.getCenter().x + 
      minDim * 0.4 * Math.sin( 2*Math.PI * this.currentPosition );
    this.y = this.baseScene.getCenter().y + 
      minDim * 0.4 * Math.cos( 2*Math.PI * this.currentPosition );

    this.setRotation( - 2*Math.PI * this.currentPosition );
  }

  resizeField() {
    this.setScale( this.baseScene.getScale(0.1, 256) );
    this.updateDraw();
  }
}

export { Player };