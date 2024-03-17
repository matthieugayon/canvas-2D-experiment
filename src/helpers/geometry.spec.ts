import { isPointInRotatedRectangle } from './geometry';

// Mock data
const rectangle = {
  position: { x: 100, y: 100 },
  size: { width: 50, height: 30 },
  angle: 0,
  color: '#000000',
  drawn: false
};

describe('isPointInRotatedRectangle', () => {
  it('should return true for a point inside the rectangle', () => {
    const point = { x: 105, y: 105 };
    const rotationIncrement = 0;
    expect(isPointInRotatedRectangle(point, rectangle, rotationIncrement)).toBe(true);
  });

  it('should return false for a point outside the rectangle', () => {
    const pointNextToCorner = { x: 126, y: 85 }; // one pixel beside right corner
    const rotationIncrement = 0;
    expect(isPointInRotatedRectangle(pointNextToCorner, rectangle, rotationIncrement)).toBe(false);
  });

  it('should return true for a point exactly on the edge of the rectangle', () => {
    const pointOnEdge = { x: 75, y: 100 }; // On the left edge
    const rotationIncrement = 0;
    expect(isPointInRotatedRectangle(pointOnEdge, rectangle, rotationIncrement)).toBe(true);
  });

  it('should return true for a point exactly on the corner of the rectangle', () => {
    const pointOnCorner = { x: 125, y: 85 }; // right corner
    expect(isPointInRotatedRectangle(pointOnCorner, rectangle, 0)).toBe(true);
  });

  it('should correctly handle the rotated case', () => {
    const point = { x: 125, y: 85 }; // right corner
    const rotationIncrement = 1; // Rotating 1 degree
    expect(isPointInRotatedRectangle(point, rectangle, rotationIncrement)).toBe(false);
  });

  it('should handle rotation increments that result in a full rotation', () => {
    // Point inside, with a rotation increment that effectively doesn't change the rectangle's orientation
    const pointInside = { x: 105, y: 105 };
    const rotationIncrement = 360; // Full rotation, should have no effect
    expect(isPointInRotatedRectangle(pointInside, rectangle, rotationIncrement)).toBe(true);
  });
});
