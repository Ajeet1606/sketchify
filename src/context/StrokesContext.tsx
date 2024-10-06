// StrokesContext.tsx
import {
  doesIntersect,
  eraseTextStrokes,
  Mode,
  ModeEnum,
  Stroke,
  strokeColorsEnum,
} from "@/lib/utils";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Define the type for strokes
interface StrokesContextType {
  mode: Mode;
  strokes: Stroke[];
  undoneStrokes: Stroke[];
  cursorStyle: string;
  strokeColor: strokeColorsEnum;
  strokeWidth: number;
  scale: number;
  panOffset: { x: number; y: number };
  canvasRef: React.RefObject<HTMLCanvasElement>;
  updateCursorStyle: (cursorStyle: string) => void;
  updateMode: (mode: Mode) => void;
  addStroke: (newStroke: Stroke) => void;
  undoStroke: () => void;
  redoStroke: () => void;
  eraseStroke: (erasePoints: number[][]) => void;
  updateStrokeColor: (strokeColor: strokeColorsEnum) => void;
  updateStrokeWidth: (strokeWidth: number) => void;
  handleZoom: (zoomIn: boolean) => void;
  updatePanOffset: (newOffset: { x: number; y: number }) => void;
  updateScale: (newScale: number) => void;
  clearCanvas: () => void;
}

// Create the context
const StrokesContext = createContext<StrokesContextType | undefined>(undefined);

// Provide the strokes context to children components
export const StrokesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undoneStrokes, setUndoneStrokes] = useState<Stroke[]>([]);
  const [mode, setMode] = useState(ModeEnum.CURSOR);
  const [cursorStyle, setCursorStyle] = useState("pointer");
  const [strokeColor, setStrokeColor] = useState<strokeColorsEnum>(
    strokeColorsEnum.BLACK
  );
  const [strokeWidth, setStrokeWidth] = useState<number>(10);
  const [scale, setScale] = useState(1); // Zoom level state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // Pan offset state
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load strokes from localStorage when app starts
  useEffect(() => {
    const savedStrokes = localStorage.getItem("strokes");
    if (savedStrokes) {
      setStrokes(JSON.parse(savedStrokes));
    }
  }, []);

  // Save strokes to localStorage whenever strokes change
  useEffect(() => {
    localStorage.setItem("strokes", JSON.stringify(strokes));
  }, [strokes]);

  const updateStrokeWidth = (strokeWidth: number) => {
    setStrokeWidth(strokeWidth);
  };
  const updateStrokeColor = (strokeColor: strokeColorsEnum) => {
    setStrokeColor(strokeColor);
  };

  const updateCursorStyle = (newStyle: string) => {
    setCursorStyle(newStyle);
  };

  const updateMode = (newMode: Mode) => {
    setMode(newMode);
  };
  // Function to add a new stroke
  const addStroke = (newStroke: Stroke) => {
    setStrokes((prevStrokes) => [...prevStrokes, newStroke]);
    setUndoneStrokes([]);
  };

  const undoStroke = () => {
    setStrokes((prevStrokes) => {
      if (prevStrokes.length === 0) return prevStrokes; // No strokes to undo
      const lastStroke = prevStrokes[prevStrokes.length - 1];
      setUndoneStrokes((prevUndone) => [...prevUndone, lastStroke]); // Save to undone
      return prevStrokes.slice(0, -1); // Remove the last stroke
    });
  };

  const redoStroke = () => {
    setUndoneStrokes((prevUndone) => {
      if (prevUndone.length === 0) return prevUndone; // No strokes to redo
      const lastUndone = prevUndone[prevUndone.length - 1];
      setStrokes((prevStrokes) => [...prevStrokes, lastUndone]); // Add back to strokes
      return prevUndone.slice(0, -1); // Remove from undone strokes
    });
  };

  const eraseStroke = (erasePoints: number[][]) => {
    setStrokes((prevStrokes) => {
      return prevStrokes.filter((stroke) => {
        // If it's a drawing stroke, check the path
        if (stroke.path) {
          return !doesIntersect(stroke.path, erasePoints);
        }
        return eraseTextStrokes(stroke, erasePoints);
      });
    });
  };

  const updatePanOffset = (newOffset: { x: number; y: number }) => {
    setPanOffset(newOffset);
  };

  const updateScale = (newScale: number) => {
    setScale(newScale);
  };

  // Function to handle zoom with proper centering
  const handleZoom = (zoomIn: boolean) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();

    const zoomFactor = 0.1; // Zoom in or out by 10%
    const newScale = zoomIn ? scale + zoomFactor : scale - zoomFactor;

    // Calculate the center of the canvas
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Adjust panOffset to ensure the content remains centered during zoom
    const newOffsetX = centerX - ((centerX - panOffset.x) / scale) * newScale;
    const newOffsetY = centerY - ((centerY - panOffset.y) / scale) * newScale;

    setPanOffset({ x: newOffsetX, y: newOffsetY });
    setScale(newScale);
  };

  const clearCanvas = () => {
    setStrokes([]);
    setUndoneStrokes([]);
  };

  return (
    <StrokesContext.Provider
      value={{
        mode,
        strokes,
        undoneStrokes,
        cursorStyle,
        strokeColor,
        strokeWidth,
        scale,
        panOffset,
        canvasRef,
        updatePanOffset,
        handleZoom,
        updateStrokeWidth,
        updateStrokeColor,
        updateCursorStyle,
        updateMode,
        addStroke,
        undoStroke,
        redoStroke,
        eraseStroke,
        updateScale,
        clearCanvas,
      }}
    >
      {children}
    </StrokesContext.Provider>
  );
};

// Create a custom hook to use the StrokesContext
export const useStrokes = (): StrokesContextType => {
  const context = useContext(StrokesContext);
  if (!context) {
    throw new Error("useStrokes must be used within a StrokesProvider");
  }
  return context;
};
