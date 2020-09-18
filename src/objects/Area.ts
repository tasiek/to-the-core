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

  constructor( scene: Base, tiles: AreaTiles ) {
    super( scene );

    this.tiles = tiles;

    // TODO: areate and add all layers
    this.getTiles().forEach( (row, i) => {
      this.layers.push( new AreaLayer( scene, row, i+1 ) );
    });

    setInterval( () => {
      this.step++;
      this.stepUpdated();
    }, 1500);
  }

  getTiles(): AreaTiles {
    return this.tiles;
  }

  getTheme(): AreaTheme {
    return this.theme;
  }

  update( t: number, d: number ): void {
    this.layers.forEach( (layer, i ) => {
      layer.update( t, d );
    });
  }

  resizeField() {
    this.layers.forEach( (layer, i ) => {
      layer.resizeField();
    });
  }

  stepUpdated() {
    this.layers.forEach( (layer, i ) => {
      layer.setStep( this.step );
    });
  }
  
  /*
  getAllColliders(): Phaser.GameObjects.GameObject[] {
    return (new Array<Phaser.GameObjects.GameObject>()).concat.apply([], this.layers.map( layer => layer.getAll() ));
  }*/
}
export { Area };