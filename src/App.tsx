import "./App.css";
import Home from "./pages/Home";
import { StrokesProvider } from "./context/StrokesContext";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <StrokesProvider>
        <Home />
        <Toaster />
      </StrokesProvider>
    </>
  );
}

export default App;
