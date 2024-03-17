import { generateRandomRectangle } from './random';
import { serializedSceneSchema } from './validation';
import { Scene, Size } from '../types/geometry';

describe('validation', () => {
  it('serializedSceneSchema — should not throw with valid serializedScene object', () => {
    const canvasSize: Size = { width: 800, height: 600 };
    const rectangle = generateRandomRectangle(canvasSize);
    const scene: Scene = { rectangles: [rectangle], duration: 1 };
    expect(() => serializedSceneSchema.parse(scene)).not.toThrow();
  });

  it('serializedSceneSchema — should throw on invalid serializedScene JSON', () => {
    const invalidJson = '{ "rectangles": [ { "position": { "w": 0, "y": 0 }, "size": { "width": 0, "height": 0 }, "angle": 0, "color": "#000000" } ] }';
    const invalidSceneObject = JSON.parse(invalidJson);
    expect(() => serializedSceneSchema.parse(invalidSceneObject)).toThrow();
  });
});