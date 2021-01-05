import { Base } from '~/scenes';
import { AreaTile } from './Area';
import config from '~/config';
import { PointOnCircle } from '~/utils';

export default class Tile {
  protected baseScene: Base;
  protected isEmpty: boolean;
  
  constructor( scene: Base, 
    graphics: Phaser.GameObjects.Graphics,
    tile: AreaTile, 
    radius: number,
    fromAngle: number, toAngle: number  
  ) {
    this.baseScene = scene;
    this.isEmpty = tile <= 0;

    graphics.lineStyle(scene.getDimension(0.01), config.colors.tile1, this.isEmpty ? 0.01 : 1);
    graphics.fillStyle(config.colors.tile1, this.isEmpty ? 0.01 : 1);
    graphics.beginPath();
    
    
    this.drawV2( graphics, tile, radius, fromAngle, toAngle );
  }

  /** v1: arcs */
  drawV1(
    graphics: Phaser.GameObjects.Graphics,
    tile: AreaTile, 
    radius: number,
    fromAngle: number, toAngle: number  
  ): void {

    graphics.arc(
      0, 0,
      radius, 
      fromAngle, toAngle, false, 0.02
    );

    graphics.strokePath();
  }


  /** v2: semi-random paths (lines) */
  drawV2(
    graphics: Phaser.GameObjects.Graphics,
    tile: AreaTile, 
    radius: number,
    fromAngle: number, toAngle: number  
  ): void {

    const start = PointOnCircle(
      0, 0,
      radius, fromAngle
    );
    const end = PointOnCircle(
      0, 0,
      radius, toAngle
    );

    graphics.moveTo( start.x, start.y );

    const angleStep = (toAngle - fromAngle)/5;
    const fluct = 8;
    let points: Phaser.Math.Vector2[] = [ start ];
    for( let angle = fromAngle + angleStep; angle <= toAngle - angleStep; angle += angleStep ) {
      const point = PointOnCircle(
        0, 0,
        radius + Phaser.Math.Between(-fluct, fluct), angle
      );
      points.push(point);
    }
    points.push(end);

    for( const point of points ) {
      graphics.lineTo( 
        point.x, 
        point.y
      );
    }

    graphics.strokePath();
  }


  drawV3(
    graphics: Phaser.GameObjects.Graphics,
    tile: AreaTile, 
    radius: number,
    fromAngle: number, toAngle: number  
  ): void {
    
  }
}

export { Tile }