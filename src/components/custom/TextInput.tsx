import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  isWritingText: boolean;
  textBoxPosition: { x: number; y: number };
  panOffset: { x: number; y: number };
  strokeColor: string;
  textValue: string;
  handleTextInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  scale: number;
}

const TextInput: React.FC<TextInputProps> = ({
  isWritingText,
  textBoxPosition,
  panOffset,
  strokeColor,
  textValue,
  handleTextInput,
  scale,
}) => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isWritingText && textAreaRef.current) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 10);
    }
  }, [isWritingText]);

  if (!isWritingText) return null;

  return (
    <Textarea
      style={{
        position: "absolute",
        left: (textBoxPosition.x + panOffset.x) * scale,
        top: (textBoxPosition.y + panOffset.y) * scale,
        fontSize: `${16 * scale}px`,
        width: `${200 * scale}px`,
        height: `${50 * scale}px`,
        zIndex: 10,
        border: "none",
        color: strokeColor,
        transform: `scale(${1 / scale})`,
        transformOrigin: "top left",
      }}
      ref={textAreaRef}
      value={textValue}
      onChange={handleTextInput}
      onClick={(e) => e.stopPropagation()}
      autoFocus={true}
    />
  );
};

export default TextInput;
