import BackHandOutlinedIcon from "@mui/icons-material/BackHandOutlined";
import NorthWestOutlinedIcon from "@mui/icons-material/NorthWestOutlined";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import { useStrokes } from "@/context/StrokesContext";

const Toolbar = () => {
  const { updateMode, mode } = useStrokes();
  return (
    <div className="flex justify-center items-center gap-6 px-6 py-4 h-12 shadow rounded-md select-none cursor-default mt-4 z-10">
      {/* scroll */}
      <h3
        className={`cursor-pointer p-1 rounded ${
          mode === "scroll" ? "bg-primary" : ""
        }`}
        onClick={() => updateMode("scroll")}
      >
        <BackHandOutlinedIcon
          sx={{ background: "none", padding: 0, margin: 0 }}
        />
      </h3>
      {/* cursor */}
      <h3
        className={`cursor-pointer p-1 rounded ${
          mode === "cursor" ? "bg-primary" : ""
        }`}
        onClick={() => updateMode("cursor")}
      >
        <NorthWestOutlinedIcon
          sx={{ background: "none", padding: 0, margin: 0 }}
        />
      </h3>
      {/* square */}
      <h3
        className={`cursor-pointer p-1 rounded ${
          mode === "square" ? "bg-primary" : ""
        }`}
        onClick={() => updateMode("square")}
      >
        <CropSquareIcon sx={{ background: "none", padding: 0, margin: 0 }} />
      </h3>
      {/* arrow */}
      <h3
        className={`cursor-pointer p-1 rounded ${
          mode === "arrow" ? "bg-primary" : ""
        }`}
        onClick={() => updateMode("arrow")}
      >
        <ArrowForwardIcon sx={{ background: "none", padding: 0, margin: 0 }} />
      </h3>
      {/* straight line */}
      <h3
        className={`cursor-pointer p-1 rounded ${
          mode === "line" ? "bg-primary" : ""
        }`}
        onClick={() => updateMode("line")}
      >
        <HorizontalRuleIcon
          sx={{ background: "none", padding: 0, margin: 0 }}
        />
      </h3>
      {/* draw */}
      <h3
        className={`cursor-pointer p-1 rounded ${
          mode === "draw" ? "bg-primary" : ""
        }`}
        onClick={() => updateMode("draw")}
      >
        <CreateOutlinedIcon
          sx={{ background: "none", padding: 0, margin: 0 }}
        />
      </h3>
      {/* write */}
      <h3
        className={`text-lg font-semibold cursor-pointer p-1 rounded ${
          mode === "write" ? "bg-primary" : ""
        }`}
        onClick={() => updateMode("write")}
      >
        Aa
      </h3>
      {/* erase */}
      <h3
        className={`cursor-pointer p-1 rounded ${
          mode === "eraser" ? "bg-primary" : ""
        }`}
        onClick={() => updateMode("eraser")}
      >
        <BackspaceOutlinedIcon
          sx={{ background: "none", padding: 0, margin: 0 }}
        />
      </h3>
    </div>
  );
};

export default Toolbar;
