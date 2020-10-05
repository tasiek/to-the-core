import Phaser from 'phaser';
import PathFollower from 'phaser3-rex-plugins/plugins/pathfollower.js';

import { Base } from '~/scenes';
import config from '~/config';


export default class Player extends Phaser.Physics.Arcade.Image
{
  public events: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
  protected cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;

  protected position: number = 0;                 // current position (0..tilesPerLayer)
  protected positionTotal: number = 0;            // total position, not wrapped (-Inf..Inf), only used for animation
  protected baseScene: Base;

  protected pathFollower: PathFollower;
  protected tween?: Phaser.Tweens.Tween;

  constructor( scene: Base ) {
    super( scene, scene.getX(0.5), scene.getY(0.5), 'player-1' );
    this.scene.add.existing( this );
    this.baseScene = scene;

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
      t: this.getPositionPerc(),     // t: 0~1
      rotateToPath: false
    });

    this.updateScale();
  }

  updateScale(): void {
    this.setScale( this.baseScene.getScale(0.1, 256) );
  }

  move( dir: -1 | 1 ): void {
    const positionDiff = dir;
    this.positionTotal += positionDiff;
    this.position = Phaser.Math.Wrap( this.positionTotal, 0, config.tilesPerLayer );
    this.updateDraw( positionDiff / config.tilesPerLayer );

    this.events.emit('moved', this.getPositionPerc());
  }


  /**
   * Draws itself based on current position
   */
  updateDraw( positionDiff: number = 0 ) {
    // around
    // note: we use total position, to properly animate object pos on path
    this.tween = this.scene.tweens.add({
      targets: this.pathFollower,
      t: this.getPositionTotalPerc(),
      ease: 'Quad.easeInOut', // 'Cubic', 'Elastic', 'Bounce', 'Back'
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

    // rotate
    // not we use pos difference, as angle is wrapped automatically
    this.scene.tweens.add({
      targets: this,
      angle: positionDiff ? `+=${360 * positionDiff}` : 360 * this.getPositionTotalPerc(),
      ease: 'Quad.easeInOut',
      duration: 150,
      delay: 0
    });
  }

  resizeField() {
    this.initObjects();
    this.updateScale();
    // this.updateDraw();
  }


  /** getters */
  getPosition(): number {
    return this.position;
  }

  getPositionPerc(): number {
    return this.position / config.tilesPerLayer;
  }

  getPositionTotalPerc(): number {
    return this.positionTotal / config.tilesPerLayer;
  }
}

export { Player };