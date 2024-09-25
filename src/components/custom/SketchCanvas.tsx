import React, { useState, useRef } from "react";
import getStroke from "perfect-freehand";

// Type for the points and strokes
type Point = [number, number];
type Stroke = Point[]; // Each stroke is an array of points

interface props {
  mode: string;
}
const SketchCanvas: React.FC<props> = ({ mode }) => {
  const [strokes, setStrokes] = useState<Stroke[]>([]); // Store all strokes
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]); // Track the current stroke
  const canvasRef = useRef<SVGSVGElement | null>(null);

  // Handle pointer down (start a new stroke)
  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const newPoint: Point = [e.clientX, e.clientY];
    setCurrentStroke([newPoint]); // Start new stroke
  };

  // Handle pointer move (continue drawing the current stroke)
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.buttons !== 1) return; // Only draw when mouse is pressed
    const newPoint: Point = [e.clientX, e.clientY];
    setCurrentStroke((prevPoints) => [...prevPoints, newPoint]); // Add points to the current stroke
  };

  // Handle pointer up (end the current stroke and save it)
  const handlePointerUp = () => {
    if (mode === "eraser") {
      // Logic to remove strokes based on current stroke's points
      setStrokes((prevStrokes) =>
        prevStrokes.filter((stroke) => {
          // Implement logic to check if the stroke overlaps with the current stroke
          return !doesStrokeOverlap(stroke, currentStroke);
        })
      );
    } else if (currentStroke.length > 0) {
      setStrokes((prevStrokes) => [...prevStrokes, currentStroke]); // Add the current stroke to strokes
    }
    setCurrentStroke([]); // Reset current stroke
  };
  // Helper function to calculate the distance between two points
  const distance = (pointA: Point, pointB: Point): number => {
    return Math.sqrt(
      Math.pow(pointB[0] - pointA[0], 2) + Math.pow(pointB[1] - pointA[1], 2)
    );
  };

  // Function to check if the current stroke overlaps with an existing stroke
  const doesStrokeOverlap = (
    existingStroke: Stroke,
    currentStroke: Stroke
  ): boolean => {
    if (existingStroke.length === 0 || currentStroke.length === 0) return false;

    // Calculate bounding box of the current stroke
    const [minX, minY] = currentStroke.reduce(
      ([minX, minY], [x, y]) => [Math.min(minX, x), Math.min(minY, y)],
      [Infinity, Infinity]
    );
    const [maxX, maxY] = currentStroke.reduce(
      ([maxX, maxY], [x, y]) => [Math.max(maxX, x), Math.max(maxY, y)],
      [-Infinity, -Infinity]
    );

    // Check if any point of the existing stroke is within the bounding box of the current stroke
    for (const point of existingStroke) {
      if (
        point[0] >= minX &&
        point[0] <= maxX &&
        point[1] >= minY &&
        point[1] <= maxY
      ) {
        return true; // There's an overlap
      }
    }

    // Check the distance between the current stroke and points of the existing stroke
    const threshold = 10; // Distance threshold for overlap (adjustable)
    for (const currentPoint of currentStroke) {
      for (const existingPoint of existingStroke) {
        if (distance(currentPoint, existingPoint) < threshold) {
          return true; // Overlapping detected
        }
      }
    }

    return false; // No overlap found
  };

  // Convert stroke points to an SVG path
  const getSvgPathFromStroke = (strokePoints: number[][]): string => {
    if (strokePoints.length === 0) return "";
    const d = strokePoints.reduce(
      (acc, [x, y], i) => acc + `${i === 0 ? "M" : "L"}${x},${y} `,
      ""
    );
    return d + " Z"; // Z closes the path to make it a filled shape
  };

  return (
    <div>
      {/* Drawing canvas */}
      <svg
        ref={canvasRef}
        width="100%"
        height="500px"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp} // End the current stroke
        style={{ border: "1px solid black" }}
      >
        {/* Render all previously drawn strokes */}
        {strokes.map((stroke, index) => (
          <path
            key={index}
            d={getSvgPathFromStroke(
              getStroke(stroke, {
                size: 18,
                thinning: 0.2,
                smoothing: 3,
                streamline: 0.5,
              })
            )}
            fill="black"
            stroke="none"
          />
        ))}

        {/* Render the current stroke in progress */}
        {mode != "eraser" && (
          <path
            d={getSvgPathFromStroke(
              getStroke(currentStroke, {
                size: 18,
                thinning: 0.2,
                smoothing: 3.0,
                streamline: 0.5,
              })
            )}
            fill="black"
            stroke="none"
          />
        )}
      </svg>
    </div>
  );
};

export default SketchCanvas;
