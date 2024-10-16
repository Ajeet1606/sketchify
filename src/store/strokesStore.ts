import { create } from "zustand";
import {
  Stroke,
  strokeColorsEnum,
  Mode,
  ModeEnum,
  doesIntersect,
  eraseTextStrokes,
} from "@/lib/utils";

// Define the type for the Zustand store
interface StrokesState {
  mode: Mode;
  strokes: Stroke[];
  undoneStrokes: Stroke[];
  cursorStyle: string;
  strokeColor: strokeColorsEnum;
  strokeWidth: number;
  strokeTaper: number;
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
  downloadImage: (toast: (message: string) => void) => void;
  updateStrokeTaper: (strokeTaper: number) => void;
}

// Create Zustand store
export const useStrokesStore = create<StrokesState>((set, get) => {
  const loadStrokesFromLocalStorage = (): Stroke[] => {
    const savedStrokes = localStorage.getItem("strokes");
    return savedStrokes ? JSON.parse(savedStrokes) : [];
  };

  const initialStrokes = loadStrokesFromLocalStorage(); // Load strokes initially

  return {
    mode: ModeEnum.CURSOR,
    strokes: initialStrokes, // Set initial strokes from localStorage
    undoneStrokes: [],
    cursorStyle: "pointer",
    strokeColor: strokeColorsEnum.BLACK,
    strokeWidth: 10,
    strokeTaper: 0,
    scale: 1,
    panOffset: { x: 0, y: 0 },
    canvasRef: { current: null },

    // Function to update cursor style
    updateCursorStyle: (newStyle: string) => set({ cursorStyle: newStyle }),

    // Function to update mode
    updateMode: (newMode: Mode) => set({ mode: newMode }),

    // Function to add a new stroke
    addStroke: (newStroke: Stroke) => {
      set((state) => {
        const updatedStrokes = [...state.strokes, newStroke];
        return { strokes: updatedStrokes, undoneStrokes: [] };
      });
    },

    // Undo last stroke
    undoStroke: () => {
      set((state) => {
        const lastStroke = state.strokes.pop();
        if (!lastStroke) return state;
        return {
          strokes: [...state.strokes],
          undoneStrokes: [...state.undoneStrokes, lastStroke],
        };
      });
    },

    // Redo last undone stroke
    redoStroke: () => {
      set((state) => {
        const lastUndone = state.undoneStrokes.pop();
        if (!lastUndone) return state;
        return {
          strokes: [...state.strokes, lastUndone],
          undoneStrokes: state.undoneStrokes,
        };
      });
    },

    // Erase a stroke
    eraseStroke: (erasePoints: number[][]) => {
      set((state) => {
        const filteredStrokes = state.strokes.filter((stroke) => {
          if (stroke.path) return !doesIntersect(stroke.path, erasePoints);
          return eraseTextStrokes(stroke, erasePoints);
        });
        return { strokes: filteredStrokes };
      });
    },

    // Update stroke color
    updateStrokeColor: (strokeColor: strokeColorsEnum) => set({ strokeColor }),

    // Update stroke width
    updateStrokeWidth: (strokeWidth: number) => set({ strokeWidth }),

    // Update stroke taper
    updateStrokeTaper: (strokeTaper: number) => set({ strokeTaper }),

    // Update pan offset
    updatePanOffset: (newOffset: { x: number; y: number }) =>
      set({ panOffset: newOffset }),

    // Update scale (zoom level)
    updateScale: (newScale: number) => set({ scale: newScale }),

    // Handle zoom (in/out)
    handleZoom: (zoomIn: boolean) => {
      const { scale, panOffset, canvasRef } = get();
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const zoomFactor = 0.1;
      const newScale = zoomIn ? scale + zoomFactor : scale - zoomFactor;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const newOffsetX = centerX - ((centerX - panOffset.x) / scale) * newScale;
      const newOffsetY = centerY - ((centerY - panOffset.y) / scale) * newScale;

      set({ panOffset: { x: newOffsetX, y: newOffsetY }, scale: newScale });
    },

    // Clear the canvas
    clearCanvas: () => set({ strokes: [], undoneStrokes: [] }),

    // Function to download the canvas content as an image
    downloadImage: (toast: (message: string) => void) => {
      const { strokes, canvasRef } = get();
      if (strokes.length === 0) {
        toast("Canvas is empty!");
        return;
      }
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const currentContent = context.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);

      context.putImageData(currentContent, 0, 0);

      const image = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = image;
      downloadLink.download = "canvas_image.png";
      downloadLink.click();

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.putImageData(currentContent, 0, 0);
    },
  };
});

// Synchronize strokes with localStorage
useStrokesStore.subscribe((state) => {
  localStorage.setItem("strokes", JSON.stringify(state.strokes));
});
