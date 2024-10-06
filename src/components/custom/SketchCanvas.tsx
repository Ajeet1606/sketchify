import { getStroke } from "perfect-freehand";
import { getSvgPathFromStroke, ModeEnum } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useStrokes } from "@/context/StrokesContext";
import { options, Point } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea"

const SketchCanvas = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const [isWritingText, setIsWritingText] = useState(false);
  const [textBoxPosition, setTextBoxPosition] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { toast } = useToast();

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
    clearCanvas,
  } = useStrokes();
  options.size = strokeWidth;

  // Handle when user clicks outside the text box (to finalize the text)
  const handleCanvasClickOutside = () => {
    if (isWritingText && textValue.trim() !== "") {
      addStroke({
        type: "text",
        // path: "",
        color: strokeColor,
        text: textValue,
        position: textBoxPosition,
        fontSize: 18,
        fontFamily: "sans",
      });
      setTextValue("");
      setIsWritingText(false);
    }
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        type: "draw",
        path: newStrokePath,
        color: strokeColor,
      });
    }
    setPoints([]); // Reset the current stroke after completion
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === "TEXTAREA" || isWritingText) {
      return; // Do not switch modes if the user is typing
    }

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
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "X") {
      clearCanvas();
      return;
    }
    switch (e.key) {
      case "1":
        updateMode(ModeEnum.DRAW);
        updateCursorStyle("crosshair");
        handleCanvasClickOutside();
        break;
      case "2":
        // useCallback(() => {
          toast({
            variant: "destructive",
            title: "Text mode is coming soon!",
          });
        // }, []);
        // updateMode(ModeEnum.WRITE);
        // updateCursorStyle("text");
        break;
      case "3":
        updateMode(ModeEnum.ERASE);
        updateCursorStyle("pointer");
        handleCanvasClickOutside();
        break;
      case "4":
        updateMode(ModeEnum.SCROLL);
        updateCursorStyle("grab");
        handleCanvasClickOutside();
        break;
      case "5":
        updateMode(ModeEnum.CURSOR);
        updateCursorStyle("default");
        handleCanvasClickOutside();
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
      if (stroke.type === "draw") {
        const path = new Path2D(stroke.path);
        ctx.fillStyle = stroke.color;
        ctx.fill(path);
      } else if (stroke.type === "text") {
        ctx.font = `${stroke.fontSize}px ${stroke.fontFamily}`;
        ctx.fillStyle = stroke.color;
        ctx.textBaseline = "top";
        ctx.fillText(stroke.text!, stroke.position!.x, stroke.position!.y);
      }
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
  }, [strokes, points, panOffset, scale]);

  // Set focus to the textarea manually after rendering
  useEffect(() => {
    if (isWritingText && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 10);
    }
  }, [isWritingText]); // This runs every time `isWritingText` changes

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
        <Textarea
          style={{
            position: "absolute",
            left: textBoxPosition.x + panOffset.x,
            top: textBoxPosition.y + panOffset.y,
            fontSize: "16px",
            width: "200px",
            height: "50px",
            zIndex: 10,
            border: "none",
            color: strokeColor,
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
