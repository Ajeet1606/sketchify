import BackHandOutlinedIcon from "@mui/icons-material/BackHandOutlined";
import NorthWestOutlinedIcon from "@mui/icons-material/NorthWestOutlined";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import BackspaceOutlinedIcon from "@mui/icons-material/BackspaceOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

interface props {
  setMode: (mode: string) => void;
}

const Toolbar: React.FC<props> = ({ setMode }) => {
  return (
    <div className="flex justify-center items-center gap-6 px-6 py-4 h-12 shadow rounded-md select-none cursor-default mt-4 z-10">
      <h3 className="cursor-pointer">
        <BackHandOutlinedIcon />
      </h3>
      <h3 className="cursor-pointer" onClick={() => setMode("cursor")}>
        <NorthWestOutlinedIcon />
      </h3>
      <h3 className="cursor-pointer">
        <CropSquareIcon />
      </h3>
      <h3 className="cursor-pointer">
        <ArrowForwardIcon />
      </h3>
      <h3 className="cursor-pointer">
        <HorizontalRuleIcon />
      </h3>
      <h3 className="cursor-pointer">
        <CreateOutlinedIcon />
      </h3>
      <h3 className="text-xl font-semibold cursor-pointer">Aa</h3>
      <h3 className="cursor-pointer" onClick={() => setMode("eraser")}>
        <BackspaceOutlinedIcon />
      </h3>
    </div>
  );
};

export default Toolbar;
