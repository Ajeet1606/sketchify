import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

export type strokeColorsType =
  | strokeColorsEnum.BLACK
  | strokeColorsEnum.RED
  | strokeColorsEnum.GREEN
  | strokeColorsEnum.PURPLE
  | strokeColorsEnum.ORANGE
  | strokeColorsEnum.BROWN;

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
