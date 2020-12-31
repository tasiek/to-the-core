import { Base } from '~/scenes';
import config from "~/config";

export default class Intro extends Base {

  private textTitle?: Phaser.GameObjects.Text;

	constructor() {
    super('intro');
  }

  create() {
    super.create();

    this.createObjects();
    this.controls.events.once('actiondown', this.tapUp, this);
  }

  createObjects() {
    this.textTitle = this.add.text(
      this.getX(0.5), this.getY(0.5), 
      'To the core',  
      { 
        fontFamily: 'Megrim, Century Gothic, CenturyGothic, AppleGothic, sans-serif', 
        fontSize: `${this.getDimension(0.07)}px`, 
        color: "#FFFFFF"
      }
    )
    .setOrigin(0.5)
    .setAlpha(0.5)
    .setScale(0.8)
    ;

    this.tweens.add({
      targets: this.textTitle,
      props: {
        scale: {
          value: 1.0,
          duration: 3000,
          ease: 'Quad.easeOut'
        },
        alpha: {
          value: 1.0,
          duration: 300,
          ease: 'Quad.easeOut'
        }
      }
    });
  }

  hideObjects() {
    this.tweens.add({
      targets: this.textTitle,
      delay: 0,
      props: {
        scale: {
          value: '*=2',
          duration: config.scenesTransition.time * 2.0,
          ease: 'Quad.easeOut'
        }
        // don't need to animate alpha - scene faded out
      }
    });
  }

  tapUp()
  {
    this.hideObjects();
    this.startScene('game');
  }



}

export { Intro };