import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke, ModeEnum } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useStrokes } from "@/context/StrokesContext";
import { options, Point, TextBox } from "@/lib/utils";

const SketchCanvas = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isWritingText, setIsWritingText] = useState(false);
  const [textBoxPosition, setTextBoxPosition] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState("");
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  console.log("text boxes", textBoxes);

  const {
    mode,
    strokes,
    strokeColor,
    strokeWidth,
    scale,
    panOffset,
    canvasRef,
    cursorStyle,
    addStroke,
    eraseStroke,
    undoStroke,
    redoStroke,
    updateMode,
    updateCursorStyle,
    updatePanOffset,
  } = useStrokes();
  options.size = strokeWidth;

  // Handle when user clicks outside the text box (to finalize the text)
  const handleCanvasClickOutside = () => {
    console.log("click outside");

    if (isWritingText && textValue.trim() !== "") {
      setTextBoxes((prevTextBoxes) => [
        ...prevTextBoxes,
        { x: textBoxPosition.x, y: textBoxPosition.y, text: textValue },
      ]);
      setTextValue(""); // Reset input
      setIsWritingText(false); // Close input
    }
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("handle text input");

    setTextValue(e.target.value);
  };

  // Handle pointer up for finalizing text input
  useEffect(() => {
    window.addEventListener("click", handleCanvasClickOutside);
    return () => {
      window.removeEventListener("click", handleCanvasClickOutside);
    };
  }, [isWritingText, textValue]);

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    console.log("pointer down");

    if (mode === ModeEnum.WRITE) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / scale;
      const y = (e.clientY - rect.top - panOffset.y) / scale;

      // Set text box position
      setTextBoxPosition({ x, y });
      setIsWritingText(true); // Open input box
    } else if (mode === ModeEnum.SCROLL) {
      // Pan mode
      setIsPanning(true);
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    } else {
      // Drawing mode
      const canvas = canvasRef.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const scaledX = (e.clientX - rect.left - panOffset.x) / scale;
        const scaledY = (e.clientY - rect.top - panOffset.y) / scale;
        setPoints([{ x: scaledX, y: scaledY, pressure: e.pressure }]);
      }
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (mode === ModeEnum.SCROLL && isPanning) {
      updatePanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
      return;
    }

    if (e.buttons !== 1) return; // Ensure the left mouse button is pressed
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const scaledX = (e.clientX - rect.left - panOffset.x) / scale;
      const scaledY = (e.clientY - rect.top - panOffset.y) / scale;
      setPoints((prev) => [
        ...prev,
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

  // Function to redraw the canvas with strokes
  const drawStrokesOnCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(panOffset.x, panOffset.y);

    //draw all strokes.
    strokes.forEach((stroke) => {
      const path = new Path2D(stroke.path);
      ctx.fillStyle = stroke.color;
      ctx.fill(path);
    });

    //draw the current stroke
    if (points.length > 0 && mode === ModeEnum.DRAW) {
      const path = new Path2D(
        getSvgPathFromStroke(
          getStroke(
            points.map((p) => [p.x, p.y, p.pressure]),
            { size: strokeWidth }
          )
        )
      );
      ctx.fillStyle = strokeColor;
      ctx.fill(path);
    }

    // Draw text boxes
    textBoxes.forEach((box) => {
      // Set font style
      ctx.font = "bold 18px 'Arial', sans-serif"; 
      ctx.fillStyle = "black"; // Text color

      // Render the text on top of the background
      ctx.fillStyle = "black"; // Reset text color
      ctx.textBaseline = "top"; // Align text from the top
      ctx.fillText(box.text, box.x, box.y);
    });

    ctx.restore();
  };

  // Redraw canvas whenever strokes or pan/zoom changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        drawStrokesOnCanvas(ctx);
      }
    }
  }, [strokes, points, panOffset, scale, textBoxes]);

  // Set focus to the textarea manually after rendering
  useEffect(() => {
    if (isWritingText && textAreaRef.current) {
      console.log("set focus called.");
      textAreaRef.current.focus(); // Manually focus the textarea
    }
  }, [isWritingText]); // This runs every time `isWritingText` changes
  console.log("isWritingText: ", isWritingText);

  return (
    <div>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ cursor: cursorStyle, touchAction: "none" }}
      />

      {/* Text input box */}
      {isWritingText && (
        <textarea
          style={{
            position: "absolute",
            left: textBoxPosition.x * scale + panOffset.x,
            top: textBoxPosition.y * scale + panOffset.y,
            fontSize: "16px",
            width: "200px",
            height: "50px",
            zIndex: 10,
            border: "none",
          }}
          ref={textAreaRef}
          value={textValue}
          onChange={handleTextInput}
          onClick={(e) => e.stopPropagation()} // Prevent click propagation
          autoFocus={true}
        />
      )}
    </div>
  );
};

export default SketchCanvas;
