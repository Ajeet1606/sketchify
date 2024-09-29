import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke, ModeEnum } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useStrokes } from "@/context/StrokesContext";

// Define the options object for perfect-freehand
const options = {
  size: 5,
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
  const {
    mode,
    strokes,
    strokeColor,
    addStroke,
    eraseStroke,
    undoStroke,
    redoStroke,
    updateMode,
    cursorStyle,
    updateCursorStyle,
  } = useStrokes();

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
    const newStrokePath = getSvgPathFromStroke(getStroke(pointArray, options));

    if (mode === ModeEnum.ERASE) {
      const erasePoints = points.map((p) => [p.x, p.y]);
      eraseStroke(erasePoints);
    } else if (mode === ModeEnum.DRAW) {
      addStroke({
        path: newStrokePath,
        color: strokeColor,
      });
    }
    setPoints([]); // Reset the current stroke after completion
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      undoStroke();
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
      e.preventDefault();
      redoStroke();
      return;
    }
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
        updateCursorStyle("default");
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
        {strokes.map((stroke, index) => (
          <path key={index} d={stroke.path} fill={stroke.color} stroke="none" />
        ))}

        {/* Render the current stroke */}
        {points.length > 0 && mode === ModeEnum.DRAW && (
          <path
            d={getSvgPathFromStroke(
              getStroke(
                points.map((p) => [p.x, p.y, p.pressure]),
                options
              )
            )}
            fill={strokeColor}
            stroke="none"
          />
        )}
      </svg>
    </div>
  );
};

export default SketchCanvas;
