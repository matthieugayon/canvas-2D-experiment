import { Point, Rectangle } from '../types/geometry';

export function degreeToRadian(degree: number): number {
  return (degree * Math.PI) / 180;
}

export const drawRectangle = (ctx: CanvasRenderingContext2D, rectangle: Rectangle, rotation: number) => {
  ctx.save();
  ctx.translate(rectangle.position.x, rectangle.position.y);
  ctx.rotate(degreeToRadian((rectangle.angle + rotation) % 360));
  ctx.fillStyle = rectangle.color;
  ctx.fillRect(-rectangle.size.width / 2, -rectangle.size.height / 2, rectangle.size.width, rectangle.size.height);
  ctx.restore();
}

export const isPointInRotatedRectangle = (point: Point, rectangle: Rectangle, rotationIncrement: number): boolean => {
  // Convert the rectangle's rotation angle to radians
  const angle = degreeToRadian((rectangle.angle + rotationIncrement) % 360);

  const { position, size } = rectangle;

  // translate the click to the rectangle's coordinate system
  const x1 = point.x - position.x;
  const y1 = point.y - position.y;

  // rotate the click to the rectangle's original orientation
  const cos = Math.cos(-angle);
  const sin = Math.sin(-angle);
  const x2 = cos * x1 - sin * y1;
  const y2 = sin * x1 + cos * y1;

  // hit test the rectangle
  return x2 >= - size.width / 2 && x2 <= size.width / 2 && y2 >= -size.height / 2 && y2 <= size.height / 2;
}
