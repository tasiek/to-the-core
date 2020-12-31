// based on 
// https://github.com/Quinten/platformer-base/blob/master/src/plugins/SimplePlatformerControls.js

import Phaser from "phaser";

export type ControlsInputMethods = 'keyboard' | 'gamepad' | 'touch';

class LRActionControls extends Phaser.Plugins.ScenePlugin {

  events: Phaser.Events.EventEmitter = new Phaser.Events.EventEmitter();
  input?: Phaser.Input.InputPlugin;
  cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  prefInputMethod: ControlsInputMethods = 'keyboard';

  right: boolean = false;
  left: boolean = false;
  action: boolean = false;


  constructor (scene: Phaser.Scene, pluginManager: Phaser.Plugins.PluginManager) {
    super( scene, pluginManager );
  }

  boot () {
    if ( !this.input ) {
      this.input = this.scene.input;
    }

    this.cursors = this.input.keyboard.createCursorKeys();

    this.input.keyboard.on('keydown', (e) => {
      switch (e.keyCode) {
          case Phaser.Input.Keyboard.KeyCodes.SPACE:
          case Phaser.Input.Keyboard.KeyCodes.UP:
          case Phaser.Input.Keyboard.KeyCodes.DOWN:
              this.action = true;
              this.events.emit('actiondown');
              break;
          case Phaser.Input.Keyboard.KeyCodes.LEFT:
              this.left = true;
              this.events.emit('leftdown');
              break;
          case Phaser.Input.Keyboard.KeyCodes.RIGHT:
              this.right = true;
              this.events.emit('rightdown');
              break;
          case Phaser.Input.Keyboard.KeyCodes.ESC:
              this.events.emit('escdown');
              break;
      }

      this.prefInputMethod = 'keyboard';
    });

    this.input.keyboard.on('keyup', (e) => {
      switch (e.keyCode) {
          case Phaser.Input.Keyboard.KeyCodes.SPACE:
          case Phaser.Input.Keyboard.KeyCodes.UP:
          case Phaser.Input.Keyboard.KeyCodes.DOWN:
              this.action = false;
              this.events.emit('actionup');
              break;
          case Phaser.Input.Keyboard.KeyCodes.LEFT:
              this.left = false;
              this.events.emit('leftup');
              break;
          case Phaser.Input.Keyboard.KeyCodes.RIGHT:
              this.right = false;
              this.events.emit('rightup');
              break;
          case Phaser.Input.Keyboard.KeyCodes.ESC:
              this.events.emit('escup');
              break;
      }
    });


    this.input.gamepad.on('down', (_pad, button, index) => {
      this.events.emit('anydown');
      switch (button.index) {
          case 0: // a 
          case 1: // b
          case 2: // x
          case 3: // y
            this.action = true;
            this.events.emit('actiondown');
            break;
          case 14: // left
            this.left = true;
            this.events.emit('leftdown');
            break;
          case 15: // right
            this.right = true;
            this.events.emit('rightdown');
            break;
      }

      this.prefInputMethod = 'gamepad';
    }, this);

    this.input.gamepad.on('up', (_pad, button, index) => {
      this.events.emit('anyup');
      switch (button.index) {
          case 0: // a 
          case 1: // b
          case 2: // x
          case 3: // y
            this.action = false;
            this.events.emit('actionup');
            break;
          case 14: // left
            this.left = false;
            this.events.emit('leftup');
            break;
          case 15: // right
            this.right = false;
            this.events.emit('rightup');
            break;
      }
      // this.prefInputMethod = 'gamepad';
    }, this);


    const SWIPE_THRESHOLD = 100;
    this.input.on('pointerup', ( pointer ) => {
      if( Math.abs(pointer.upX - pointer.downX) < SWIPE_THRESHOLD ) {
        // this.action = true;
        this.events.emit('actiondown');
      }
      else if( pointer.upX - pointer.downX > SWIPE_THRESHOLD  ) {
        // this.right = true;
        this.events.emit('rightdown');
      }
      else if( pointer.upX - pointer.downX < SWIPE_THRESHOLD  ) {
        // this.left = true;
        this.events.emit('leftdown');
      }
    }, this);
  }
}

export default LRActionControls;