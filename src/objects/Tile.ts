import { Base } from '~/scenes';
import { AreaTile } from './Area';
import config from '~/config';

// note: draws itself on distance '0' (player path radius),
// then it's scaled in AreaLayer

export default class Tile extends Phaser.GameObjects.Graphics {
  
  constructor( scene: Base, 
    tile: AreaTile, 
    center: Phaser.Math.Vector2, radius: number,
    fromAngle: number, toAngle: number  
  ) {
    super( scene, {
      x: center.x,
      y: center.y
    } );

    this.lineStyle(20, config.colors.tile1, tile > 0 ? 1 : 0.1);

    this.beginPath();
    this.arc(
      0, 0,
      radius, 
      fromAngle, toAngle, false, 0.02
    );
    this.strokePath();
    this.closePath();
    
  }
}

export { Tile }