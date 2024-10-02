import { useStrokes } from "@/context/StrokesContext";
import { strokeColors, strokeWidths } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

const StylingPallete = () => {
  const { updateStrokeColor, strokeColor, updateStrokeWidth, strokeWidth } =
    useStrokes();
  return (
    <div className="flex gap-4 flex-col">
      {/* stroke color */}
      <div className="flex flex-col">
        <h3 className="text-sm mb-1">Stroke Color</h3>
        <div className="flex gap-2">
          {strokeColors.map((color) => (
            <span
              className="w-8 h-8 rounded-md cursor-pointer flex justify-center items-center"
              style={{ backgroundColor: color }}
              key={color}
              onClick={() => updateStrokeColor(color)}
            >
              {strokeColor === color && (
                <CheckCircle className="w-5 h-5 bg-inherit text-white"/>
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <h3 className="text-sm mb-1">Stroke Width</h3>
        <div className="flex gap-2">
          {strokeWidths.map((width) => (
            <span
              className={`w-8 h-8 rounded-md cursor-pointer border flex justify-center items-center ${
                width === strokeWidth ? "bg-primary" : ""
              }`}
              key={width}
              onClick={() => updateStrokeWidth(width)}
            >
              {width}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StylingPallete;
