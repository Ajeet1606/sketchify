import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  isWritingText: boolean;
  textBoxPosition: { x: number; y: number };
  panOffset: { x: number; y: number };
  strokeColor: string;
  textValue: string;
  handleTextInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  isWritingText,
  textBoxPosition,
  panOffset,
  strokeColor,
  textValue,
  handleTextInput,
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
      onClick={(e) => e.stopPropagation()}
      autoFocus={true}
    />
  );
};

export default TextInput;
