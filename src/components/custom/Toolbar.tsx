import React, { useCallback, useEffect } from "react";
import { useStrokesStore } from "@/store/strokesStore";
import { Mode, ModeEnum } from "@/lib/utils";
import {
  Pencil,
  Type,
  Eraser,
  Move,
  MousePointer,
  Download,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ModeConfig {
  mode: Mode;
  icon: LucideIcon;
  cursorStyle: string;
  label: string;
  shortcut: string;
  disabled?: boolean;
}

const modeConfigs: ModeConfig[] = [
  {
    mode: ModeEnum.DRAW,
    icon: Pencil,
    cursorStyle: "crosshair",
    label: "Draw",
    shortcut: "1",
  },
  {
    mode: ModeEnum.WRITE,
    icon: Type,
    cursorStyle: "text",
    label: "Write",
    shortcut: "2",
    disabled: true,
  },
  {
    mode: ModeEnum.ERASE,
    icon: Eraser,
    cursorStyle: "pointer",
    label: "Erase",
    shortcut: "3",
  },
  {
    mode: ModeEnum.SCROLL,
    icon: Move,
    cursorStyle: "grab",
    label: "Move",
    shortcut: "4",
  },
  {
    mode: ModeEnum.CURSOR,
    icon: MousePointer,
    cursorStyle: "default",
    label: "Select",
    shortcut: "5",
  },
];

const ModeButton: React.FC<{
  config: ModeConfig;
  isActive: boolean;
  onClick: () => void;
}> = ({ config, isActive, onClick }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={isActive ? "default" : "outline"}
          onClick={onClick}
          disabled={config.disabled}
          className="rounded-lg border shadow-none h-10"
        >
          <config.icon className="w-4 h-4 mr-[2px] md:mr-1 bg-inherit" />
          <span className="hidden md:inline text-sm -mb-3">
            {config.shortcut}
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {config.label} (Press {config.shortcut})
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const Toolbar: React.FC = () => {
  const { updateMode, mode, updateCursorStyle, downloadImage } =
    useStrokesStore();
  const { toast } = useToast();

  const handleModeChange = useCallback(
    (newMode: Mode) => {
      const activeElement = document.activeElement;
      if (activeElement?.tagName === "TEXTAREA") return;

      const config = modeConfigs.find((c) => c.mode === newMode);
      if (config) {
        updateMode(config.mode);
        updateCursorStyle(config.cursorStyle);
      }

      if (newMode === ModeEnum.WRITE) {
        toast({
          variant: "destructive",
          title: "Text mode is coming soon!",
          duration: 1000,
        });
      }
    },
    [updateMode, updateCursorStyle, toast]
  );

  const handleDownload = () => {
    downloadImage((message: string) =>
      toast({
        variant: "destructive",
        title: message,
        duration: 1000,
      })
    );
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const config = modeConfigs.find((c) => c.shortcut === event.key);
      if (config && !config.disabled) {
        handleModeChange(config.mode);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleModeChange]);

  return (
    <nav className="md:bg-white py-2 md:px-4 md:rounded-xl md:border mt-2 md:shadow-md z-50">
      <ul className="space-x-2 md:space-x-2 flex">
        {modeConfigs.map((config) => (
          <li key={config.mode}>
            <ModeButton
              config={config}
              isActive={mode === config.mode}
              onClick={() => handleModeChange(config.mode)}
            />
          </li>
        ))}
        <li>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="rounded-lg border shadow-none h-10"
                >
                  <Download className="md:w-4 w-3 md:h-4 h-3 mr-[2px] md:mr-1 bg-inherit" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </li>
      </ul>
    </nav>
  );
};

export default Toolbar;
