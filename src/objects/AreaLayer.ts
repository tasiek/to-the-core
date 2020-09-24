
import { Base } from '~/scenes';
import { AreaTilesRow } from './Area';
import { Tile } from './Tile';
import config from '~/config';

const MAX_DISTANCE_VISIBLE = 10;

/**
 * Represents area layer, 
 * contains a bunch of tiles, 
 * draws and animates itself based on current step
 */
export default class AreaLayer extends Phaser.GameObjects.Graphics {
  protected tiles: AreaTilesRow;
  protected distance: number;         // not chaning over time; 
                                      // kind of index of the layer
  protected step: number = 0;

  private baseScene: Base;

  constructor( scene: Base, tiles: AreaTilesRow, distance: number = 1 ) {
    super( scene, {
      x: scene.getCenter().x,
      y: scene.getCenter().y
    } );

    this.baseScene = scene;
    this.tiles = tiles;
    this.distance = distance;

    this.createObjects();
    scene.add.existing( this );
  }

  createObjects() {
    const tileAngle = 360.0 / config.tilesPerLayer;

    this.clear();
    this.tiles.forEach( (tile, i) => {
      new Tile( 
        this.baseScene, this, tile,
        this.baseScene.getDimension(0.3), 
        Phaser.Math.DegToRad(i * tileAngle + 90 - tileAngle/2), 
        Phaser.Math.DegToRad((i+1) * tileAngle + 90 - tileAngle/2 - 1), 
      );
    });
    this.scene.add.existing( this );

    // set initial visibility and scale
    this.setScale( this.getScale(this.distance) );
    this.setAlpha( this.getAlpha(this.distance) );

    // Phaser.Actions.PlaceOnCircle( this.getAll(), circle, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(270) );
  }

  getScale( distance: number ): number {
    return distance > 0 ? 1/distance : 5;
  }
  getAlpha( distance: number ): number {
    return distance > MAX_DISTANCE_VISIBLE || distance <= 0 ? 0 : 1/distance;
  }

  resizeField() {
    this.setX( this.baseScene.getCenter().x );
    this.setY( this.baseScene.getCenter().y );

    this.createObjects();
    // this.distanceUpdated( true );
  }

  setStep( step: number ) {
    this.step = step;
    const targetDistance = this.distance - this.step;

    this.baseScene.tweens.add({
      targets: this,
      scaleX: this.getScale(targetDistance),
      scaleY: this.getScale(targetDistance),
      alpha: this.getAlpha(targetDistance),
      ease: 'Quad.easeInOut',
      duration: 300,
      delay: 0
    });
    if( targetDistance < 0 ) {
      this.setVisible( false );
    }
    
  }

  shouldBeDisplayed(): boolean {
    return this.distance - this.step > -1 && this.distance - this.step < MAX_DISTANCE_VISIBLE;
  }
}
export { AreaLayer };