import { Base } from '~/scenes';

export default class GameUI
{
  protected pointsText: Phaser.GameObjects.Text;

	constructor( scene: Base ) {

    this.pointsText = scene.add.text(20, 20, '', 
      { 
        fontFamily: 'Century Gothic, CenturyGothic, AppleGothic, sans-serif', 
        fontSize: scene.getDimension(0.02), 
        color: '#FFFFFF', 
        fontWeight: 'thin' 
      }
    )
    .setAlpha(0.5)
    ;
  }

  updateUI( points: number ): void {
    this.pointsText.setText( `${points || 0}` )
  }
}

export { GameUI };