import { Base } from '~/scenes';
import { AreaLayer } from './AreaLayer';

export type AreaTile = number;
export type AreaTilesRow = AreaTile[];
export type AreaTiles = AreaTilesRow[];         // TODO: collection?
export type AreaTheme = 'default' | 'tbd';

/**
 * Base class for area definition
 */
export default class Area extends Phaser.GameObjects.Graphics {
  protected tiles: AreaTiles = [];
  protected theme: AreaTheme = 'default';
  protected layers: AreaLayer[] = [];
  protected step: number = 0;
  protected stepUpStartTime: number = Date.now();

  protected stepsInterval: number = 0;

  constructor( scene: Base, tiles: AreaTiles ) {
    super( scene );

    this.tiles = tiles;

    // TODO: areate and add all layers
    this.getTiles().forEach( (row, i) => {
      this.layers.push( new AreaLayer( scene, row, i+1 ) );
    });

    this.stepsInterval = setInterval( () => {
      this.stepUp();

      if( this.isEnded() ) {
        clearInterval( this.stepsInterval );
      }
    }, 1500);
  }

  getTiles(): AreaTiles {
    return this.tiles;
  }

  getTheme(): AreaTheme {
    return this.theme;
  }

  update( t: number, d: number ): void {
    if( !this.isEnded() ) {
      this.layers.filter( layer => layer.shouldBeDisplayed() ).forEach( (layer, i ) => {
        layer.update( t, d );
      });
    }
  }

  resizeField() {
    this.layers.forEach( (layer, i ) => {
      layer.resizeField();
    });
  }

  stepUp() {
    this.step++;
    this.stepUpStartTime = Date.now();
    this.stepUpdated();
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

  isEnded(): boolean {
    return this.step >= this.tiles.length + 1;
  }
}
export { Area };