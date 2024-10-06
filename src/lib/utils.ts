import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add this to the strokes array in the context provider
export interface Stroke {
  type: "draw" | "erase" | "text"; // Add 'text' as a type
  path?: string; // Path for freehand strokes
  color: string; // Color for freehand strokes
  text?: string; // Text content for text boxes
  position?: { x: number; y: number }; // Text position for text boxes
  fontSize?: number; // Font size for text boxes
  fontFamily?: string; // Font family for text boxes
  // Add other relevant properties for both types as needed
}

export interface Point {
  x: number;
  y: number;
  pressure: number;
}

// Define the options object for perfect-freehand
export const options = {
  size: 2,
  thinning: 0.5,
  smoothing: 0.5,
  streamline: 0.5,
  easing: (t: number) => t,
  start: {
    taper: 0,
    easing: (t: number) => t,
    cap: true,
  },
  end: {
    taper: 0, //edge sharpness
    easing: (t: number) => t,
    cap: true,
  },
};

export function getSvgPathFromStroke(stroke: number[][]): string {
  if (!stroke.length) return "";

  const d = stroke.reduce<string[]>(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length]; // Get the next point, wrapping around at the end
      acc.push(`${x0}`, `${y0}`, `${(x0 + x1) / 2}`, `${(y0 + y1) / 2}`);
      return acc;
    },
    ["M", `${stroke[0][0]}`, `${stroke[0][1]}`, "Q"]
  );

  d.push("Z");
  return d.join(" ");
}

export function doesIntersect(
  strokePath: string,
  eraserPoints: number[][],
  threshold = 20
): boolean {
  // Convert the stroke path into an array of points
  const strokePoints = parsePathToPoints(strokePath);

  // Check if any eraser point is within the threshold distance from any stroke point
  for (const eraserPoint of eraserPoints) {
    for (const strokePoint of strokePoints) {
      const distance = getDistance(eraserPoint, strokePoint);
      if (distance <= threshold) {
        return true; // Erase if overlap detected
      }
    }
  }
  return false;
}

// Helper function to calculate the Euclidean distance between two points
function getDistance(point1: number[], point2: number[]): number {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export function eraseTextStrokes(
  stroke: Stroke,
  erasePoints: number[][],
  threshold = 20
) {
  // If it's a text stroke, check for intersection based on its properties
  if (stroke.position && stroke.text) {
    const { position, text, fontSize } = stroke;

    // Calculate the text bounding box
    const textWidth = measureTextWidth(text, fontSize!);
    const textHeight = fontSize!; // Approximation, height is typically close to the font size

    // Define the bounds of the text stroke
    const bounds = {
      left: position.x,
      right: position.x + textWidth,
      top: position.y,
      bottom: position.y + textHeight,
    };

    // Check if any eraser point intersects the text bounding box
    for (const eraserPoint of erasePoints) {
      if (
        eraserPoint[0] >= bounds.left - threshold &&
        eraserPoint[0] <= bounds.right + threshold &&
        eraserPoint[1] >= bounds.top - threshold &&
        eraserPoint[1] <= bounds.bottom + threshold
      ) {
        return false; // Remove stroke if it intersects
      }
    }
  }

  return true; // Keep the stroke if no intersection is found
}

// Utility function to measure text width
function measureTextWidth(text: string, fontSize: number): number {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return 0;

  context.font = `${fontSize}px Arial`; // Specify the font to use
  return context.measureText(text).width; // Measure the width of the text
}

// Helper function to parse the SVG path string into an array of points
function parsePathToPoints(path: string): number[][] {
  // This is a simple parsing function; you may need to improve it based on the complexity of your paths
  const points: number[][] = [];
  const regex = /([MLQZ])([^MLQZ]*)/g;
  let match;

  while ((match = regex.exec(path))) {
    const command = match[1];
    const values = match[2]
      .trim()
      .split(" ")
      .map((num) => parseFloat(num));
    if (command !== "Z") {
      for (let i = 0; i < values.length; i += 2) {
        points.push([values[i], values[i + 1]]);
      }
    }
  }
  return points;
}

export enum ModeEnum {
  DRAW = "draw",
  ERASE = "erase",
  CURSOR = "cursor",
  LINE = "line",
  SCROLL = "scroll",
  SQUARE = "square",
  ARROW = "arrow",
  WRITE = "write",
}

export type Mode =
  | ModeEnum.DRAW
  | ModeEnum.ERASE
  | ModeEnum.CURSOR
  | ModeEnum.LINE
  | ModeEnum.SCROLL
  | ModeEnum.SQUARE
  | ModeEnum.ARROW
  | ModeEnum.WRITE;

export enum strokeColorsEnum {
  BLACK = "black",
  RED = "red",
  GREEN = "green",
  PURPLE = "purple",
  ORANGE = "orange",
  BROWN = "brown",
}
export const strokeColors = [
  strokeColorsEnum.BLACK,
  strokeColorsEnum.RED,
  strokeColorsEnum.GREEN,
  strokeColorsEnum.PURPLE,
  strokeColorsEnum.ORANGE,
  strokeColorsEnum.BROWN,
];

export const canvasColors = [
  "black",
  "red",
  "green",
  "purple",
  "orange",
  "brown",
];

export const strokeWidths = [5, 10, 15, 20, 25, 30];

export const eraserStrokeWidths = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
];
