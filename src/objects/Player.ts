import Phaser from 'phaser';
import { Base } from '~/scenes';


export default class Player extends Phaser.GameObjects.Image
{
  cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;

  position: number = 0.0;                 // target position (after user input)
  currentPosition: number = 0.0;          // current position -> what we draw
  
  baseScene: Base;

  constructor( scene: Base ) {
    super( scene, scene.getX(0.5), scene.getY(0.5), 'player-1' );
    this.scene.add.existing( this );
    this.baseScene = scene;

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
        this.position -= 1.0/12;
      }
      else if( e.key === 'ArrowRight' ) {
        this.position += 1.0/12;
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
    if( Phaser.Math.RoundTo( this.position, -3 ) !== Phaser.Math.RoundTo( this.currentPosition, -3 ) ) {
      const distance = this.position - this.currentPosition;
      const speed = Phaser.Math.GetSpeed(distance, 0.1);
      this.currentPosition += speed * d;
      this.updateDraw();
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