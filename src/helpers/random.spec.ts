import { generateRandomRectangle } from './random';
import { Size } from '../types/geometry';

describe('generateRandomRectangle', () => {
  it('should always generate a rectangle contained within the canvas bounds', () => {
    const canvasSize: Size = { width: 800, height: 600 };
    const testIterations = 1000;

    for (let i = 0; i < testIterations; i++) {
      const rectangle = generateRandomRectangle(canvasSize);

      // Calculate the maximum extent from the center to a corner of the rectangle
      // i.e half of the diagonal of the rectangle
      const halfDiagonal = Math.sqrt((rectangle.size.width / 2) ** 2 + (rectangle.size.height / 2) ** 2);

      // Calculate the furthest extents of the rectangle from its center
      const leftMost = rectangle.position.x - halfDiagonal;
      const rightMost = rectangle.position.x + halfDiagonal;
      const topMost = rectangle.position.y - halfDiagonal;
      const bottomMost = rectangle.position.y + halfDiagonal;

      // Assert that none of these extents go outside the canvas
      expect(leftMost).toBeGreaterThanOrEqual(0);
      expect(rightMost).toBeLessThanOrEqual(canvasSize.width);
      expect(topMost).toBeGreaterThanOrEqual(0);
      expect(bottomMost).toBeLessThanOrEqual(canvasSize.height);
    }
  });
});