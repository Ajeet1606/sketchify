// StrokesContext.tsx
import React, { createContext, useContext, useState } from "react";

// Define the type for strokes
interface StrokesContextType {
  strokes: string[];
  undoneStrokes: string[];
  addStroke: (newStroke: string) => void;
  undoStroke: () => void;
  redoStroke: () => void;
}

// Create the context
const StrokesContext = createContext<StrokesContextType | undefined>(undefined);

// Provide the strokes context to children components
export const StrokesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [strokes, setStrokes] = useState<string[]>([]);
  const [undoneStrokes, setUndoneStrokes] = useState<string[]>([]);

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

  return (
    <StrokesContext.Provider
      value={{ strokes, addStroke, undoStroke, redoStroke, undoneStrokes }}
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
