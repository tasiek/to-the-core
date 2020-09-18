
import { Base } from '~/scenes';
import { AreaTilesRow } from './Area';
import { Tile } from './Tile';
import config from '~/config';

/**
 * 
 */
export default class AreaLayer extends Phaser.GameObjects.Container {
  protected tiles: AreaTilesRow;
  protected distance: number;             // not chaning over time
  protected step: number = 0;

  protected targetDistance: number;   // discrete!
  protected currentDistance: number;  // changing while animating

  private baseScene: Base;

  constructor( scene: Base, tiles: AreaTilesRow, distance: number = 1 ) {
    super( scene );

    this.baseScene = scene;
    this.tiles = tiles;
    this.distance = distance;
    this.currentDistance = distance;
    this.targetDistance = distance;

    this.createObjects();
    scene.add.existing( this );
  }

  createObjects() {
    const center = this.baseScene.getCenter();
    const tileAngle = 360.0 / config.tilesPerLayer;

    this.tiles.forEach( (tile, i) => {
      const tileObject = new Tile( 
        this.baseScene, tile, center, this.getRadius(), 
        Phaser.Math.DegToRad(i * tileAngle + 90 - tileAngle/2), 
        Phaser.Math.DegToRad((i+1) * tileAngle + 90 - tileAngle/2), 
      );
      this.scene.add.existing( tileObject );

      this.scene.physics.world.enable( tileObject );
      this.add( tileObject );
    });

    this.distanceUpdated();

    // Phaser.Actions.PlaceOnCircle( this.getAll(), circle, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(270) );
  }

  distanceUpdated() {
    // only show 10 closest layers
    // TODO: prettify
    if( this.currentDistance > 10 || this.currentDistance < -3 ) {
      Phaser.Actions.SetVisible( this.getAll(), false );
    }
    else {
      Phaser.Actions.SetVisible( this.getAll(), true );

      // TODO: scale the whole layer instead?
      const scale = this.currentDistance > 0 ? 1/this.currentDistance : (2 + (-1*this.currentDistance));
      Phaser.Actions.SetScale( 
        this.getAll(),  
        scale
      );
    }
  }

  getRadius(): number {
    // radius for 'zero' distance 
    return this.baseScene.getDimension(0.3);
  }


  update( t: number, d: number ): void {
    if( this.targetDistance != this.currentDistance) {
      const speed = Phaser.Math.GetSpeed(this.targetDistance - this.currentDistance, 0.1);
      this.currentDistance += speed * d;
      this.distanceUpdated();

      if( Math.abs(this.targetDistance - this.currentDistance) < 0.001 ) {
        this.currentDistance = this.targetDistance;
      }
    }
    
  }

  resizeField() {
    // this.setScale( this.baseScene.getScale(0.1, 256) );
    Phaser.Actions.PropertyValueSet( 
      this.getAll(), 'x', this.baseScene.getCenter().x 
    );
    Phaser.Actions.PropertyValueSet( 
      this.getAll(), 'y', this.baseScene.getCenter().y 
    );
  }

  setDistance( d: number ) {
    this.distance = d;
    // this.distanceUpdated();
  }

  setStep( step: number ) {
    this.step = step;
    this.targetDistance = this.distance - this.step;
    console.log(this.targetDistance, this.currentDistance);
  }
}
export { AreaLayer };