import { Base, Game } from '~/scenes';
import config from '~/config';

const MASK_WHOLE_TO_CIRCLE = 5;
const FLOW_ANIM_DIFF = 0.0; //0.02;
export default class GameTimer extends Base {

  timer: number = 0;
  timeText?: Phaser.GameObjects.Text;
  timerEvent?: Phaser.Time.TimerEvent;

  particlesEmitterShape?: Phaser.Geom.Circle;
  particlesEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  maskImage?: Phaser.GameObjects.Image;

  maskShapeMask?: Phaser.GameObjects.Graphics;
  maskShapeGraphics?: Phaser.GameObjects.Graphics;

	constructor() {
    super('game_timer');
    
    this.timer = 3;
  }

  create() {
    super.create();

    this.initGraphics();
    // this.startTimer();
  }

  initGraphics() {
    // this.initTimerText();
    this.initTimerGraphics();
    this.updateScales();
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
    // this.initMaskGraphics();
    // this.initTimerGraphicsAnimation();
    this.initMaskGraphicsImage();
    this.initParticles();
  }

  initMaskGraphicsImage(): void {
    this.maskImage = this.add.image(
      0, 0,
      'mask-black'
    )
    ;
  }

  initParticles() {
    const particles = this.add.particles('particle-1');
    this.particlesEmitterShape = new Phaser.Geom.Circle();
    this.particlesEmitter = particles.createEmitter({
      moveToX: this.getX(0.5),
      moveToY: this.getY(0.5),
      lifespan:   { min: 500, max: 3000 },
      frequency:  50, 
      speed:      50,
      maxVelocityX: 50,
      maxVelocityY: 50,
      quantity: 5,
      maxParticles: 500,
      alpha:      { start: 1, end: 0, ease: 'Quad.easeIn' },
    });
  }

  updateScales(): void {
    const DISTANCE_PER_STEP = 0.1;

    this.maskImage
      ?.setScale(
        this.getScale((0.9 + this.timer * DISTANCE_PER_STEP) * MASK_WHOLE_TO_CIRCLE, 1000)
      )
      ?.setPosition(
        this.getX(0.5),
        this.getY(0.5)
      )
    ;

    this.particlesEmitterShape?.setTo( 
      this.getX(0.5), this.getY(0.5), 
      this.getDimension(0.5 + this.timer * DISTANCE_PER_STEP/2) 
    );
    this.particlesEmitter
      ?.setScale({ 
        min: this.getScale(0.15, 128), 
        max: this.getScale(0.20, 128) 
      })
    ;

    this.particlesEmitterShape ? 
      this.particlesEmitter?.setEmitZone(
        { type: 'edge', source: this.particlesEmitterShape, quantity: 50  }
      ).killAll() : null;
  }

  resizeField() {
    this.updateScales();
  }

  /* --------------- */

  initMaskGraphics(): void {

    // the actual animated shape (used as a mask)
    this.maskShapeMask = this.make
      .graphics({
        x: this.getX(0.5 + FLOW_ANIM_DIFF), 
        y: this.getY(0.5 + FLOW_ANIM_DIFF)
      })
      .fillStyle(0xFFFFFF)
      .beginPath()
      .fillCircle(0, 0, this.getDimension(0.75))
      .setBlendMode(Phaser.BlendModes.DIFFERENCE)
    ;
    const mask = this.maskShapeMask.createGeometryMask()
      .setInvertAlpha(true)
    ;

    // const circle = new Phaser.Geom.Circle(400, 300, 160);

    // filler to use mask on 
    this.maskShapeGraphics = this.add
      .graphics({
        x: 0,
        y: 0
      })
      .setMask(mask)
      .fillStyle(0x000000)
      .fillRect(0, 0, this.getX(1), this.getY(1))
    ;
  }

  initTimerGraphicsAnimation(): void {

    this.tweens.add({
      targets: this.maskShapeGraphics,
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
}

export { GameTimer };