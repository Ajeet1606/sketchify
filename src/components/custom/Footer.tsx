import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useStrokes } from "@/context/StrokesContext";
import GitHubIcon from "@mui/icons-material/GitHub";

const Footer = () => {
  const { undoStroke, redoStroke } = useStrokes();
  return (
    <div className="flex justify-between items-center gap-6 px-6 py-4 h-12 w-full select-none cursor-default mb-4 z-10">
      <div className="flex gap-3">
        <div className="flex gap-4 items-center bg-primary shadow rounded-md py-2 px-4">
          <span className="cursor-pointer">
            <RemoveIcon sx={{ background: "none", padding: 0, margin: 0 }} />
          </span>
          <h3 className="text-lg font-semibold">100%</h3>
          <span className="cursor-pointer">
            <AddIcon sx={{ background: "none", padding: 0, margin: 0 }} />
          </span>
        </div>
        <div className="flex gap-10 items-center bg-primary shadow rounded-md py-2 px-4">
          <span onClick={undoStroke} className="cursor-pointer">
            <UndoOutlinedIcon
              sx={{ background: "none", padding: 0, margin: 0 }}
            />
          </span>
          <span onClick={redoStroke} className="cursor-pointer">
            <RedoOutlinedIcon
              sx={{ background: "none", padding: 0, margin: 0 }}
            />
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-lg cursor-pointer font-semibold bg-primary shadow rounded-md py-2 px-4">
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
