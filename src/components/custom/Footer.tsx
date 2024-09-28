import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RedoOutlinedIcon from "@mui/icons-material/RedoOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useStrokes } from "@/context/StrokesContext";

const Footer = () => {
  const { undoStroke, redoStroke } = useStrokes();
  return (
    <div className="flex justify-between items-center gap-6 px-6 py-4 h-12 w-full select-none cursor-default mb-4 z-10">
      <div className="flex gap-3">
        <div className="flex gap-4 items-center bg-white shadow rounded-md py-2 px-4">
          <RemoveIcon />
          <h3 className="text-lg font-semibold">100%</h3>
          <AddIcon />
        </div>
        <div className="flex gap-4 items-center bg-white shadow rounded-md py-2 px-4">
          <span onClick={undoStroke} className="cursor-pointer">
            <UndoOutlinedIcon />
          </span>
          <span onClick={redoStroke} className="cursor-pointer">
            <RedoOutlinedIcon />
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold bg-white shadow rounded-md py-2 px-4">
          Made with ❤️
        </h3>
      </div>
    </div>
  );
};

export default Footer;
