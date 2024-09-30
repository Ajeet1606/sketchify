import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useStrokes } from "@/context/StrokesContext";
import GitHubIcon from "@mui/icons-material/GitHub";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StylingPallete from "./StylingPallete";

const Footer = () => {
  const { undoStroke, redoStroke, handleZoomIn, handleZoomOut, scale } =
    useStrokes();
  return (
    <div className="flex justify-center items-center gap-2 md:gap-4 px-2 md:px-6 py-4 w-full select-none cursor-default z-10">
      <div className="flex gap-2 md:gap-4">
        <div className="flex gap-3 md:gap-4 items-center bg-primary shadow rounded-md py-2 px-4">
          <span className="cursor-pointer" onClick={() => handleZoomOut()}>
            <RemoveIcon sx={{ background: "none", padding: 0, margin: 0 }} />
          </span>
          <h3 className="text-base md:text-lg font-semibold">{(scale * 100).toFixed(0)}%</h3>
          <span className="cursor-pointer" onClick={() => handleZoomIn()}>
            <AddIcon sx={{ background: "none", padding: 0, margin: 0 }} />
          </span>
        </div>
        <div className="flex gap-4 md:gap-4 items-center bg-primary shadow rounded-md py-2 px-4">
          <span onClick={undoStroke} className="cursor-pointer">
            <UndoOutlinedIcon
              sx={{ background: "none", padding: 0, margin: 0 }}
            />
          </span>

          <Popover>
            <PopoverTrigger>
              <span>
                <PaletteOutlinedIcon
                  sx={{ background: "none", padding: 0, margin: 0 }}
                />
              </span>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <StylingPallete />
            </PopoverContent>
          </Popover>

          <span onClick={redoStroke} className="cursor-pointer">
            <RedoOutlinedIcon
              sx={{ background: "none", padding: 0, margin: 0 }}
            />
          </span>
        </div>
      </div>
      <div>
        <h3 className="cursor-pointer font-semibold bg-primary shadow rounded-md py-2 px-4">
          <a
            href="https://github.com/Ajeet1606/sketchify"
            target="_blank"
            rel="noreferrer"
          >
            <GitHubIcon sx={{ background: "none", padding: 0, margin: 0 }} />
          </a>
        </h3>
      </div>
    </div>
  );
};

export default Footer;
