
import { Base } from '~/scenes';
import { AreaTilesRow } from './AreaBase';

/**
 * 
 */
export default class AreaLayer extends Phaser.GameObjects.Container {
  protected tiles: AreaTilesRow;
  protected distance: number = 1;

  private baseScene: Base;

  constructor( scene: Base, tiles: AreaTilesRow ) {
    super( scene );

    this.baseScene = scene;
    this.tiles = tiles;

    this.placeObjects();
    scene.add.existing( this );
  }

  placeObjects() {
    const center = this.baseScene.getCenter();

    const tileAngle = 360.0/12;

    // const circle = new Phaser.Geom.Circle(
    //   center.x, center.y, 
    //   this.getRadius()
    // );

    
    this.tiles.forEach( (tile, i) => {
      // const tileObject = this.baseScene.add.ellipse( center.x, center.y, this.baseScene.getX(0.03), this.baseScene.getX(0.03), tile === 1 ? 0xFFFFFF : 0x000000, tile === 0 ? 0 : 1)

      const tileObject = this.baseScene.add.arc(
        center.x, center.y, 
        this.getRadius(), 
        i * tileAngle + 90 - tileAngle/2, (i+1) * tileAngle + 90 - tileAngle/2, 
        false, 
        tile === 1 ? 0xFFFFFF : 0x000000, 
        tile === 0 ? 0 : 1
      );
      this.add( tileObject );
    });
    // Phaser.Actions.PlaceOnCircle( this.getAll(), circle, Phaser.Math.DegToRad(-90), Phaser.Math.DegToRad(270) );
  }

  getRadius(): number {
    return this.baseScene.getDimension(0.3 / this.distance ) ;
  }


  update( t: number, d: number ): void {
    this.updateDraw();
  }

  updateDraw(): void {
    const center = this.baseScene.getCenter();
    Phaser.Actions.SetXY( this.getAll(), center.x, center.y );
    Phaser.Actions.PropertyValueSet( this.getAll(), 'radius', this.getRadius() )
  }

  resizeField() {
    // this.setScale( this.baseScene.getScale(0.1, 256) );
    this.updateDraw();
  }

  setDistance( d: number ) {
    this.distance = d > 0 ? d : 0;
    this.updateDraw();
  }

}
export { AreaLayer };