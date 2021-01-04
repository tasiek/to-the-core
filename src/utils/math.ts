export const PointOnCircle = (
  centerX: number,
  centerY: number,
  radius: number, 
  angle: number
): Phaser.Math.Vector2 => {

  return new Phaser.Math.Vector2(
    radius * Math.cos(angle), 
    radius * Math.sin(angle)
  );
}