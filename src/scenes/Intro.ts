import { Base } from '~/scenes';

export default class Intro extends Base {

	constructor() {
    super('intro');
  }

  create() {
    super.create();
    this.createIntroText();

    this.controls.events.once('actiondown', this.tapUp, this);
  }

  createIntroText() {
    this.add.text(
      this.getX(0.5), this.getY(0.5), 
      'To the core',  
      { 
        fontFamily: 'Megrim, Century Gothic, CenturyGothic, AppleGothic, sans-serif', 
        fontSize: `${this.getDimension(0.05)}px`, 
        color: '#FFFFFF'
      }
    )
    .setAlpha(0.8)
    .setOrigin(0.5)
    ;
  }

  tapUp()
  {
    this.startScene('game');
  }

}

export { Intro };