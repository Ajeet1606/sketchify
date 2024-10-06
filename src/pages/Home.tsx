import Footer from "@/components/custom/Footer";
import Info from "@/components/custom/Info";
import SketchCanvas from "@/components/custom/SketchCanvas";
import Toolbar from "@/components/custom/Toolbar";
import { useStrokes } from "@/context/StrokesContext";
import { ModeEnum } from "@/lib/utils";
const Home = () => {
  const { mode, strokes } = useStrokes();
  return (
      <div className="h-[100vh] overflow-hidden font-sans">
        <div className="absolute flex justify-center w-full top-0">
          <Toolbar />
        </div>
        <div className="h-[100%] relative">
          <SketchCanvas />
          {mode === ModeEnum.CURSOR && strokes.length === 0 && (
            <div className="h-[100%] flex items-center absolute top-0 left-0 w-full">
              <Info />
            </div>
          )}
        </div>
        <div className="absolute flex justify-between w-full bottom-0">
          <Footer />
        </div>
      </div>
  );
};

export default Home;
