import Footer from "@/components/custom/Footer";
import SketchCanvas from "@/components/custom/SketchCanvas";
import Toolbar from "@/components/custom/Toolbar";
import { useState } from "react";

const Home = () => {
  const [mode, setMode] = useState("cursor");
  return (
    <div className="h-screen overflow-hidden font-sans">
      <div className="h-[10%] absolute flex justify-center w-full top-0">
        <Toolbar setMode={setMode} />
      </div>
      <div className="h-[100%]">
        <SketchCanvas mode={mode} />
      </div>
      <div className="h-[10%] absolute flex justify-between w-full bottom-0">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
