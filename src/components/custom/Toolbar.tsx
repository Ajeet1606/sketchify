import { useStrokesStore } from "@/store/strokesStore";
import { Mode, ModeEnum } from "@/lib/utils";
import {
  Pencil,
  Type,
  Eraser,
  Move,
  MousePointer,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Toolbar = () => {
  const { updateMode, mode, updateCursorStyle, downloadImage } =
    useStrokesStore();
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

  const handleDownload = () => {
    downloadImage((message: string) =>
      toast({
        variant: "destructive",
        title: message,
        duration: 1000,
      })
    );
  };
  return (
    <div className="md:bg-white py-2 md:px-4 md:rounded-md md:border mt-2 md:shadow-md z-50">
      <div className="space-x-2 md:space-x-2 md:flex">
          <Button
            variant={mode === ModeEnum.DRAW ? "default" : "outline"}
            onClick={() => handleModeChange(ModeEnum.DRAW)}
          >
            <Pencil className="md:w-4 w-3 md:h-4 h-3 mr-[2px] md:mr-1 bg-inherit" />
            <span className="hidden md:inline text-sm -mb-3">1</span>
          </Button>
          <Button
            variant={mode === ModeEnum.WRITE ? "default" : "outline"}
            // onClick={() => handleModeChange(ModeEnum.WRITE)}
            onClick={() => {
              toast({
                variant: "destructive",
                title: "Text mode is coming soon!",
                duration: 1000,
              });
            }}
          >
            <Type className="md:w-4 w-3 md:h-4 h-3 mr-[2px] md:mr-1 bg-inherit" />
            <span className="hidden md:inline text-sm -mb-3">2</span>
          </Button>
          <Button
            variant={mode === ModeEnum.ERASE ? "default" : "outline"}
            onClick={() => handleModeChange(ModeEnum.ERASE)}
          >
            <Eraser className="md:w-4 w-3 md:h-4 h-3 mr-[2px] md:mr-1 bg-inherit" />
            <span className="hidden md:inline text-sm -mb-3">3</span>
          </Button>
          <Button
            variant={mode === ModeEnum.SCROLL ? "default" : "outline"}
            onClick={() => handleModeChange(ModeEnum.SCROLL)}
          >
            <Move className="md:w-4 w-3 md:h-4 h-3 mr-[2px] md:mr-1 bg-inherit" />
            <span className="hidden md:inline text-sm -mb-3">4</span>
          </Button>
          <Button
            variant={mode === ModeEnum.CURSOR ? "default" : "outline"}
            onClick={() => handleModeChange(ModeEnum.CURSOR)}
          >
            <MousePointer className="md:w-4 w-3 md:h-4 h-3 mr-[2px] md:mr-1 bg-inherit" />
            <span className="hidden md:inline text-sm -mb-3">5</span>
          </Button>

          <Button
            variant="outline"
            onClick={handleDownload} // Trigger the download on click
          >
            <Download className="md:w-4 w-3 md:h-4 h-3 mr-[2px] md:mr-1 bg-inherit" />
          </Button>
        </div>
    </div>
  );
};

export default Toolbar;
