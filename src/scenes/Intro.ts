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
    .setAlpha(0.5)
    .setOrigin(0.5)
    .setScale(0.8)
    ;

    this.tweens.add({
      targets: this.textTitle,
      ease: 'Quad.easeOut',
      duration: 6000,
      delay: 0,
      props: {
        scale: {
          value: 1.0,
          duration: 5000
        },
        alpha: {
          value: 0.8,
          duration: 800
        }
      }
    });
  }

  hideObjects() {
    this.tweens.add({
      targets: this.textTitle,
      ease: 'Quad.easeIn',
      delay: 0,
      props: {
        scale: {
          value: 2.0,
          duration: config.scenesTransition.time
        },
        alpha: {
          value: 0.0,
          duration: config.scenesTransition.time
        }
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