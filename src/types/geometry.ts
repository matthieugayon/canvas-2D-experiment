export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Square {
  position: Point;
  size: number;
}

export interface Rectangle {
  position: Point; // Center of the rectangle
  size: Size;
  angle: number;
  color: string;
}

export interface Scene {
  rectangles: Rectangle[];
  duration: number;
}