declare module Phaser {
  interface Scene {
    controls: Phaser.Plugins.ScenePlugin & {
      events: Phaser.Events.EventEmitter,

      right: boolean,
      left: boolean,
      action: boolean
    },
    ambient: Phaser.Plugins.ScenePlugin & {
      play: () => void
    }, 
    sfx: Phaser.Plugins.ScenePlugin & {
      play: (key: string, seed?: number) => void
    }
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}