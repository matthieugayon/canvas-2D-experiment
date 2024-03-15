import { generateRandomRectangle } from './random';
import { sceneSchema } from './validation';
import { Scene, Size } from '../types/geometry';

describe('validation', () => {
  it('should not throw with valid scene object', () => {
    const canvasSize: Size = { width: 800, height: 600 };
    const rectangle = generateRandomRectangle(canvasSize);
    const scene: Scene = { rectangles: [rectangle], duration: 1 };
    expect(() => sceneSchema.parse(scene)).not.toThrow();
  });

  it('should throw on invalid scene JSON', () => {
    const invalidJson = '{ "rectangles": [ { "position": { "w": 0, "y": 0 }, "size": { "width": 0, "height": 0 }, "angle": 0, "color": "#000000" } ] }';
    const invalidSceneObject = JSON.parse(invalidJson);
    expect(() => sceneSchema.parse(invalidSceneObject)).toThrow();
  });
});