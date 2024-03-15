import { create } from 'zustand';
import { Point, Rectangle, Scene } from './types/geometry';
import { generateRandomRectangle, randomColor } from './helpers/random';
import { drawRectangle, isPointInRotatedRectangle } from './helpers/geometry';

interface SceneApi {
  ctx: CanvasRenderingContext2D | null;
  rectangles: Rectangle[];
  duration: number;
  animating: boolean;
  rotationIncrement: number;

  setContext: (context: CanvasRenderingContext2D) => void;
  addRectangle: () => void;
  changeRectangleColor: (rectangle: Rectangle) => void;
  setDuration: (duration: number) => void;
  setRotationIncrement: (rotationIncrement: number) => void; // in order to store the current rotation increment for hit testing
  animate: () => void;
  drawRectangles: (rotation: number) => void;
  draw: () => void;
  handleCanvasClick: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  getSceneObject: () => Scene;
  replaceScene: (scene: Scene) => void;
}

export const useSceneApi = create<SceneApi>((set, get) => ({
  ctx: null,
  rectangles: [],
  duration: 1,
  animating: false,
  rotationIncrement: 0,

  setContext: (ctx: CanvasRenderingContext2D) => set({ ctx }),
  addRectangle: () => {
    const { ctx, draw } = get();
    if (ctx) {
      // get ctx dimensions
      const { width, height } = ctx.canvas;
      const randomRectangle = generateRandomRectangle({ width, height });
      set((state) => ({ rectangles: [...state.rectangles, randomRectangle] }));
      draw();
    }
  },
  changeRectangleColor: (rectangle: Rectangle) => {
    const { draw } = get();
    const color = randomColor();
    rectangle.color = color;
    draw()
  },
  setDuration: (duration) => set({ duration }),
  setRotationIncrement: (rotationIncrement) => set({ rotationIncrement }),
  animate: () => {
    // Prevent retriggerring the animation with potentially a different duration
    const { animating, duration, setRotationIncrement, draw, drawRectangles } = get();
    if (animating) return;

    set({ animating: true });
    const durationMs = duration * 1000;
    let start: number | null = null;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const rotationIncrement = (360 * progress) / durationMs;

      setRotationIncrement(rotationIncrement);
      drawRectangles(rotationIncrement);

      if (progress < durationMs) {
        requestAnimationFrame(step);
      } else {
        set({ animating: false, rotationIncrement: 0});
        // redraw the scene with the reset rotation
        // so the scene does not stutter the next it is redrawn from the animate method
        // (the rotation increment is always 0 at the beginning of the animation)
        // this uses an extra frame but is necessary to avoid the stutter
        draw()
      }
    };

    requestAnimationFrame(step);
  },
  drawRectangles: (rotation = 0) => {
    const { ctx, rectangles } = get();
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      rectangles.forEach(rectangle => drawRectangle(ctx, rectangle, rotation));
    }
  },
  draw: (rotation = 0) => {
    const { animating, drawRectangles } = get();
    // if the scene is animating, we don't want to request additional redraws
    if (!animating) {
      requestAnimationFrame(() => drawRectangles(rotation));
    }
  },
  handleCanvasClick: (event) => {
    const { ctx, rectangles, rotationIncrement, changeRectangleColor } = get();
    if (ctx) {
      const { left, top } = ctx.canvas.getBoundingClientRect();
      const normalizedCursorPosition: Point = {
        x: event.clientX - left,
        y: event.clientY - top
      };

      const clickedRectangle = rectangles
        .slice() // copy the array to avoid mutating the state (reverse mutates our copy)
        .reverse() // front to back
        .find(rectangle => isPointInRotatedRectangle(normalizedCursorPosition, rectangle, rotationIncrement));

      if (clickedRectangle) {
        changeRectangleColor(clickedRectangle);
      }
    }
  },
  getSceneObject: () => {
    const { rectangles, duration } = get();
    return { rectangles, duration };
  },
  replaceScene: (scene) => {
    const { draw } = get();
    set(scene);
    draw();
  }
}));