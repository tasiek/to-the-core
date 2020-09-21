
import { Base } from '~/scenes';
import { AreaTilesRow } from './Area';
import { Tile } from './Tile';
import config from '~/config';

const MAX_DISTANCE_VISIBLE = 10;
const ANIM_TIME_SEC = 1.0;
// const easeFunction = Phaser.Tweens.Builders.GetEaseFunction('Quart.easeInOut');

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
  protected targetDistance: number;   // discrete!
  protected currentDistance: number;  // changing while animating
  protected animStartTime: number = performance.now();

  private baseScene: Base;

  constructor( scene: Base, tiles: AreaTilesRow, distance: number = 1 ) {
    super( scene, {
      x: scene.getCenter().x,
      y: scene.getCenter().y
    } );

    this.baseScene = scene;
    this.tiles = tiles;
    this.distance = distance;
    this.currentDistance = distance;
    this.targetDistance = distance;

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
        Phaser.Math.DegToRad((i+1) * tileAngle + 90 - tileAngle/2), 
      );
    });
    this.scene.add.existing( this );

    // set initial visibility and scale
    this.distanceUpdated( true );

    // Phaser.Actions.PlaceOnCircle( this.getAll(), circle, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(270) );
  }

  distanceUpdated( forceRedraw: boolean = false ) {

    // layer not visible anymore - don't bother
    if( !forceRedraw && !this.shouldBeDisplayed() ) {
      return;
    }

    // only show MAX_DISTANCE_VISIBLE closest layers
    if( this.currentDistance > MAX_DISTANCE_VISIBLE ) {
      this.setVisible( false );
    }
    else {
      this.setVisible( true );

      // TODO: scale the whole layer instead?
      // note: for 0..1 it scales up! -> outside layer
      const scale = this.currentDistance >= 0 ? 
        1/this.currentDistance :
        0;

      if( scale > 0 ) {
        // scale animation step
        this.setScale( scale );
      }
      else {
        // already gone - hide
        this.setVisible( false );
      }
      
    }
  }

  update( t: number, d: number ): void {
    if( this.targetDistance != this.currentDistance) {

      const timeDiff = (performance.now() - this.animStartTime) / 1000;
      if( timeDiff < ANIM_TIME_SEC ) {
        // const f = easeFunction( (performance.now() - this.stepUpStartTime)/1000/ANIM_TIME_SEC );
        const f = Phaser.Math.Interpolation.SmootherStep(
          (performance.now() - this.animStartTime)/1000/ANIM_TIME_SEC, 
          0, 
          ANIM_TIME_SEC*1000
        )/1000/ANIM_TIME_SEC;

        this.currentDistance = this.distance - this.step + 1 - f;
        this.distanceUpdated();
      }
      else {
        this.currentDistance = this.targetDistance;
      }
    }
    
  }

  resizeField() {
    this.setX( this.baseScene.getCenter().x );
    this.setY( this.baseScene.getCenter().y );

    this.createObjects();
    this.distanceUpdated( true );
  }

  setStep( step: number ) {
    this.step = step;
    this.animStartTime = performance.now();
    this.targetDistance = this.distance - this.step;
  }

  shouldBeDisplayed(): boolean {
    return this.distance - this.step > -1 && this.distance - this.step < MAX_DISTANCE_VISIBLE;
  }
}
export { AreaLayer };