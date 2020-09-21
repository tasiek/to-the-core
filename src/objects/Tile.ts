import { Base } from '~/scenes';
import { AreaTile } from './Area';
import config from '~/config';


export default class Tile {
  
  constructor( scene: Base, 
    graphics: Phaser.GameObjects.Graphics,
    tile: AreaTile, 
    radius: number,
    fromAngle: number, toAngle: number  
  ) {
    // super( scene, {
    //   x: center.x,
    //   y: center.y
    // } );

    graphics.lineStyle(30, config.colors.tile1, tile > 0 ? 1 : 0.1);

    graphics.beginPath();
    graphics.arc(
      0, 0,
      radius, 
      fromAngle, toAngle, false, 0.02
    );
    graphics.strokePath();
    graphics.closePath();
    
  }
}

export { Tile }