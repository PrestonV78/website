import React from "react";
import { Routes, Route, Router } from "react-router-dom";

import About from "./About";
import Contact from "./Contact";
import Projects from "./Projects";
import Skills from "./Skills";
import Space from "./Space";
import Experience from "./Experience";

export default function Home() {
  return (
    <div>
      <About />
      <Projects />
      <Space />
      <Experience />
      <Skills />
      <Contact />
      <Router>
        <Routes>
          <Route exact path="/about" element={<About />} />
          <Route exact path="/projects" element={<Projects />} />
          <Route exact path="/experience" element={<Experience />} />
          <Route exact path="/skills" element={<Skills />} />
          <Route exact path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}
