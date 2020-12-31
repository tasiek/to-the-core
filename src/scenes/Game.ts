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

  // update all on window resize
  resizeField( w: number, h: number ) {
    if (this.player) {
      this.player?.resizeField();
    }
    if (this.venue) {
      this.venue?.resizeField();
    }
  }

  create(): void {
    super.create();

    this.venue = new Venue( this, new Area0(this) );
    this.player = new Player( this );

    this.setupUserInput();
    this.scene.run('game_timer');

    this.ambient.play();
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
    const tile = areaLayer[ playerPos ];

    if( tile !== 0 ) {
      this.cameras.main.shake(200, 0.02);
      this.cameras.main.flash(200, 255, 0, 0);
      return true;
    }
    return false;
  }

  // update( t: number, d: number ): void {}
  
}

export { Game };
