import Phaser from 'phaser';
import { Base } from '~/scenes';
import { Area } from './Area';


export default class Venue extends Phaser.GameObjects.Graphics {
  
  private area: Area;
  
  constructor( scene: Base, area: Area ) {
    super( scene );
    this.area = area;

    this.scene.add.existing( this.area );
  }

  update( t: number, d: number ): void {

  }

  resizeField() {
    if( this.area ) {
      this.area.resizeField();
    }
  }

  getStep(): number {
    return this.area.getStep();
  }
}
export { Venue };