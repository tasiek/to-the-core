import Phaser from 'phaser';
import { Base } from '~/scenes';
import { AreaBase as Area, AreaTiles, AreaTilesRow } from './AreaBase';


export default class Venue extends Phaser.GameObjects.Graphics {
  
  private area: Area;
  
  constructor( scene: Base, area: Area ) {
    super( scene );
    this.area = area;

    // this._tiles = this.area.getTiles();

    this.scene.add.existing( this.area );
  }

  update( t: number, d: number ): void {
    this.area.update( t, d );
  }

  resizeField() {
    if( this.area ) {
      this.area.resizeField();
    }
  }
}
export { Venue };