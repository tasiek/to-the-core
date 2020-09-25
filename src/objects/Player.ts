import Phaser from 'phaser';
import PathFollower from 'phaser3-rex-plugins/plugins/pathfollower.js';

import { Base } from '~/scenes';
import config from '~/config';


export default class Player extends Phaser.Physics.Arcade.Image
{
  protected cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;

  protected position: number = 0.0;                 // current position (0..1)
  protected baseScene: Base;

  protected pathFollower: PathFollower;
  protected tween?: Phaser.Tweens.Tween;

  constructor( scene: Base ) {
    super( scene, scene.getX(0.5), scene.getY(0.5), 'player-1' );
    this.scene.add.existing( this );
    this.baseScene = scene;

    this.setupUserInput();
    this.initObjects();
  }

  initObjects(): void {
    // cilcular path for the player 
    const path = new Phaser.Curves.Ellipse( 
      this.baseScene.getCenter().x,
      this.baseScene.getCenter().y,
      this.baseScene.getDimension(0.4),
      this.baseScene.getDimension(0.4),
      90,
      450
    )
    this.pathFollower = new PathFollower(this, {
      path: path,           // path object
      t: this.position,     // t: 0~1
      rotateToPath: false
    });

    this.updateScale();
  }
  updateScale(): void {
    this.setScale( this.baseScene.getScale(0.1, 256) );
  }


  /**
   * Sets up user input listeners
   */
  setupUserInput(): void {
    this.scene.controls.events.on('leftdown', () => {
      this.move( 1 );
    });

    this.scene.controls.events.on('rightdown', () => {
      this.move( -1 );
    });
  }

  move( dir: -1 | 1 ): void {
    /*
    if( this.tween && this.tween.isPlaying() ) {
      return;
    }
    */

    const positionDiff = dir / config.tilesPerLayer;
    this.position += positionDiff;
    this.updateDraw( positionDiff );
  }


  /**
   * Draws itself based on current position
   */
  updateDraw( positionDiff: number = 0 ) {
    this.tween = this.scene.tweens.add({
      targets: this.pathFollower,
      t: this.position,
      ease: 'Cubic.out', // 'Cubic', 'Elastic', 'Bounce', 'Back'
      duration: 150,
      delay: 0,
      onComplete: () => {
        // keep going
        /*
        if( this.scene.controls.left ) {
          this.move( 1 );
        }
        else if( this.scene.controls.right ) {
          this.move( -1 );
        }
        */
      }
    });
    this.scene.tweens.add({
      targets: this,
      angle: positionDiff ? `+=${360 * positionDiff}` : 360 * this.position,
      ease: 'Cubic.out',
      duration: 150,
      delay: 0
    });
  }

  resizeField() {
    this.initObjects();
    this.updateScale();
    this.updateDraw();
  }
}

export { Player };