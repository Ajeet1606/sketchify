import React, { useEffect, useState } from "react";
import { useStrokesStore } from "@/store/strokesStore";
import { ModeEnum } from "@/lib/utils";
import { useCanvas } from "@/hooks/useCanvas";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import TextInput from "./TextInput";
import ConfirmationDialog from "./ConfirmationDialog";

const SketchCanvas: React.FC = () => {
  const [isWritingText, setIsWritingText] = useState(false);
  const [textBoxPosition, setTextBoxPosition] = useState({ x: 0, y: 0 });
  const [textValue, setTextValue] = useState("");
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);

  const { mode, strokeColor, panOffset, cursorStyle, addStroke, scale } =
    useStrokesStore((state) => state);

  const { canvasRef, handlePointerDown, handlePointerMove, handlePointerUp } =
    useCanvas();

  const handleCanvasClickOutside = () => {
    if (isWritingText && textValue.trim() !== "") {
      addStroke({
        type: "text",
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

  useEffect(() => {
    window.addEventListener("click", handleCanvasClickOutside);
    return () => {
      window.removeEventListener("click", handleCanvasClickOutside);
    };
  }, [isWritingText, textValue]);

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextValue(e.target.value);
  };

  //include keyboard shortcut handler hook
  useKeyboardShortcuts(handleCanvasClickOutside, setIsAlertDialogOpen);

  const handleCanvasPointerDown = (
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (mode === ModeEnum.WRITE) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - panOffset.x) / scale;
      const y = (e.clientY - rect.top - panOffset.y) / scale;

      setTextBoxPosition({ x, y });
      setIsWritingText(true);
    } else {
      handlePointerDown(e);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        width={window.innerWidth}
        height={window.innerHeight}
        style={{ cursor: cursorStyle, touchAction: "none" }}
      />

      {isWritingText && (
        <TextInput
          isWritingText={isWritingText}
          textBoxPosition={textBoxPosition}
          panOffset={panOffset}
          strokeColor={strokeColor}
          textValue={textValue}
          handleTextInput={handleTextInput}
        />
      )}

      <ConfirmationDialog
        isAlertDialogOpen={isAlertDialogOpen}
        onClose={() => setIsAlertDialogOpen(false)}
      />
    </div>
  );
};

export default SketchCanvas;
