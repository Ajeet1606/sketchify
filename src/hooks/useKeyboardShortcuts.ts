import { useEffect } from "react";
import { useStrokesStore } from "@/store/strokesStore";
import { ModeEnum } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const useKeyboardShortcuts = (
  handleCanvasClickOutside: () => void,
  setIsAlertDialogOpen: (isOpen: boolean) => void
) => {
  const { toast } = useToast();
  const {
    strokes,
    updateMode,
    updateCursorStyle,
    undoStroke,
    redoStroke,
    downloadImage,
  } = useStrokesStore((state) => state);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === "TEXTAREA") return;

      if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "Z") {
        e.preventDefault();
        undoStroke();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "Y") {
        e.preventDefault();
        redoStroke();
        return;
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toUpperCase() === "X"
      ) {
        e.preventDefault();
        if (strokes.length === 0) {
          toast({
            variant: "destructive",
            title: "No strokes to erase!",
            duration: 1000,
          });
        } else {
          setIsAlertDialogOpen(true);
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "S") {
        e.preventDefault();
        downloadImage((message: string) =>
          toast({
            variant: "destructive",
            title: message,
            duration: 1000,
          })
        );
        return;
      }
      switch (e.key) {
        case "1":
          updateMode(ModeEnum.DRAW);
          updateCursorStyle("crosshair");
          handleCanvasClickOutside();
          break;
        case "2":
          // toast({
          //   variant: "destructive",
          //   title: "Text mode is coming soon!",
          //   duration: 1000,
          // });
          updateMode(ModeEnum.WRITE);
          updateCursorStyle("text");
          handleCanvasClickOutside();
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

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [strokes, handleCanvasClickOutside, setIsAlertDialogOpen]);
};
