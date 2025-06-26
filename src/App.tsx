import { Route, Routes } from "react-router-dom";
import MyApp from "./pages/parte final/MyApp";


function App() {
  return (
    <Routes>
      <Route element={<MyApp />} path="/" />
    </Routes>
  );
}

export default App;
