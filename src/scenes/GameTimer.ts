import { Base, Game } from '~/scenes';
import config from '~/config';

const FLOW_ANIM_DIFF = 0.0; //0.02;
export default class GameTimer extends Base {

  timer: number = 0;
  timeText?: Phaser.GameObjects.Text;

  timerEvent?: Phaser.Time.TimerEvent;
  shape?: Phaser.GameObjects.Graphics;
  graphics?: Phaser.GameObjects.Graphics;
  // gameScene?: Phaser.Scene;

	constructor() {
    super('game_timer');
    
    this.timer = 10;
  }

  create() {
    super.create();

    // const gameScene = this.scene.get('game') as Game;
    this.initGraphics();
    this.startTimer();
  }

  initGraphics() {
    this.initTimerText();
    this.initTimerGraphics();
  }


  initTimerText(): void {
    this.timeText = this.add.text(20, 20, '', { 
      fontFamily: 'Century Gothic, CenturyGothic, AppleGothic, sans-serif', 
      fontSize: `${this.getDimension(0.02)}px`, 
      color: '#FFFFFF'
    })
    .setAlpha(0.5)
    ;
  }

  initTimerGraphics(): void {

    // the actual animated shape (used as a mask)
    this.shape = this.make.graphics({
      x: this.getX(0.5 + FLOW_ANIM_DIFF), 
      y: this.getY(0.5 + FLOW_ANIM_DIFF)
    });
    this.shape.fillStyle(0xFFFFFF);
    this.shape.beginPath();
    this.shape.fillCircle(0, 0, this.getDimension(0.75))
    this.shape.setBlendMode(Phaser.BlendModes.DIFFERENCE);
    const mask = this.shape.createGeometryMask();
    mask.setInvertAlpha(true);

    // const circle = new Phaser.Geom.Circle(400, 300, 160);

    // filler to use mask on 
    this.graphics = this.add.graphics({
      x: 0,
      y: 0
    });
    this.graphics.setMask(mask);
    this.graphics.fillStyle(0x000000);
    this.graphics.fillRect(0, 0, this.getX(1), this.getY(1));

    // this.initTimerGraphicsAnimation();
    this.initParticles();
  }

  initTimerGraphicsAnimation(): void {

    this.tweens.add({
      targets: this.shape,
      props: {
        scale: {
          value: 1.1,
          duration: 4000,
          ease: 'Quad.easeInOut',
        }, 
        x: {
          value: this.getX(0.5 - FLOW_ANIM_DIFF),
          duration: 3000,
          ease: 'Quad.easeInOut',
        },
        y: {
          value: this.getY(0.5 - FLOW_ANIM_DIFF),
          duration: 2000,
          ease: 'Quad.easeInOut',
        }
      },
      delay: 0,
      repeat: -1, // -1: infinity
      yoyo: true
    });
  }

  initParticles() {
    const particles = this.add.particles('particle-1');
    const shape = new Phaser.Geom.Circle(this.getX(0.5), this.getY(0.5), this.getDimension(0.8));
    // const s = this.getDimension(1);  // TODO: particle scale based on resolution
    const emitter = particles.createEmitter({
      moveToX: this.getX(0.5),
      moveToY: this.getY(0.5),
      frequency:  20, 
      lifespan:   { min: 500, max: 1500 },
      alpha:      { start: 1, end: 0, ease: 'Quad.easeIn' },
      speed:      100,
      scale:      { min: 1, max: 2 },
      emitZone:  { type: 'edge', source: shape, quantity: 40  },
      maxParticles: 400,
      quantity: 5,
      maxVelocityX: 100,
      maxVelocityY: 100
    });

  }

  startTimer() {
    this.timerEvent = this.time.addEvent({
      delay: 1000,
      callback: this.onTimerTick.bind(this),
      args: [],
      loop: true,
      startAt: 0,
      timeScale: 1,
      paused: false
    });
  }

  onTimerTick() {
    this.timer--;

    if( this.timer <= 0 ) {
      this.timerEvent?.remove();
    }
  }

  update() {
    this.timeText?.setText( `${this.timer || 0}` )
  }

  resizeField() {

  }
}

export { GameTimer };