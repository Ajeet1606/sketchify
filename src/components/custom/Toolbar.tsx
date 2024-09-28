import BackHandOutlinedIcon from "@mui/icons-material/BackHandOutlined";
import NorthWestOutlinedIcon from "@mui/icons-material/NorthWestOutlined";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { useStrokes } from "@/context/StrokesContext";
import { ModeEnum } from "@/lib/utils";

const Toolbar = () => {
  const { updateMode, mode } = useStrokes();
  return (
    <div className="flex justify-center items-center gap-6 px-6 py-4 h-16 shadow rounded-md select-none cursor-default mt-4 z-10">
      {/* scroll */}
      <h3
        className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
          mode === ModeEnum.SCROLL ? "bg-primary" : ""
        }`}
        onClick={() => updateMode(ModeEnum.SCROLL)}
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
        onClick={() => updateMode(ModeEnum.DRAW)}
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
        onClick={() => updateMode(ModeEnum.SQUARE)}
      >
        <CropSquareIcon sx={{ background: "none", padding: 0, margin: 0 }} />
        <span className="text-sm text-right -mr-1 -mt-2 -mb-1">3</span>
      </h3>
      {/* cursor */}
      <h3
        className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
          mode === ModeEnum.CURSOR ? "bg-primary" : ""
        }`}
        onClick={() => updateMode(ModeEnum.CURSOR)}
      >
        <NorthWestOutlinedIcon
          sx={{ background: "none", padding: 0, margin: 0 }}
        />
        <span className="text-sm text-right -mr-1 -mt-2 -mb-1">4</span>
      </h3>
      {/* arrow */}
      <h3
        className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
          mode === ModeEnum.ARROW ? "bg-primary" : ""
        }`}
        onClick={() => updateMode(ModeEnum.ARROW)}
      >
        <ArrowForwardIcon sx={{ background: "none", padding: 0, margin: 0 }} />
        <span className="text-sm text-right -mr-1 -mt-2 -mb-1">5</span>
      </h3>
      {/* straight line */}
      <h3
        className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
          mode === ModeEnum.LINE ? "bg-primary" : ""
        }`}
        onClick={() => updateMode(ModeEnum.LINE)}
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
        onClick={() => updateMode(ModeEnum.WRITE)}
      >
        Aa
        <span className="text-sm text-right -mr-2 -mt-2 -mb-1">7</span>
      </h3>
      {/* erase */}
      <h3
        className={`cursor-pointer py-1 px-2 rounded flex flex-col ${
          mode === ModeEnum.ERASE ? "bg-primary" : ""
        }`}
        onClick={() => updateMode(ModeEnum.ERASE)}
      >
        <BackspaceOutlinedIcon
          sx={{ background: "none", padding: 0, margin: 0 }}
        />
        <span className="text-sm text-right -mr-2 -mt-1 -mb-1">8</span>
      </h3>
    </div>
  );
};

export default Toolbar;
