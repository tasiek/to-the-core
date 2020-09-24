import { Base } from '~/scenes';
import { Player } from '~/objects/Player';
import { Venue } from '~/objects/Venue';
import { GameUI } from './GameUI';
import { Area0 } from '~/areas/Area0';

export default class Game extends Base
{
  player?: Player;
  venue?: Venue;
  ui?: GameUI;

	constructor() {
    super('game');
  }

  // update all on window resize
  resizeField( w: number, h: number ) {
    if (this.player) {
      this.player.resizeField();
    }
    if (this.venue) {
      this.venue.resizeField();
    }
    if (this.ui) {
      // TODO
    }
  }

  create(): void {
    this.player = new Player( this );
    this.venue = new Venue( this, new Area0(this) );
    this.ui = new GameUI(this);
  }

  update( t: number, d: number ): void {
    // this.player?.update(t, d);
    // this.venue?.update(t, d);
    this.ui?.updateUI( (this.venue?.getStep() || 0) * 10 )
  }
}

export { Game };
