import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/home/Home";
import Settings from "./pages/settings/Settings";
import Dashboard from "./pages/dashboard/Dashboard";

function App() {
  return (
    <Fragment>
      <NavBar />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Fragment>
  );
}

export default App;
