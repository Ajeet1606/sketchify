import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke } from "@/lib/utils";
import { useState } from "react";
import { useStrokes } from "@/context/StrokesContext";

// Define the options object for perfect-freehand
const options = {
  size: 32,
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
    taper: 100,
    easing: (t: number) => t,
    cap: true,
  },
};

interface Point {
  x: number;
  y: number;
  pressure: number;
}

interface props {
  mode: string;
}
const SketchCanvas: React.FC<props> = ({}) => {
  const [points, setPoints] = useState<Point[]>([]);
  const { strokes, addStroke } = useStrokes();

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setPoints([{ x: e.pageX, y: e.pageY, pressure: e.pressure }]);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (e.buttons !== 1) return; // Ensure the left mouse button is pressed
    setPoints((prevPoints) => [
      ...prevPoints,
      { x: e.pageX, y: e.pageY, pressure: e.pressure },
    ]);
  }

  function handlePointerUp() {
    // Convert the current stroke to SVG path and add to strokes array
    const pointArray = points.map((point) => [
      point.x,
      point.y,
      point.pressure,
    ]);
    const newStroke = getSvgPathFromStroke(getStroke(pointArray, options));

    addStroke(newStroke); // Add the new stroke to the saved strokes
    setPoints([]); // Reset the current stroke after completion
  }

  return (
    <div>
      <svg
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp} // Track when the drawing is finished
        style={{ touchAction: "none", width: "100%", height: "100vh" }}
      >
        {/* Render all saved strokes */}
        {strokes.map((pathData, index) => (
          <path key={index} d={pathData} fill="black" stroke="none" />
        ))}

        {/* Render the current stroke */}
        {points.length > 0 && (
          <path
            d={getSvgPathFromStroke(
              getStroke(
                points.map((p) => [p.x, p.y, p.pressure]),
                options
              )
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
