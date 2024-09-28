// StrokesContext.tsx
import { doesIntersect } from "@/lib/utils";
import React, { createContext, useContext, useState } from "react";

// Define the type for strokes
interface StrokesContextType {
  mode: string;
  strokes: string[];
  undoneStrokes: string[];
  updateMode: (mode: string) => void;
  addStroke: (newStroke: string) => void;
  undoStroke: () => void;
  redoStroke: () => void;
  eraseStroke: (erasePoints: number[][]) => void;
}

// Create the context
const StrokesContext = createContext<StrokesContextType | undefined>(undefined);

// Provide the strokes context to children components
export const StrokesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [strokes, setStrokes] = useState<string[]>([]);
  const [undoneStrokes, setUndoneStrokes] = useState<string[]>([]);
  const [mode, setMode] = useState("cursor");

  const updateMode = (newMode: string) => {
    setMode(newMode);
  };
  // Function to add a new stroke
  const addStroke = (newStroke: string) => {
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
        (stroke) => !doesIntersect(stroke, erasePoints) // Remove strokes that overlap with the eraser path
      );
    });
  };

  return (
    <StrokesContext.Provider
      value={{
        mode,
        updateMode,
        strokes,
        addStroke,
        undoStroke,
        redoStroke,
        undoneStrokes,
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