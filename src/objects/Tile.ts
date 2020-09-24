import { Base } from '~/scenes';
import { AreaTile } from './Area';
import config from '~/config';


export default class Tile {
  protected baseScene: Base;
  
  constructor( scene: Base, 
    graphics: Phaser.GameObjects.Graphics,
    tile: AreaTile, 
    radius: number,
    fromAngle: number, toAngle: number  
  ) {
    this.baseScene = scene;

    graphics.lineStyle(scene.getDimension(0.02), config.colors.tile1, tile > 0 ? 1 : 0.01);

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