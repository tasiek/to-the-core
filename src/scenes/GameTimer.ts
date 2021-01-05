import { Base, Game } from '~/scenes';
import config from '~/config';

const MASK_WHOLE_TO_CIRCLE = 5;
export default class GameTimer extends Base {

  particlesConfig = {
    quantity: 50,   // number of particles on circle
    speed: 80,      // lower -> slower (px/sec?)
    frequency: 250, // delay between particles shoot
    lifespan: {     // time of life for single particle - random
      min: 500,
      max: 1500
    }
  };

  timer: number = 0;
  timeText?: Phaser.GameObjects.Text;

  particles?: Phaser.GameObjects.Particles.ParticleEmitterManager; 
  particlesEmitterShape?: Phaser.Geom.Circle;
  particlesEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;
  maskImage?: Phaser.GameObjects.Image;
  maskShapeMask?: Phaser.GameObjects.Graphics;
  maskShapeGraphics?: Phaser.GameObjects.Graphics;

	constructor() {
    super('game_timer');
    
    this.timer = 20 * 1000;
  }

  create() {
    super.create();

    this.initGraphics();
    this.startTimer();
  }

  startTimer() {
    this.tweens.addCounter({
      from: this.timer,
      to: 0,
      duration: this.timer,
      
      onUpdate: (tween: Phaser.Tweens.Tween) => {
        if( Math.abs(this.timer - tween.getValue()) >= 1000  ) {  // optimize - only update once per second
          this.timer = tween.getValue();
          this.updateScales();
          console.log(tween.getValue());
        }
      },
      // time's over!
      onComplete: (tween: Phaser.Tweens.Tween) => {
        // tmp
        this.cameras.main.flash(1000, 127, 18, 125);
      },
    });
  }

  initGraphics() {
    this.initTimerGraphics();
    this.updateScales();
  }

  initTimerGraphics(): void {
    this.initMaskGraphicsImage();
    this.initParticles();
  }

  initMaskGraphicsImage(): void {
    this.maskImage = this.add.image(
      0, 0,
      'mask-black'
    )
    // .setVisible(false)
    ;
  }

  initParticles() {
    this.particles = this.add.particles('particle-1');
    this.particlesEmitterShape = new Phaser.Geom.Circle();
    this.particlesEmitter = this.particles.createEmitter({
      moveToX: this.getX(0.5),
      moveToY: this.getY(0.5),
      lifespan:   { 
        min: this.particlesConfig.lifespan.min, 
        max: this.particlesConfig.lifespan.max 
      },
      frequency:  this.particlesConfig.frequency, 
      speed:      this.particlesConfig.speed,
      maxVelocityX: this.particlesConfig.speed,
      maxVelocityY: this.particlesConfig.speed,
      quantity: this.particlesConfig.quantity,
      maxParticles: 400,
      alpha:      { start: 1, end: 0 }
    });
  }

  updateScales(): void {
    const DISTANCE_PER_STEP = 0.05;

    const t = this.timer / 1000;

    // mask (black cover) 
    this.maskImage
      ?.setScale(
        this.getScale((0.9 + t * DISTANCE_PER_STEP) * MASK_WHOLE_TO_CIRCLE, 1000)
      )
      ?.setPosition(
        this.getX(0.5),
        this.getY(0.5)
      )
    ;

    // emitter circle
    this.particlesEmitterShape?.setTo( 
      this.getX(0.5), this.getY(0.5), 
      this.getDimension(0.55 + t * DISTANCE_PER_STEP/2) 
    );
    // particles
    this.particlesEmitter
      // particle size with some randomness
      // + based on emitter radius: further -> larger
      ?.setScale({ 
        min: this.getScale(0.20, 128) + t * DISTANCE_PER_STEP, 
        max: this.getScale(0.3, 128) + t * DISTANCE_PER_STEP
      })
    ;

    // just update emitter
    this.particlesEmitter?.pause();
    this.particlesEmitterShape && 
      this.particlesEmitter?.setEmitZone(
        { 
          type: 'edge', 
          source: this.particlesEmitterShape, 
          quantity: this.particlesConfig.quantity
        }
      );
      this.particlesEmitter?.resume();

  }

  resizeField() {
    this.updateScales();
  }


  /* unused --------------- */

  initTimerText(): void {
    this.timeText = this.add.text(20, 20, '', { 
      fontFamily: 'Century Gothic, CenturyGothic, AppleGothic, sans-serif', 
      fontSize: `${this.getDimension(0.02)}px`, 
      color: '#FFFFFF'
    })
    .setAlpha(0.5)
    ;
  }
}

export { GameTimer };