import BackHandOutlinedIcon from "@mui/icons-material/BackHandOutlined";
import NorthWestOutlinedIcon from "@mui/icons-material/NorthWestOutlined";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { useStrokes } from "@/context/StrokesContext";
import { Mode, ModeEnum } from "@/lib/utils";

const Toolbar = () => {
  const { updateMode, mode, updateCursorStyle } = useStrokes();

  const handleModeChange = (newMode: Mode) => {
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
      updateCursorStyle("crosshair");
    } else if (newMode === ModeEnum.ERASE) {
      updateMode(ModeEnum.ERASE);
      updateCursorStyle("pointer");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 px-2 py-2 md:px-6 md:py-4 md:h-16 shadow rounded-md select-none cursor-default mt-4 z-10 ">
      <div className="flex gap-4 md:gap-6">
        {/* scroll */}
        <h3
          className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
            mode === ModeEnum.SCROLL ? "bg-primary" : ""
          }`}
          onClick={() => handleModeChange(ModeEnum.SCROLL)}
        >
          <BackHandOutlinedIcon
            sx={{ background: "none", padding: 0, margin: 0 }}
          />
          <span className="text-sm text-right -mr-1 -mt-2 -mb-1">1</span>
        </h3>
        {/* draw */}
        <h3
          className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
            mode === ModeEnum.DRAW ? "bg-primary" : ""
          }`}
          onClick={() => handleModeChange(ModeEnum.DRAW)}
        >
          <CreateOutlinedIcon
            sx={{ background: "none", padding: 0, margin: 0 }}
          />
          <span className="text-sm text-right -mr-1 -mt-2 -mb-1">2</span>
        </h3>
        {/* square */}
        <h3
          className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
            mode === ModeEnum.SQUARE ? "bg-primary" : ""
          }`}
          onClick={() => handleModeChange(ModeEnum.SQUARE)}
        >
          <CropSquareIcon sx={{ background: "none", padding: 0, margin: 0 }} />
          <span className="text-sm text-right -mr-1 -mt-2 -mb-1">3</span>
        </h3>
        {/* cursor */}
        <h3
          className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
            mode === ModeEnum.CURSOR ? "bg-primary" : ""
          }`}
          onClick={() => handleModeChange(ModeEnum.CURSOR)}
        >
          <NorthWestOutlinedIcon
            sx={{ background: "none", padding: 0, margin: 0 }}
          />
          <span className="text-sm text-right -mr-1 -mt-2 -mb-1">4</span>
        </h3>
      </div>
      <div className="flex gap-4 md:gap-6">
        {/* arrow */}
        <h3
          className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
            mode === ModeEnum.ARROW ? "bg-primary" : ""
          }`}
          onClick={() => handleModeChange(ModeEnum.ARROW)}
        >
          <ArrowForwardIcon
            sx={{ background: "none", padding: 0, margin: 0 }}
          />
          <span className="text-sm text-right -mr-1 -mt-2 -mb-1">5</span>
        </h3>
        {/* straight line */}
        <h3
          className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
            mode === ModeEnum.LINE ? "bg-primary" : ""
          }`}
          onClick={() => handleModeChange(ModeEnum.LINE)}
        >
          <HorizontalRuleIcon
            sx={{ background: "none", padding: 0, margin: 0 }}
          />
          <span className="text-sm text-right -mr-1 -mt-2 -mb-1">6</span>
        </h3>
        {/* write */}
        <h3
          className={`text-lg font-semibold cursor-pointer py-1 px-2 rounded flex flex-col ${
            mode === ModeEnum.WRITE ? "bg-primary" : ""
          }`}
          onClick={() => handleModeChange(ModeEnum.WRITE)}
        >
          Aa
          <span className="text-sm text-right -mr-2 -mt-2 -mb-1">7</span>
        </h3>
        {/* erase */}
        <h3
          className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
            mode === ModeEnum.ERASE ? "bg-primary" : ""
          }`}
          onClick={() => handleModeChange(ModeEnum.ERASE)}
        >
          <BackspaceOutlinedIcon
            sx={{ background: "none", padding: 0, margin: 0 }}
          />
          <span className="text-sm text-right -mr-2 -mt-1 -mb-1">8</span>
        </h3>
      </div>
    </div>
  );
};

export default Toolbar;
