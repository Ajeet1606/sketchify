// StrokesContext.tsx
import { doesIntersect, Mode, ModeEnum, strokeColorsEnum } from "@/lib/utils";
import React, { createContext, useContext, useEffect, useState } from "react";

// Add this to the strokes array in the context provider
interface Stroke {
  path: string;
  color: string;
}

// Define the type for strokes
interface StrokesContextType {
  mode: Mode;
  strokes: Stroke[];
  undoneStrokes: Stroke[];
  cursorStyle: string;
  strokeColor: strokeColorsEnum;
  strokeWidth: number;
  scale: number;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  updateCursorStyle: (cursorStyle: string) => void;
  updateMode: (mode: Mode) => void;
  addStroke: (newStroke: Stroke) => void;
  undoStroke: () => void;
  redoStroke: () => void;
  eraseStroke: (erasePoints: number[][]) => void;
  updateStrokeColor: (strokeColor: strokeColorsEnum) => void;
  updateStrokeWidth: (strokeWidth: number) => void;
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
      return prevStrokes.filter(
        (stroke) => !doesIntersect(stroke.path, erasePoints) // Remove strokes that overlap with the eraser path
      );
    });
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale * 1.2, 5)); // Max scale limit of 5
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale * 0.8, 0.2)); // Min scale limit of 0.2
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
        handleZoomIn,
        handleZoomOut,
        updateStrokeWidth,
        updateStrokeColor,
        updateCursorStyle,
        updateMode,
        addStroke,
        undoStroke,
        redoStroke,
        eraseStroke,
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
