import { Size, Point, Square, Rectangle } from '../types/geometry';

// Helper function to generate a random color
export const randomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

// Helper function to generate a random number within a range
const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};


// given a rectangle's diagonal and aspect ratio, calculate the width and height
const calculateRectangleDimensions = (diagonal: number, aspectRatio: number): Size => {
  const height = diagonal / Math.sqrt(aspectRatio ** 2 + 1);
  const width = aspectRatio * height;

  return { width, height };
}

const generateRandomSquare = (canvas: Size): Square => {
  // Determine the maximum size of the square based on the canvas size
  const maxSize = Math.min(canvas.width, canvas.height);

  // Randomize the size of the square
  const squareSize = Math.random() * maxSize;

  // Randomize the position of the square, ensuring it fits within the canvas
  const x = Math.random() * (canvas.width - squareSize);
  const y = Math.random() * (canvas.height - squareSize);

  return { position: { x, y }, size: squareSize };
}

const getSquareCenter = (square: Square): Point => (
  { x: square.position.x + square.size / 2, y: square.position.y + square.size / 2 }
);

export const generateRandomRectangle = (canvas: Size): Rectangle => {
  // Randomize the position of the rectangle, ensuring it fits within the canvas
  const square = generateRandomSquare(canvas);
  const squareCenter = getSquareCenter(square);
  const aspectRatio = randomInRange(0.5, 2);
  const angle = Math.random() * 360;
  const color = randomColor();

  // calculate the maximum size of a Rectangle that fits inside a square
  // for that we calculate the rectangle based on its diagonal = square.size
  // and a given aspect ratio
  // so we are sure the rectangle will fit inside the square at any orientation
  // i.e the diagonal of the rectangle will always be equal to the side of the square
  const size = calculateRectangleDimensions(square.size, aspectRatio);

  return {
    position: squareCenter,
    size,
    angle,
    color
  };
}
