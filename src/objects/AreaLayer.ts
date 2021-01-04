
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
  protected subtleTweenCenterMovement?: {
    x: Phaser.Tweens.Tween,
    y: Phaser.Tweens.Tween
  };

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
    
    /*
    this.fillStyle( this.getCurrentFillColor() );
    this.fillCircle(
      0, 0,
      this.baseScene.getDimension(0.3)
    );
    */
    
    
    this.tiles.forEach( (tile, i) => {
      new Tile( 
        this.baseScene, this, tile,
        this.baseScene.getDimension(0.3), 
        Phaser.Math.DegToRad(i * tileAngle + 90 - tileAngle/2), 
        Phaser.Math.DegToRad((i+1) * tileAngle + 90 - tileAngle/2), 
      );
    });
    this.scene.add.existing( this );
    

   /* // tests - webgl only
    const radius = this.baseScene.getDimension(0.3) * this.getCurrentScale();
    const circle = new Phaser.Geom.Circle(
      this.baseScene.getX(0.5), 
      this.baseScene.getY(0.5), 
      radius,
    );
    const tiles = this.baseScene.add.group({ key: 'brick', repeat: 11 })
      .setTint( 
        config.colors.tile1,
        config.colors.tile1,
        config.colors.bg,
        config.colors.bg,
      )
      .setBlendMode(Phaser.BlendModes.DIFFERENCE)
    ;
    tiles.children.iterate( t => {
      (t as Phaser.GameObjects.Sprite)
        .setScale( 0.7 * this.getCurrentScale() )
        .setAlpha( this.getAlpha(this.distance) );
      ;
    });
    Phaser.Actions.PlaceOnCircle( 
      tiles.getChildren(), 
      circle,  
      Phaser.Math.DegToRad(90),
      Phaser.Math.DegToRad(360 + 90),
    );
    Phaser.Actions.SetRotation(tiles.getChildren(), 0, 1/12*2*Math.PI);
    */
    /* /// tests - webgl only */

    
    // set initial values
    this.setX( this.getCurrentCenter().x );
    this.setY( this.getCurrentCenter().y );
    this.setScale( this.getScale(this.distance) );
    this.setAlpha( this.getAlpha(this.distance) );

    /* subtle movement - note: collides with center shifting
        TODO: manual tween */
    /*
    this.baseScene.tweens.add({
      targets: this,
      ease: 'Quad.easeInOut', 
      yoyo: true,
      repeat: -1,
      props: {
        x: {
          value: `+=${Phaser.Math.Between(-10, 10)}`,
          duration: Phaser.Math.Between(2000, 5000),
        },
        y: {
          value: `+=${Phaser.Math.Between(-10, 10)}`,
          duration: Phaser.Math.Between(2000, 5000),
        }
      }
    })
    */
  }

  createSubtleMovements(): void {
    this.subtleTweenCenterMovement = {
      x: this.baseScene.tweens.addCounter({
        ease: 'Quad.easeInOut', 
        yoyo: true,
        repeat: -1,
        from: 0,
        to: Phaser.Math.Between(
          - this.baseScene.getDimension(0.01), 
          this.baseScene.getDimension(0.01)
        )
      }),
      y: this.baseScene.tweens.addCounter({
        ease: 'Quad.easeInOut', 
        yoyo: true,
        repeat: -1,
        from: 0,
        to: Phaser.Math.Between(
          - this.baseScene.getDimension(0.01), 
          this.baseScene.getDimension(0.01)
        )
      })
    }
  }
  

  getScale( distance: number ): number {
    return distance > 0 ? 1/distance : 5;
  }
  getCurrentScale(): number {
    return this.getScale( this.distance - this.step );
  }

  getAlpha( distance: number ): number {
    return distance > MAX_DISTANCE_VISIBLE || distance <= -1 ? 0 : 1/distance;
  }

  getCurrentCenter( playerPos: number = 0 ): Phaser.Math.Vector2 { // TODO: not an arg
    return new Phaser.Math.Vector2(
      this.baseScene.getCenter().x + 
        8 * Math.cos(2*Math.PI*playerPos-Math.PI/2) * 
        1/this.getCurrentScale(),
      this.baseScene.getCenter().y + 
        8 * Math.sin(2*Math.PI*playerPos-Math.PI/2) * 
        1/this.getCurrentScale(),
    );
  }

  getCurrentFillColor(): number {
    return Phaser.Display.Color.ValueToColor(0x1F1300)
      .lighten(10 / this.getCurrentScale())
      .color;
  }

  resizeField() {
    this.setX( this.baseScene.getCenter().x );
    this.setY( this.baseScene.getCenter().y );

    this.createObjects();
  }

  setStep( step: number ) {
    this.step = step;
    const targetDistance = this.distance - this.step;

    this.baseScene.tweens.add({
      targets: this,
      scaleX: this.getCurrentScale(),
      scaleY: this.getCurrentScale(),
      alpha: this.getAlpha(targetDistance),
      ease: 'Quad.easeInOut',
      duration: 300,
      delay: 0
    });
    if( targetDistance < -1 ) {
      this.setVisible( false );
    }
  }

  onPlayerMoved( pos: number ): void {
    this.baseScene.tweens.add({
      targets: this,
      x: this.getCurrentCenter(pos).x,
      y: this.getCurrentCenter(pos).y,
      duration: 300,
      ease: 'Quad.easeInOut',
    });
  }
}
export { AreaLayer };