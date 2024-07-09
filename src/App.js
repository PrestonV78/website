import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Navbar from "./components/Navbar";
import End from "./components/End";
import Extras from "./components/Extras";
import ExternalNavbar from "./components/ExternalNavbar";

export default function App() {

  const [navbar, setNavbar] = useState(<Navbar />);

  const renderNavBar = () => {
    if (window.location.href.split("/")[3] === "") {
      setNavbar(<Navbar />);
      return;
    }
    setNavbar(<ExternalNavbar />);
  }

  useEffect(() => {
    renderNavBar();
    window.addEventListener("navigate", renderNavBar, false);
  }, []);

  return (
    <main className="bg-black text-gray-400 body-font">
      <Router>
        {navbar}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/extras' element={<Extras />} />
        </Routes>
        <End />
      </Router>
    </main>
  );
}