import React from "react";
import { Routes, Route, Router } from "react-router-dom";

import About from "./components/About";
import Contact from "./components/Contact";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Space from "./components/Space";
import Experience from "./components/Experience";
import End from "./components/End";

export default function App() {
  return (
    <main className="bg-black text-gray-400 body-font">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />} />
        </Routes>
        <End />
      </Router>
    </main>
  );
}
