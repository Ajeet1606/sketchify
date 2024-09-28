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
