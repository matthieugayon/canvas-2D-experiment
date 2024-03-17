import { create } from 'zustand';
import { Point, Rectangle, Scene, SerializedScene } from './types/geometry';
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
  drawRectangles: (incrementally: boolean, rotation: number) => void;
  draw: () => void;
  handleCanvasClick: (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => void;
  getSerializedSceneObject: () => SerializedScene;
  replaceScene: (loadedScene: SerializedScene) => void;
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
      drawRectangles(false, rotationIncrement); // incremental = false, we want to draw the whole scene

      if (progress < durationMs) {
        requestAnimationFrame(step);
      } else {
        set({ animating: false, rotationIncrement: 0});
        // redraw the scene with rotation 0
        // so the scene does not stutter the next time it is redrawn from the animate method
        // (the rotation increment is always 0 at the beginning of the animation)
        // this uses an extra frame but is necessary to avoid the stutter
        draw()
      }
    };

    requestAnimationFrame(step);
  },
  drawRectangles: (incrementally: boolean, rotation: number) => {
    const { ctx, rectangles } = get();
    if (ctx) {
      ctx.fillStyle = "#e5e7eb"; // tailwwind's bg-gray-200
      // because we are not using alpha channel, clear with fillRect instead of clearRect
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      rectangles.forEach(rectangle => drawRectangle(ctx, rectangle, rotation, incrementally));
    }
  },
  draw: () => {
    const { animating, drawRectangles } = get();
    // if the scene is animating, we don't want to request additional redraws
    if (!animating) {
      // incremental = true, we want to draw the scene incrementally
      // i.e only the newly added rectangles
      requestAnimationFrame(() => drawRectangles(true, 0));
    }
  },
  handleCanvasClick: (event) => {
    const { ctx, rectangles, rotationIncrement, changeRectangleColor } = get();
    if (ctx) {
      const { left, top } = ctx.canvas.getBoundingClientRect();

      // normalize the cursor position to the canvas
      const normalizedCursorPosition: Point = {
        x: event.clientX - left,
        y: event.clientY - top
      };

      const clickedRectangle = rectangles
        .slice() // copy the array to avoid mutating the state (reverse mutates our copy)
        .reverse() // we want to hit test in front to back order
        .find(rectangle => isPointInRotatedRectangle(normalizedCursorPosition, rectangle, rotationIncrement));

      if (clickedRectangle) {
        changeRectangleColor(clickedRectangle);
      }
    }
  },
  getSerializedSceneObject: () => {
    const { rectangles, duration } = get();
    // filter out drawn property from the rectangles objects
    const serializedRectangles = rectangles.map(({ drawn, ...rest }) => rest);
    return { rectangles: serializedRectangles, duration };
  },
  replaceScene: (loadedScene) => {
    const { draw } = get();

    // reset the drawn state of the rectangles
    const scene: Scene = {
      ...loadedScene,
      rectangles: loadedScene.rectangles.map(rectangle => ({ ...rectangle, drawn: false })),
    };

    set(scene);
    draw();
  }
}));