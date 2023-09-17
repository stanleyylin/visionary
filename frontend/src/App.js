import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Settings from "./pages/settings/Settings";
import Dashboard from "./pages/dashboard/Dashboard";
import HomePage from "./pages/home/HomePage";
import Rolleyes from "./pages/roll-eyes/Rolleyes";

function App() {

  return (
    <>
      <NavBar />

      <Routes>
        <Route index element={<HomePage/>}/>
        <Route path="/settings" element={<Settings/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/rolleyes" element={<Rolleyes/>}/>
      </Routes>
    </ >
  );
}

export default App;
