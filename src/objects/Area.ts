import { Base } from '~/scenes';
import { AreaLayer } from './AreaLayer';
import config from '~/config';

export type AreaTile = number;
export type AreaTilesRow = AreaTile[];
export type AreaTiles = AreaTilesRow[];         // TODO: collection?
export type AreaTheme = 'default' | 'tbd';

/**
 * Base class for area definition
 */
export default class Area extends Phaser.GameObjects.Graphics {
  protected baseScene: Base;
  protected tiles: AreaTiles = [];
  protected theme: AreaTheme = 'default';
  protected layers: AreaLayer[] = [];
  protected step: number = 0;

  protected stepsInterval: number = 0;

  constructor( scene: Base, tiles: AreaTiles ) {
    super( scene );

    this.baseScene = scene;
    this.tiles = tiles;

    this.createArea();

    /*
    this.stepsInterval = setInterval( () => {
      // this.stepUp();

      if( this.isEnded() ) {
        clearInterval( this.stepsInterval );
      }
    }, 1500);
    */
  }

  createArea(): void {
    this.getTiles().forEach( (row, i) => {
      this.layers.push( new AreaLayer( this.baseScene, row, i+1 ) );
    });

  }

  getTiles(): AreaTiles {
    return this.tiles;
  }

  getTheme(): AreaTheme {
    return this.theme;
  }

  resizeField() {
    this.layers.forEach( (layer, i ) => {
      layer.resizeField();
    });
  }

  stepUp() {
    this.step++;
    this.stepUpdated();
    this.stepEffect();
  }

  getStep(): number {
    return this.step;
  }

  stepEffect(): void {
    this.baseScene.tweens.addCounter({
      from: 0,
      to: 0.2,
      duration: 100,
      onUpdate: (tween: Phaser.Tweens.Tween) => {
        const tint = Phaser.Display.Color.Interpolate.ColorWithColor(
          Phaser.Display.Color.ValueToColor(config.colors.bg),
          Phaser.Display.Color.ValueToColor(config.colors.tile1),
          1,
          tween.getValue()
        );
        this.baseScene.cameras.main.setBackgroundColor( 
          tint
        ); 
      }, 
      ease: 'Quad.easeInOut',
      yoyo: true
    });
  }

  getCurrentLayer(): AreaTilesRow {
    return this.tiles[this.step];
  }

  stepUpdated() {
    // are we at the end yet?
    if( this.isEnded() ) {
      return;
    }

    this.layers.forEach( (layer, i ) => {
      layer.setStep( this.step );
    });
  }

  onPlayerMoved( pos: number ) {
    this.layers.forEach( (layer, i ) => {
      layer.onPlayerMoved( pos );
    });
  }

  isEnded(): boolean {
    return this.step >= this.layers.length + 1;
  }
}
export { Area };