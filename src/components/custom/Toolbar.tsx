import BackHandIcon from "@mui/icons-material/BackHand";
import NorthWestIcon from "@mui/icons-material/NorthWest";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import BackspaceIcon from "@mui/icons-material/Backspace";
import CreateIcon from "@mui/icons-material/Create";

interface props {
  setMode: (mode: string) => void;
}

const Toolbar: React.FC<props> = ({ setMode }) => {
  return (
    <div className="flex justify-center items-center gap-6 px-6 py-4 h-12 shadow rounded-md absolute left-1/2 transform -translate-x-1/2 select-none cursor-default mt-4 mb-2 z-10">
      <h3 className="cursor-pointer">
        <BackHandIcon />
      </h3>
      <h3 className="cursor-pointer" onClick={() => setMode("cursor")}>
        <NorthWestIcon />
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
        <CreateIcon />
      </h3>
      <h3 className="text-xl font-bold cursor-pointer">Aa</h3>
      <h3 className="cursor-pointer" onClick={() => setMode("eraser")}>
        <BackspaceIcon />
      </h3>
    </div>
  );
};

export default Toolbar;
