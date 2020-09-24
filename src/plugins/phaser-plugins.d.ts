declare module Phaser {
  interface Scene {
    controls: Phaser.Plugins.ScenePlugin & {
      events: Phaser.Events.EventEmitter,

      right: boolean,
      left: boolean,
      action: boolean
    }
  }
}