import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke, ModeEnum } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useStrokes } from "@/context/StrokesContext";

// Define the options object for perfect-freehand
const options = {
  size: 20,
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

const SketchCanvas = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [startPoint, setStartPoint] = useState<Point | null>(null); // Used for square/circle
  const {
    strokes,
    addStroke,
    eraseStroke,
    mode,
    updateMode,
    cursorStyle,
    updateCursorStyle,
  } = useStrokes();

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    const newPoint = { x: e.pageX, y: e.pageY, pressure: e.pressure };
    setStartPoint(newPoint); // Save the start point for shapes like square and circle
    setPoints([newPoint]);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (e.buttons !== 1 || !startPoint) return; // Ensure the left mouse button is pressed

    const newPoint = { x: e.pageX, y: e.pageY, pressure: e.pressure };
    if (mode === ModeEnum.SQUARE) {
      const width = Math.abs(newPoint.x - startPoint.x);
      const height = Math.abs(newPoint.y - startPoint.y);
      const size = Math.min(width, height); // Make it a square
      const newSquare = [
        startPoint,
        {
          x: startPoint.x + size,
          y: startPoint.y,
          pressure: newPoint.pressure,
        },
        {
          x: startPoint.x + size,
          y: startPoint.y + size,
          pressure: newPoint.pressure,
        },
        {
          x: startPoint.x,
          y: startPoint.y + size,
          pressure: newPoint.pressure,
        },
        startPoint, // Close the square
      ];
      setPoints(newSquare);
    } else setPoints((prevPoints) => [...prevPoints, newPoint]);
  }

  function handlePointerUp() {
    // Convert the current stroke to SVG path and add to strokes array
    const pointArray = points.map((point) => [
      point.x,
      point.y,
      point.pressure,
    ]);
    const newStroke = getSvgPathFromStroke(getStroke(pointArray, options));

    if (mode === ModeEnum.ERASE) {
      const erasePoints = points.map((p) => [p.x, p.y]);
      eraseStroke(erasePoints);
    } else if (mode === ModeEnum.DRAW) {
      addStroke(newStroke);
    }
    setPoints([]); // Reset the current stroke after completion
    setStartPoint(null);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "1":
        updateMode(ModeEnum.SCROLL);
        updateCursorStyle("grab");
        break;
      case "2":
        updateMode(ModeEnum.DRAW);
        updateCursorStyle("crosshair");
        break;
      case "3":
        updateMode(ModeEnum.SQUARE);
        updateCursorStyle("crosshair");
        break;
      case "4":
        updateMode(ModeEnum.CURSOR);
        updateCursorStyle("pointer");
        break;
      case "5":
        updateMode(ModeEnum.ARROW);
        updateCursorStyle("crosshair");
        break;
      case "6":
        updateMode(ModeEnum.LINE);
        updateCursorStyle("crosshair");
        break;
      case "7":
        updateMode(ModeEnum.WRITE);
        updateCursorStyle("crosshair");
        break;
      case "8":
        updateMode(ModeEnum.ERASE);
        updateCursorStyle("pointer");
        break;
      default:
        break;
    }
  };

  // Add keyboard event listener on component mount
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown); // Clean up
    };
  }, []);

  return (
    <div>
      <svg
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp} // Track when the drawing is finished
        cursor={cursorStyle}
        style={{ touchAction: "none", width: "100%", height: "100vh" }}
      >
        {/* Render all saved strokes */}
        {strokes.map((pathData, index) => (
          <path
            key={index}
            d={pathData}
            fill={mode === ModeEnum.SQUARE ? "none" : "black"}
            stroke={mode === ModeEnum.DRAW ? "none" : "black"}
          />
        ))}

        {/* Render the current stroke */}
        {points.length > 0 && mode !== ModeEnum.ERASE && (
          <path
            d={getSvgPathFromStroke(
              getStroke(
                points.map((p) => [p.x, p.y, p.pressure]),
                options
              )
            )}
            fill={mode === ModeEnum.SQUARE ? "none" : "black"}
            stroke={mode === ModeEnum.DRAW ? "none" : "black"}
          />
        )}
      </svg>
    </div>
  );
};

export default SketchCanvas;
