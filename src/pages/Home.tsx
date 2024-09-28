import Footer from "@/components/custom/Footer";
import SketchCanvas from "@/components/custom/SketchCanvas";
import Toolbar from "@/components/custom/Toolbar";

const Home = () => {
  return (
    <div className="h-screen overflow-hidden font-sans">
      <div className="h-[10%] absolute flex justify-center w-full top-0">
        <Toolbar />
      </div>
      <div className="h-[100%]">
        <SketchCanvas />
      </div>
      <div className="h-[10%] absolute flex justify-between w-full bottom-0">
        <Footer />
      </div>
    </div>
  );
};

export default Home;
