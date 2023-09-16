import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Settings from "./pages/settings/Settings";
import Dashboard from "./pages/dashboard/Dashboard";
import HomePage from "./pages/home/HomePage";

function App() {
  return (
    <>
      <NavBar />

      <Routes>
        <Route index element={<HomePage/>}/>
        <Route path="/settings" element={<Settings/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </ >
  );
}

export default App;
