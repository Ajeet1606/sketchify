import SketchCanvas from "@/components/custom/SketchCanvas";
import Toolbar from "@/components/custom/Toolbar";
import { useState } from "react";

const Home = () => {
  const [mode, setMode] = useState("cursor");
  return (
    <div className="h-screen">
      <Toolbar setMode = {setMode}/>
      <SketchCanvas mode= {mode}/>
    </div>
  );
};

export default Home;
