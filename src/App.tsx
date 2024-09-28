import "./App.css";
import Home from "./pages/Home";
import { StrokesProvider } from "./context/StrokesContext";

function App() {
  return (
    <>
      <StrokesProvider>
        <Home />
      </StrokesProvider>
    </>
  );
}

export default App;
