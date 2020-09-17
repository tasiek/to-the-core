import { Base } from "~/scenes";
import { AreaLayer } from "./AreaLayer";

export type AreaTilesRow = number[];
export type AreaTiles = AreaTilesRow[]; // TODO: collection?
export type AreaTheme = "default" | "tbd";

/**
 * Base class for area definition
 */
export default class AreaBase extends Phaser.GameObjects.Graphics {
  protected tiles: AreaTiles = [];
  protected theme: AreaTheme = "default";
  protected layers: AreaLayer[] = [];

  constructor(scene: Base, tiles: AreaTiles) {
    super(scene);

    this.tiles = tiles;

    // TODO: areate and add all layers
    this.getTiles().forEach((row, i) => {
      this.layers.push(new AreaLayer(scene, row));
    });
    this.layers.forEach((layer, i) => {
      layer.setDistance(i + 1);
    });
  }

  getTiles(): AreaTiles {
    return this.tiles;
  }

  getTheme(): AreaTheme {
    return this.theme;
  }

  update(t: number, d: number): void {
    // TODO: update layers
    if (!this.isPaused()) {
      this.layers.forEach((layer, i) => {
        const jumpAmount = 1000;
        const smoothAmount = 500;
        // 10 ms before the jump actually jump but very quickly
        if (t % jumpAmount > smoothAmount) {
          /// slice over time
          const changeInPosition = t % jumpAmount;
          const amountMoved = smoothAmount * (changeInPosition / smoothAmount);

          const firstPosition = i + 1 - (t - (t % jumpAmount)) / 1000 / 2;
          const lastPosition = i + 1 - t / 1000 / 2;

          const percentageAcross =
            (changeInPosition - smoothAmount) / smoothAmount;

          layer.setDistance(firstPosition - amountMoved / 1000 / 2);
        } else {
          layer.setDistance(i + 1 - (t - (t % jumpAmount)) / 1000 / 2);
        }
        // Phaser.Actions.SetScale( layer.getAll(), 1/(i+1) );
      });
    }
  }

  resizeField() {
    this.layers.forEach((layer, i) => {
      layer.resizeField();
    });
  }

  isPaused(): boolean {
    return false; // tmp
  }
}
export { AreaBase };
