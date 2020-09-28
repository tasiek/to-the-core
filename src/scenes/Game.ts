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
      this.player?.resizeField();
    }
    if (this.venue) {
      this.venue?.resizeField();
    }
    if (this.ui) {
      // TODO
    }
  }

  create(): void {
    this.venue = new Venue( this, new Area0(this) );
    this.player = new Player( this );
    this.ui = new GameUI(this);

    this.setupUserInput();
  }

  setupUserInput(): void {
    this.controls.events.on('leftdown', () => {
      this.player?.move( 1 );
    });
    this.controls.events.on('rightdown', () => {
      this.player?.move( -1 );
    });

    this.controls.events.on('actiondown', () => {
      if( !this.isColliding() ) {
        this.venue?.getArea().stepUp();
      }
    });

    this.player?.events.on('moved', ( pos: number ) => {
      this.venue?.onPlayerMoved( pos )
    });
  }

  isColliding(): boolean {
    const playerPos = this.player?.getPosition() || 0;
    const areaLayer = this.venue?.getArea().getCurrentLayer();

    if( !areaLayer || typeof playerPos === typeof undefined ) {
      return false;
    }
    const tile = areaLayer[ Math.round(playerPos*12) ];

    if( tile !== 0 ) {
      this.cameras.main.shake(200, 0.02);
      this.cameras.main.flash(200, 255, 0, 0);
      return true;
    }
    return false;
  }

  update( t: number, d: number ): void {
    // this.player?.update(t, d);
    // this.venue?.update(t, d);
    this.ui?.updateUI( (this.venue?.getStep() || 0) * 10 )
  }
}

export { Game };
