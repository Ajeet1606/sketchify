import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke, ModeEnum } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useStrokes } from "@/context/StrokesContext";

// Define the options object for perfect-freehand
const options = {
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

interface Point {
  x: number;
  y: number;
  pressure: number;
}

const SketchCanvas = () => {
  const [points, setPoints] = useState<Point[]>([]);
  //const [scale, setScale] = useState(1); // Zoom level state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // Pan offset state
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const {
    mode,
    strokes,
    strokeColor,
    strokeWidth,
    scale,
    addStroke,
    eraseStroke,
    undoStroke,
    redoStroke,
    updateMode,
    cursorStyle,
    updateCursorStyle,
  } = useStrokes();

  options.size = strokeWidth;

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (mode === ModeEnum.SCROLL) {
      // Pan mode
      setIsPanning(true);
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    } else {
      // Drawing mode
      e.currentTarget.setPointerCapture(e.pointerId);
      const svg = svgRef.current;
      if (svg) {
        const rect = svg.getBoundingClientRect(); // Get the SVG dimensions
        const scaledX = (e.clientX - rect.left - panOffset.x) / scale; // Adjust for scaling and panning
        const scaledY = (e.clientY - rect.top - panOffset.y) / scale; // Adjust for scaling and panning
        setPoints([{ x: scaledX, y: scaledY, pressure: e.pressure }]);
      }
    }
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (mode === ModeEnum.SCROLL && isPanning) {
      setPanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
      return;
    }

    if (e.buttons !== 1) return; // Ensure the left mouse button is pressed
    const svg = svgRef.current;
    if (svg) {
      const rect = svg.getBoundingClientRect(); // Get the SVG dimensions
      const scaledX = (e.clientX - rect.left - panOffset.x) / scale; // Adjust for scaling and panning
      const scaledY = (e.clientY - rect.top - panOffset.y) / scale; // Adjust for scaling and panning
      setPoints((prevPoints) => [
        ...prevPoints,
        { x: scaledX, y: scaledY, pressure: e.pressure },
      ]);
    }
  }

  function handlePointerUp() {
    if (mode === ModeEnum.SCROLL) {
      setIsPanning(false);
      return;
    }

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
        updateCursorStyle("text");
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
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div>
      <svg
        ref={svgRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp} // Track when the drawing is finished
        cursor={cursorStyle}
        style={{
          touchAction: "none",
          width: "100%",
          height: "100vh",
        }}
        viewBox={`${-panOffset.x} ${-panOffset.y} ${
          window.innerWidth / scale
        } ${window.innerHeight / scale}`} // Apply pan/zoom
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
