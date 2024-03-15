import { z } from 'zod';

export const pointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const sizeSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export const rectangleSchema = z.object({
  position: pointSchema,
  size: sizeSchema,
  angle: z.number(),
  color: z.string(),
});

export const sceneSchema = z.object({
  rectangles: z.array(rectangleSchema),
  duration: z.number(),
});
