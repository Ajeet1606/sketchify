import { useStrokes } from "@/context/StrokesContext";
import { Mode, ModeEnum } from "@/lib/utils";
import { Pencil, Type, Eraser, Move, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Toolbar = () => {
  const { updateMode, mode, updateCursorStyle } = useStrokes();
  const { toast } = useToast();
  const handleModeChange = (newMode: Mode) => {
    const activeElement = document.activeElement;
    if (activeElement?.tagName === "TEXTAREA") {
      return;
    }
    if (newMode === ModeEnum.SCROLL) {
      updateMode(ModeEnum.SCROLL);
      updateCursorStyle("grab");
    } else if (newMode === ModeEnum.DRAW) {
      updateMode(ModeEnum.DRAW);
      updateCursorStyle("crosshair");
    } else if (newMode === ModeEnum.SQUARE) {
      updateMode(ModeEnum.SQUARE);
      updateCursorStyle("crosshair");
    } else if (newMode === ModeEnum.CURSOR) {
      updateMode(ModeEnum.CURSOR);
      updateCursorStyle("default");
    } else if (newMode === ModeEnum.ARROW) {
      updateMode(ModeEnum.ARROW);
      updateCursorStyle("crosshair");
    } else if (newMode === ModeEnum.LINE) {
      updateMode(ModeEnum.LINE);
      updateCursorStyle("crosshair");
    } else if (newMode === ModeEnum.WRITE) {
      updateMode(ModeEnum.WRITE);
      updateCursorStyle("text");
    } else if (newMode === ModeEnum.ERASE) {
      updateMode(ModeEnum.ERASE);
      updateCursorStyle("pointer");
    }
  };

  return (
    <div className="bg-white py-3 px-2 md:px-4 rounded-md border mt-2 shadow-md z-50">
      <div className="space-x-2 md:flex">
        {/* <div className="flex justify-center gap-2 mb-2 md:mb-0"> */}
        <Button
          variant={mode === ModeEnum.DRAW ? "default" : "outline"}
          onClick={() => handleModeChange(ModeEnum.DRAW)}
        >
          <Pencil className="w-4 h-4 mr-1 bg-inherit" />
          <span className="text-sm -mb-3">1</span>
        </Button>
        <Button
          variant={mode === ModeEnum.WRITE ? "default" : "outline"}
          // onClick={() => handleModeChange(ModeEnum.WRITE)}
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Text mode is coming soon!",
            });
          }}
        >
          <Type className="w-4 h-4 mr-1 bg-inherit" />
          <span className="text-sm -mb-3">2</span>
        </Button>
        <Button
          variant={mode === ModeEnum.ERASE ? "default" : "outline"}
          onClick={() => handleModeChange(ModeEnum.ERASE)}
        >
          <Eraser className="w-4 h-4 mr-1 bg-inherit" />
          <span className="text-sm -mb-3">3</span>
        </Button>
        {/* </div>
        <div className="flex justify-center gap-2"> */}
        <Button
          variant={mode === ModeEnum.SCROLL ? "default" : "outline"}
          onClick={() => handleModeChange(ModeEnum.SCROLL)}
        >
          <Move className="w-4 h-4 mr-1 bg-inherit" />
          <span className="text-sm -mb-3">4</span>
        </Button>
        <Button
          variant={mode === ModeEnum.CURSOR ? "default" : "outline"}
          onClick={() => handleModeChange(ModeEnum.CURSOR)}
        >
          <MousePointer className="w-4 h-4 mr-1 bg-inherit" />
          <span className="text-sm -mb-3">5</span>
        </Button>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Toolbar;
