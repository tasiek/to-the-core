import Phaser from 'phaser';
import { Base } from '~/scenes';
import { Player } from '~/objects/Player';
import { Venue } from '~/objects/Venue';
import { Area0 } from '~/areas/Area0';

export default class Game extends Base
{
  player?: Player;
  venue?: Venue;

	constructor() {
    super('game');
	}

  resizeField( w: number, h: number ) {
    if (this.player) {
      this.player.resizeField();
    }
    if (this.venue) {
      this.venue.resizeField();
    }
  }

  create(): void {
    this.player = new Player( this );
    this.venue = new Venue( this, new Area0(this) );
  }

  update( t: number, d: number ): void {
    this.player?.update(t, d);
    this.venue?.update(t, d);
  }
}

export { Game };
